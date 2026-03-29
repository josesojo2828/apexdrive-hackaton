import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CarsService } from '../cars/cars.service';
import { AuctionsGateway } from './auctions.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuctionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly carsService: CarsService,
        private readonly gateway: AuctionsGateway,
        private readonly eventEmitter: EventEmitter2
    ) {}

    async findAll(userId?: string) {
        const whereClause = userId ? {
            OR: [
                { bids: { some: { userId } } },
                { winnerId: userId }
            ]
        } : {};

        return this.prisma.auction.findMany({
            where: whereClause,
            include: {
                car: true,
                bids: {
                    orderBy: { amount: 'desc' },
                    take: 1,
                    include: { user: true }
                },
                winner: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async createAuction(data: { 
        carId: string; 
        startingPrice?: number; 
        startDate: any; 
        endDate: any; 
        status: 'ACTIVE' | 'UPCOMING' 
    }) {
        const { carId, startingPrice, status } = data;
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new BadRequestException('Las fechas proporcionadas no son válidas.');
        }

        const car = await this.carsService.findById(carId);
        if (car.status !== 'AVAILABLE' && status === 'ACTIVE') {
            throw new BadRequestException('El auto debe estar DISPONIBLE para iniciar una subasta activa.');
        }

        const finalStartingPrice = startingPrice || Number(car.basePrice || 0);

        return this.prisma.$transaction(async (prisma) => {
            const auction = await prisma.auction.create({
                data: {
                    carId,
                    startingPrice: finalStartingPrice,
                    currentPrice: finalStartingPrice,
                    startDate,
                    endDate,
                    status
                }
            });

            if (status === 'ACTIVE') {
                await prisma.car.update({
                    where: { id: carId },
                    data: { status: 'IN_AUCTION' }
                });
            }

            this.gateway.emitAuctionChange();
            return auction;
        });
    }

    async updateAuction(id: string, updateData: {
        carId?: string;
        startingPrice?: number;
        startDate?: Date;
        endDate?: Date;
        status?: any;
    }) {
        const auction = await this.prisma.auction.findUnique({
            where: { id },
            include: { bids: { take: 1 } }
        });

        if (!auction) throw new NotFoundException('Subasta no encontrada');

        // Validation for editing Car: Only if not active/started
        if (updateData.carId && updateData.carId !== auction.carId) {
            const isStarted = new Date() >= auction.startDate && new Date() <= auction.endDate;
            if (auction.status === 'ACTIVE' && isStarted) {
                throw new BadRequestException('No se puede cambiar el vehículo de una subasta activa en curso.');
            }
        }

        // Transform dates if present
        const dataToUpdate: any = { ...updateData };
        if (updateData.startDate) {
            dataToUpdate.startDate = new Date(updateData.startDate);
            if (isNaN(dataToUpdate.startDate.getTime())) throw new BadRequestException('Fecha de inicio inválida');
        }
        if (updateData.endDate) {
            dataToUpdate.endDate = new Date(updateData.endDate);
            if (isNaN(dataToUpdate.endDate.getTime())) throw new BadRequestException('Fecha de fin inválida');
        }

        return this.prisma.$transaction(async (prisma) => {
            const updatedAuction = await prisma.auction.update({
                where: { id },
                data: dataToUpdate
            });

            // If status changed to ACTIVE, update car status
            if (updateData.status === 'ACTIVE' && auction.status !== 'ACTIVE') {
                await prisma.car.update({
                    where: { id: updatedAuction.carId },
                    data: { status: 'IN_AUCTION' }
                });
            }

            this.gateway.emitAuctionChange();
            return updatedAuction;
        });
    }

    async deleteAuction(id: string) {
        const auction = await this.prisma.auction.findUnique({
            where: { id }
        });
        if (!auction) throw new NotFoundException('Subasta no encontrada');

        return this.prisma.$transaction(async (prisma) => {
            await prisma.car.update({
                where: { id: auction.carId },
                data: { status: 'AVAILABLE' }
            });
            await prisma.auction.delete({ where: { id } });
            this.gateway.emitAuctionChange();
            return { message: 'Subasta eliminada' };
        });
    }

    async getAuctionDetails(auctionId: string) {
        const auction = await this.prisma.auction.findUnique({
            where: { id: auctionId },
            include: { 
                bids: { 
                    orderBy: { createdAt: 'desc' }, 
                    include: { user: true } 
                }, 
                car: true, 
                winner: true 
            }
        });
        if (!auction) throw new NotFoundException('Subasta no encontrada');
        return auction;
    }

    async placeBid(auctionId: string, userId: string, amount: number) {
        const auction = await this.prisma.auction.findUnique({
            where: { id: auctionId },
            include: { 
                bids: { orderBy: { amount: 'desc' }, take: 1 },
                car: true
            }
        });

        if (!auction) throw new NotFoundException('Subasta no encontrada');
        if (auction.status !== 'ACTIVE') throw new BadRequestException('La subasta ya está cerrada');
        if (new Date() > auction.endDate) throw new BadRequestException('El tiempo de la subasta ya terminó');

        const highestBid = auction.bids.length > 0 ? Number(auction.bids[0].amount) : Number(auction.startingPrice);

        if (amount <= highestBid) {
            throw new BadRequestException(`La puja debe ser mayor a la mejor puja actual o precio base: ${highestBid}`);
        }

        const result = await this.prisma.$transaction(async (prisma) => {
            const bid = await prisma.bid.create({
                data: {
                    auctionId,
                    userId,
                    amount
                },
                include: { user: true }
            });

            const updatedAuction = await prisma.auction.update({
                where: { id: auctionId },
                data: { currentPrice: amount },
                include: { car: true }
            });

            this.gateway.emitNewBid(auctionId, { bid, auction: updatedAuction });
            return { bid, auction: updatedAuction };
        });

        // Emit Event for Notifications
        this.eventEmitter.emit('auction.bid.placed', {
            auctionId,
            userId: result.bid.userId,
            amount: Number(result.bid.amount),
            userName: `${result.bid.user.firstName} ${result.bid.user.lastName}`,
            carBrand: result.auction.car.brand,
            carModel: result.auction.car.model
        });

        return result.bid;
    }

    async closeAuctionManually(auctionId: string) {
        const auction = await this.getAuctionDetails(auctionId);
        if (auction.status === 'RESOLVED' || auction.status === 'CLOSED') {
            throw new BadRequestException('La subasta ya está cerrada');
        }

        const highestBid = auction.bids.length > 0 ? auction.bids[0] : null;

        return this.prisma.$transaction(async (prisma) => {
            const updatedAuction = await prisma.auction.update({
                where: { id: auctionId },
                data: {
                    status: 'RESOLVED',
                    winnerId: highestBid ? highestBid.userId : null
                }
            });

            if (highestBid) {
                await prisma.car.update({
                    where: { id: auction.carId },
                    data: { status: 'SOLD' }
                });
            } else {
                await prisma.car.update({
                    where: { id: auction.carId },
                    data: { status: 'AVAILABLE' }
                });
            }

            this.gateway.emitAuctionChange();
            return updatedAuction;
        });
    }
}
