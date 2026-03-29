import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CarStatus } from 'prisma/generated/client';

@Injectable()
export class CarsService {
    constructor(private readonly prisma: PrismaService) {}

    async createCar(data: { brand: string, model: string, year: number, plate: string, type: string, description?: string }) {
        return this.prisma.car.create({
            data: {
                ...data,
                status: 'AVAILABLE'
            }
        });
    }

    async findAll(status?: CarStatus, userId?: string) {
        const whereClause: any = status ? { status } : {};

        // If userId is provided (non-admin view in private dashboard)
        if (userId) {
            whereClause.OR = [
                { ownerId: userId },
                { auctions: { some: { winnerId: userId } } },
                { rentals: { some: { userId: userId, status: { in: ['ACTIVE', 'PENDING'] } } } }
            ];
            console.log(`[CARS_FIND_ALL_LOG]: Searching for user ${userId} with where:`, JSON.stringify(whereClause, null, 2));
        }

        const result = await this.prisma.car.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: { auctions: true }
        });

        if (userId) {
            console.log(`[CARS_FIND_ALL_LOG]: Found ${result.length} cars for user ${userId}`);
        }

        return result;
    }

    // NEW Fetch Users to assign cars in modals
    async findAllUsers() {
        return this.prisma.user.findMany({
            select: { id: true, email: true, firstName: true, lastName: true },
            orderBy: { firstName: 'asc' }
        });
    }

    async findById(id: string) {
        const car = await this.prisma.car.findUnique({
            where: { id },
            include: { 
                auctions: {
                    include: { winner: true },
                    orderBy: { createdAt: 'desc' }
                },
                rentals: {
                    include: { user: true },
                    orderBy: { createdAt: 'desc' }
                },
                logs: {
                    orderBy: { createdAt: 'desc' },
                    take: 20
                }
            }
        });
        if (!car) throw new NotFoundException('Car not found');
        return car;
    }

    async changeStatus(id: string, newStatus: CarStatus) {
        const car = await this.findById(id);

        if (car.status === newStatus) {
            throw new BadRequestException(`Car is already ${newStatus}`);
        }

        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.car.update({
                where: { id },
                data: { status: newStatus }
            });

            await tx.carLog.create({
                data: {
                    carId: id,
                    action: 'STATUS_CHANGE',
                    details: `Automated status update: From ${car.status} to ${newStatus}`
                }
            });

            return updated;
        });
    }

    async update(id: string, data: Partial<{ brand: string, model: string, year: number, plate: string, type: string, description: string }>) {
        return this.prisma.car.update({
            where: { id },
            data
        });
    }

    async remove(id: string) {
        return this.prisma.car.delete({ where: { id } });
    }

    async findLogs(carId?: string) {
        return this.prisma.carLog.findMany({
            where: carId ? { carId } : undefined,
            include: { car: true },
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    }

    async buyCar(id: string, userId: string) {
        const car = await this.prisma.car.findUnique({ where: { id } });
        if (!car) throw new NotFoundException('Car not found');
        if (car.status !== 'AVAILABLE') {
            throw new BadRequestException('This car is not available for direct purchase');
        }

        return this.prisma.$transaction(async (tx) => {
            // 1. Update Car Status and Set Owner
            const updatedCar = await tx.car.update({
                where: { id },
                data: { 
                    status: 'SOLD',
                    ownerId: userId
                }
            });

            // 2. Create Transaction record
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    amount: car.basePrice || 0,
                    type: 'CAR_PURCHASE',
                    status: 'COMPLETED',
                    referenceId: car.id,
                    description: `Direct purchase of ${car.brand} ${car.model} (${car.year})`
                }
            });

            // 3. Create Audit Log
            await tx.auditLog.create({
                data: {
                    userId,
                    action: 'CAR_PURCHASE',
                    details: {
                        carId: car.id,
                        brand: car.brand,
                        model: car.model,
                        transactionId: transaction.id
                    }
                }
            });

            // 4. Create Car Log
            await tx.carLog.create({
                data: {
                   carId: id,
                   action: 'SOLD',
                   details: `Sold to user ${userId} via direct store purchase`
                }
            });

            return { car: updatedCar, transaction };
        });
    }
}
