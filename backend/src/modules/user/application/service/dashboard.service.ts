import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { RentalStatus } from 'prisma/generated/client';

@Injectable()
export default class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getStats(user: any, dateRange?: { start: string, end: string }) {
        const userId = user?.id || user?.sub;
        if (!userId) {
            console.error('[DASHBOARD_STATS_ERROR]: User ID missing in request');
            throw new UnauthorizedException('No user identification found');
        }

        const role = (user.role || user.permissions?.name || "").toUpperCase();
        console.log(`[DASHBOARD_STATS_LOG]: User: ${user.email}, Role: ${role}, ID: ${userId}`);

        if (role === 'ADMIN' || role.includes('ADMIN')) {
            const [users, cars, rentals, auctions, transactions] = await Promise.all([
                this.prisma.user.count(),
                this.prisma.car.count(),
                this.prisma.rental.count(),
                this.prisma.auction.count(),
                this.prisma.transaction.count()
            ]);

            return [
                { label: 'Usuarios', value: users.toString(), delta: '+12%', icon: 'cat-transport', color: 'from-blue-500 to-blue-700' },
                { label: 'Flota Total', value: cars.toString(), delta: 'Ready', icon: 'cat-transport', color: 'from-emerald-500 to-emerald-700' },
                { label: 'Reservas', value: rentals.toString(), delta: 'Activas', icon: 'srv-calendar-booking', color: 'from-amber-500 to-amber-700' },
                { label: 'Subastas', value: auctions.toString(), delta: 'Live', icon: 'msg-broadcast', color: 'from-rose-500 to-rose-700' },
            ];
        } else {
            // User stats - Ensure we filter by userId strictly
            const activeStatuses: any = ['ACTIVE', 'PENDING'];
            
            const whereCars: any = {
                OR: [
                    { ownerId: userId },
                    { auctions: { some: { winnerId: userId } } },
                    { rentals: { some: { userId: userId, status: { in: activeStatuses } } } }
                ]
            };
            
            const [myRentals, myBids, myWonAuctions, myCars] = await Promise.all([
                this.prisma.rental.count({ where: { userId: userId, status: { in: activeStatuses } } }),
                this.prisma.bid.count({ where: { userId: userId } }),
                this.prisma.auction.count({ where: { winnerId: userId } }),
                this.prisma.car.count({ where: whereCars })
            ]);

            console.log(`[DASHBOARD_STATS_LOG]: Stats for ${userId}: Cars=${myCars}, Rentals=${myRentals}, Bids=${myBids}`);

            return [
                { label: 'Mi Flota', value: myCars.toString(), delta: 'Ready', icon: 'cat-transport', color: 'from-[#1D1D1F] to-[#434343]' },
                { label: 'Mis Reservas', value: myRentals.toString(), delta: 'Activas', icon: 'srv-calendar-booking', color: 'from-blue-600 to-blue-800' },
                { label: 'Subasta', value: myBids.toString(), delta: 'Pujadas', icon: 'msg-broadcast', color: 'from-orange-500 to-orange-700' },
                { label: 'Ganadas', value: myWonAuctions.toString(), delta: 'Nuevas', icon: 'fin-transaction', color: 'from-emerald-500 to-emerald-700' },
            ];
        }
    }

    async getPages(user: any) {
        const role = (user.role || user.permissions?.name || "").toUpperCase();
        console.log(`[GET_PAGES_LOG]: User: ${user.email}, Role: ${role}`);

        if (role === 'ADMIN' || role.includes('ADMIN')) {
            return [
                { icon: 'LayoutDashboard', href: "/dashboard", label: "Panel" },
                { icon: 'Car', href: "/dashboard/cars", label: "Flota" },
                { icon: 'Banknote', href: "/dashboard/finance", label: "Finanzas" },
                { icon: 'Users', href: "/dashboard/users", label: "Usuarios" },
                { icon: 'Wallet', href: "/dashboard/auctions", label: "Subastas" },
                { icon: 'Clock', href: "/dashboard/rentals", label: "Reservas" },
            ];
        }

        return [
            { icon: 'LayoutDashboard', href: "/dashboard", label: "Panel" },
            { icon: 'Car', href: "/dashboard/cars", label: "Flota" },
            { icon: 'Wallet', href: "/dashboard/auctions", label: "Subasta" },
            { icon: 'Clock', href: "/dashboard/rentals", label: "Reserva" },
        ];
    }

    async getTripDistribution(user: any, dateRange?: { start: string, end: string }) { return []; }
    async getTripStatusDistribution(user: any, dateRange?: { start: string, end: string }) { return []; }
    async getTimeSeriesData(user: any, dateRange?: { start: string, end: string }) { return []; }
    async getRecentSessions(limit: number, type: string) { return []; }
    async getTopPerformers() { return []; }
}
