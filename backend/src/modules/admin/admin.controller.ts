import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from 'src/config/prisma.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
    constructor(private readonly prisma: PrismaService) {}

    // Stats globales del sistema
    @Get('stats')
    async getSystemStats() {
        const [
            totalUsers, activeUsers, totalCars, availableCars, rentedCars,
            inAuctionCars, soldCars, maintenanceCars,
            totalRentals, activeRentals, completedRentals,
            totalAuctions, activeAuctions,
            totalTransactions
        ] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { status: 'ACTIVE' } }),
            this.prisma.car.count(),
            this.prisma.car.count({ where: { status: 'AVAILABLE' } }),
            this.prisma.car.count({ where: { status: 'RENTED' } }),
            this.prisma.car.count({ where: { status: 'IN_AUCTION' } }),
            this.prisma.car.count({ where: { status: 'SOLD' } }),
            this.prisma.car.count({ where: { status: 'MAINTENANCE' } }),
            this.prisma.rental.count(),
            this.prisma.rental.count({ where: { status: 'ACTIVE' } }),
            this.prisma.rental.count({ where: { status: 'COMPLETED' } }),
            this.prisma.auction.count(),
            this.prisma.auction.count({ where: { status: 'ACTIVE' } }),
            this.prisma.transaction.count(),
        ]);

        // Totales financieros
        const walletAgg = await this.prisma.wallet.aggregate({ _sum: { balance: true } });
        const rentalAgg = await this.prisma.rental.aggregate({ _sum: { totalAmount: true, paidAmount: true } });
        const txAgg = await this.prisma.transaction.aggregate({ _sum: { amount: true } });

        // Últimas transacciones
        const recentTransactions = await this.prisma.transaction.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { firstName: true, lastName: true, email: true } } }
        });

        // Ingresos por mes (últimos 6 meses)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlyTx = await this.prisma.transaction.findMany({
            where: { createdAt: { gte: sixMonthsAgo }, status: 'COMPLETED' },
            select: { amount: true, createdAt: true }
        });

        const monthlyData: Record<string, number> = {};
        monthlyTx.forEach(tx => {
            const key = `${tx.createdAt.getFullYear()}-${String(tx.createdAt.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[key] = (monthlyData[key] || 0) + Number(tx.amount);
        });

        return {
            users: { total: totalUsers, active: activeUsers },
            cars: { total: totalCars, available: availableCars, rented: rentedCars, inAuction: inAuctionCars, sold: soldCars, maintenance: maintenanceCars },
            rentals: { total: totalRentals, active: activeRentals, completed: completedRentals },
            auctions: { total: totalAuctions, active: activeAuctions },
            transactions: { total: totalTransactions },
            finance: {
                totalWalletBalance: Number(walletAgg._sum.balance || 0),
                totalRentalRevenue: Number(rentalAgg._sum.totalAmount || 0),
                totalPaid: Number(rentalAgg._sum.paidAmount || 0),
                totalTransactionVolume: Number(txAgg._sum.amount || 0),
            },
            recentTransactions,
            monthlyRevenue: Object.entries(monthlyData).sort().map(([month, amount]) => ({ month, amount })),
        };
    }

    // Stats financieras completas
    @Get('finance/stats')
    async getFinanceStats() {
        // Aggregaciones principales
        const walletAgg = await this.prisma.wallet.aggregate({ _sum: { balance: true }, _avg: { balance: true }, _count: true });
        const rentalAgg = await this.prisma.rental.aggregate({ _sum: { totalAmount: true, paidAmount: true }, _avg: { totalAmount: true } });
        const txAgg = await this.prisma.transaction.aggregate({ _sum: { amount: true }, _avg: { amount: true }, _count: true });
        const auctionAgg = await this.prisma.auction.aggregate({ _sum: { currentPrice: true } });

        const totalRevenue = Number(rentalAgg._sum.totalAmount || 0);
        const totalPaid = Number(rentalAgg._sum.paidAmount || 0);
        const totalTxVolume = Number(txAgg._sum.amount || 0);
        const totalWallets = Number(walletAgg._sum.balance || 0);
        const totalAuctionValue = Number(auctionAgg._sum.currentPrice || 0);

        // Transacciones por tipo
        const txByType = await this.prisma.transaction.groupBy({
            by: ['type'],
            _sum: { amount: true },
            _count: true,
        });
        const txByTypeFormatted = txByType.map(t => ({
            type: t.type,
            count: t._count,
            volume: Number(t._sum.amount || 0),
        }));

        // Transacciones por estado
        const txByStatus = await this.prisma.transaction.groupBy({
            by: ['status'],
            _sum: { amount: true },
            _count: true,
        });
        const txByStatusFormatted = txByStatus.map(t => ({
            status: t.status,
            count: t._count,
            volume: Number(t._sum.amount || 0),
        }));

        // Top 5 usuarios por gasto (pagos en alquileres)
        const topSpenders = await this.prisma.user.findMany({
            take: 5,
            include: {
                rentals: { select: { paidAmount: true } },
                wallet: { select: { balance: true } },
                transactions: { select: { amount: true } },
            },
        });
        const topSpendersFormatted = topSpenders
            .map(u => ({
                id: u.id,
                name: `${u.firstName} ${u.lastName}`,
                rentalSpend: u.rentals.reduce((s, r) => s + Number(r.paidAmount), 0),
                txVolume: u.transactions.reduce((s, t) => s + Number(t.amount), 0),
                walletBalance: Number(u.wallet?.balance || 0),
            }))
            .sort((a, b) => b.rentalSpend - a.rentalSpend)
            .slice(0, 5);

        // Flujo mensual (últimos 12 meses) - Ingresos alquileres + Transacciones
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const [monthlyRentals, monthlyTx] = await Promise.all([
            this.prisma.rental.findMany({
                where: { createdAt: { gte: twelveMonthsAgo } },
                select: { createdAt: true, paidAmount: true },
            }),
            this.prisma.transaction.findMany({
                where: { createdAt: { gte: twelveMonthsAgo }, status: 'COMPLETED' },
                select: { createdAt: true, amount: true },
            }),
        ]);

        const monthly: Record<string, { rentals: number; transactions: number }> = {};
        monthlyRentals.forEach(r => {
            const key = `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, '0')}`;
            if (!monthly[key]) monthly[key] = { rentals: 0, transactions: 0 };
            monthly[key].rentals += Number(r.paidAmount);
        });
        monthlyTx.forEach(t => {
            const key = `${t.createdAt.getFullYear()}-${String(t.createdAt.getMonth() + 1).padStart(2, '0')}`;
            if (!monthly[key]) monthly[key] = { rentals: 0, transactions: 0 };
            monthly[key].transactions += Number(t.amount);
        });
        const monthlyFlow = Object.entries(monthly).sort().map(([month, data]) => ({
            month, rentals: data.rentals, transactions: data.transactions, total: data.rentals + data.transactions,
        }));

        // Últimas 15 transacciones
        const recentTx = await this.prisma.transaction.findMany({
            take: 15,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { firstName: true, lastName: true } } },
        });

        return {
            overview: {
                totalRevenue,
                totalPaid,
                pendingPayments: totalRevenue - totalPaid,
                totalTxVolume,
                totalWallets,
                totalAuctionValue,
                avgRental: Number(rentalAgg._avg.totalAmount || 0),
                avgTransaction: Number(txAgg._avg.amount || 0),
                avgWallet: Number(walletAgg._avg.balance || 0),
                totalTxCount: txAgg._count,
                totalWalletCount: walletAgg._count,
            },
            txByType: txByTypeFormatted,
            txByStatus: txByStatusFormatted,
            topSpenders: topSpendersFormatted,
            monthlyFlow,
            recentTransactions: recentTx.map(t => ({
                id: t.id,
                type: t.type,
                amount: Number(t.amount),
                status: t.status,
                user: t.user ? `${t.user.firstName} ${t.user.lastName}` : null,
                date: t.createdAt,
                description: t.description,
            })),
        };
    }

    // Stats de reservas
    @Get('rentals/stats')
    async getRentalStats() {
        const [total, active, pending, completed, cancelled] = await Promise.all([
            this.prisma.rental.count(),
            this.prisma.rental.count({ where: { status: 'ACTIVE' } }),
            this.prisma.rental.count({ where: { status: 'PENDING' } }),
            this.prisma.rental.count({ where: { status: 'COMPLETED' } }),
            this.prisma.rental.count({ where: { status: 'CANCELLED' } }),
        ]);

        const agg = await this.prisma.rental.aggregate({
            _sum: { totalAmount: true, paidAmount: true },
            _avg: { totalAmount: true },
        });

        // Top 5 vehículos más alquilados
        const topCars = await this.prisma.car.findMany({
            take: 5,
            orderBy: { rentals: { _count: 'desc' } },
            include: { _count: { select: { rentals: true } } },
        });
        const topCarsFormatted = topCars.map(c => ({
            id: c.id,
            car: `${c.brand} ${c.model}`,
            year: c.year,
            image: c.images?.[0] || null,
            rentals: c._count.rentals,
        }));

        // Reservas por mes (últimos 6 meses)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const recentRentals = await this.prisma.rental.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true },
        });
        const rentalsByMonth: Record<string, number> = {};
        recentRentals.forEach(r => {
            const key = `${r.createdAt.getFullYear()}-${String(r.createdAt.getMonth() + 1).padStart(2, '0')}`;
            rentalsByMonth[key] = (rentalsByMonth[key] || 0) + 1;
        });

        return {
            total,
            byStatus: { active, pending, completed, cancelled },
            finance: {
                totalRevenue: Number(agg._sum.totalAmount || 0),
                totalPaid: Number(agg._sum.paidAmount || 0),
                pending: Number(agg._sum.totalAmount || 0) - Number(agg._sum.paidAmount || 0),
                avgRental: Number(agg._avg.totalAmount || 0),
            },
            topCars: topCarsFormatted,
            monthlyTrend: Object.entries(rentalsByMonth).sort().map(([month, count]) => ({ month, count })),
        };
    }

    // Stats de subastas
    @Get('auctions/stats')
    async getAuctionStats() {
        const [total, active, upcoming, resolved, cancelled] = await Promise.all([
            this.prisma.auction.count(),
            this.prisma.auction.count({ where: { status: 'ACTIVE' } }),
            this.prisma.auction.count({ where: { status: 'UPCOMING' } }),
            this.prisma.auction.count({ where: { status: 'RESOLVED' } }),
            this.prisma.auction.count({ where: { status: 'CANCELLED' } }),
        ]);

        const totalBids = await this.prisma.bid.count();
        const bidAgg = await this.prisma.bid.aggregate({ _sum: { amount: true }, _avg: { amount: true } });
        const auctionPriceAgg = await this.prisma.auction.aggregate({ _sum: { currentPrice: true }, _avg: { currentPrice: true } });

        // Top 5 subastas por precio actual
        const topAuctions = await this.prisma.auction.findMany({
            take: 5,
            orderBy: { currentPrice: 'desc' },
            include: {
                car: { select: { brand: true, model: true, year: true, images: true } },
                winner: { select: { firstName: true, lastName: true } },
                _count: { select: { bids: true } },
            },
        });

        const topFormatted = topAuctions.map(a => ({
            id: a.id,
            car: `${a.car?.brand} ${a.car?.model}`,
            year: a.car?.year,
            image: a.car?.images?.[0] || null,
            status: a.status,
            startingPrice: Number(a.startingPrice),
            currentPrice: Number(a.currentPrice),
            bidsCount: a._count.bids,
            winner: a.winner ? `${a.winner.firstName} ${a.winner.lastName}` : null,
        }));

        // Subastas por mes (últimos 6 meses)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const recentAuctions = await this.prisma.auction.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true, status: true },
        });
        const auctionsByMonth: Record<string, number> = {};
        recentAuctions.forEach(a => {
            const key = `${a.createdAt.getFullYear()}-${String(a.createdAt.getMonth() + 1).padStart(2, '0')}`;
            auctionsByMonth[key] = (auctionsByMonth[key] || 0) + 1;
        });

        return {
            total,
            byStatus: { active, upcoming, resolved, cancelled },
            bids: { total: totalBids, totalVolume: Number(bidAgg._sum.amount || 0), avgBid: Number(bidAgg._avg.amount || 0) },
            pricing: { totalValue: Number(auctionPriceAgg._sum.currentPrice || 0), avgPrice: Number(auctionPriceAgg._avg.currentPrice || 0) },
            topAuctions: topFormatted,
            monthlyTrend: Object.entries(auctionsByMonth).sort().map(([month, count]) => ({ month, count })),
        };
    }

    // Stats de usuarios
    @Get('users/stats')
    async getUserStats() {
        const [totalUsers, admins, regularUsers, active, suspended, pending, banned] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: 'ADMIN' } }),
            this.prisma.user.count({ where: { role: 'USER' } }),
            this.prisma.user.count({ where: { status: 'ACTIVE' } }),
            this.prisma.user.count({ where: { status: 'SUSPENDED' } }),
            this.prisma.user.count({ where: { status: 'PENDING_VERIFICATION' } }),
            this.prisma.user.count({ where: { status: 'BANNED' } }),
        ]);

        const walletAgg = await this.prisma.wallet.aggregate({ _sum: { balance: true }, _avg: { balance: true } });
        
        // Top 5 usuarios por gasto en alquileres
        const topSpenders = await this.prisma.user.findMany({
            take: 5,
            include: {
                wallet: true,
                _count: { select: { rentals: true, bids: true } },
                rentals: { select: { totalAmount: true } },
            },
            orderBy: { rentals: { _count: 'desc' } },
        });

        const topSpendersFormatted = topSpenders.map(u => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email, 
            rentals: u._count.rentals,
            bids: u._count.bids,
            totalSpent: u.rentals.reduce((s, r) => s + Number(r.totalAmount), 0),
            walletBalance: Number(u.wallet?.balance || 0),
        }));

        // Registros por mes (últimos 6 meses)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const recentUsers = await this.prisma.user.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true },
        });
        const registrationsByMonth: Record<string, number> = {};
        recentUsers.forEach(u => {
            const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, '0')}`;
            registrationsByMonth[key] = (registrationsByMonth[key] || 0) + 1;
        });

        return {
            total: totalUsers,
            byRole: { admins, users: regularUsers },
            byStatus: { active, suspended, pending, banned },
            wallets: {
                totalBalance: Number(walletAgg._sum.balance || 0),
                avgBalance: Number(walletAgg._avg.balance || 0),
            },
            topSpenders: topSpendersFormatted,
            registrationTrend: Object.entries(registrationsByMonth).sort().map(([month, count]) => ({ month, count })),
        };
    }

    // Lista de usuarios paginada
    @Get('users')
    async getUsers(@Query('page') page = '1', @Query('limit') limit = '10', @Query('role') role?: string) {
        const skip = (Number(page) - 1) * Number(limit);
        const where: any = {};
        if (role) where.role = role;

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    profile: true,
                    wallet: true,
                    _count: { select: { rentals: true, bids: true, transactions: true } }
                }
            }),
            this.prisma.user.count({ where })
        ]);

        return { data: users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
    }

    // Detalle de usuario con toda su actividad
    @Get('users/:id')
    async getUserDetail(@Param('id') id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                profile: true,
                wallet: true,
                rentals: { include: { car: true }, orderBy: { createdAt: 'desc' }, take: 20 },
                bids: { include: { auction: { include: { car: true } } }, orderBy: { createdAt: 'desc' }, take: 20 },
                auctionsWon: { include: { car: true }, orderBy: { createdAt: 'desc' } },
                transactions: { orderBy: { createdAt: 'desc' }, take: 20 },
            }
        });
        return user;
    }
    // Actualizar rol o estado de un usuario
    @Patch('users/:id')
    async updateUser(@Param('id') id: string, @Body() body: { role?: string; status?: string }) {
        const data: any = {};
        if (body.role) data.role = body.role;
        if (body.status) data.status = body.status;
        return this.prisma.user.update({ where: { id }, data });
    }
}
