import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CarsService } from '../cars/cars.service';
import { RentalStatus } from 'prisma/generated/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RentalsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly carsService: CarsService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    async createRental(carId: string, userId: string, startDate: Date, endDate: Date, dailyRate: number, initialPaid?: number) {
        if (new Date(startDate) >= new Date(endDate)) {
            throw new BadRequestException('La fecha final debe ser mayor a la inicial');
        }

        const car = await this.carsService.findById(carId);
        if (car.status !== 'AVAILABLE') {
            throw new BadRequestException('El auto debe estar DISPONIBLE para ser alquilado.');
        }

        const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalAmount = diffDays * dailyRate;

        const rental = await this.prisma.$transaction(async (prisma) => {
            const r = await prisma.rental.create({
                data: {
                    user: { connect: { id: userId } },
                    car: { connect: { id: carId } },
                    startDate,
                    endDate,
                    totalAmount,
                    paidAmount: initialPaid || 0,
                    status: 'ACTIVE'
                },
                include: { user: true, car: true }
            });

            await prisma.car.update({
                where: { id: carId },
                data: { status: 'RENTED' }
            });

            await prisma.carLog.create({
                data: {
                    carId,
                    action: 'RENTAL_START',
                    details: `Rental #${r.id.slice(0, 8)} initialized. Final amount ready: $${totalAmount}`
                }
            });

            return r;
        });

        // Emit Event
        this.eventEmitter.emit('rental.created', {
            rentalId: rental.id,
            userId: rental.userId,
            carId: rental.carId,
            totalAmount: Number(rental.totalAmount),
            userName: `${rental.user.firstName} ${rental.user.lastName}`,
            carBrand: rental.car.brand,
            carModel: rental.car.model
        });

        return rental;
    }

    async updatePayment(rentalId: string, amount: number) {
        const rental = await this.prisma.rental.findUnique({ where: { id: rentalId } });
        if (!rental) throw new NotFoundException('Alquiler no encontrado');

        const newPaidAmount = Number(rental.paidAmount) + amount;
        if (newPaidAmount > Number(rental.totalAmount)) {
            throw new BadRequestException('El monto pagado no puede superar el total del contrato');
        }

        return this.prisma.rental.update({
            where: { id: rentalId },
            data: { paidAmount: newPaidAmount }
        });
    }

    async updateStatus(rentalId: string, newStatus: RentalStatus) {
        const rental = await this.prisma.rental.findUnique({ where: { id: rentalId } });
        if (!rental) throw new NotFoundException('Alquiler no encontrado');

        if (rental.status === newStatus) return rental;

        return this.prisma.$transaction(async (prisma) => {
            if (newStatus === 'COMPLETED' || newStatus === 'CANCELLED') {
                await prisma.car.update({
                    where: { id: rental.carId },
                    data: { status: 'AVAILABLE' }
                });

                await prisma.carLog.create({
                    data: {
                        carId: rental.carId,
                        action: 'RENTAL_END',
                        details: `Rental #${rentalId.slice(0, 8)} marked as ${newStatus}. Unit returned to base.`
                    }
                });
            } else if (newStatus === 'ACTIVE') {
                await prisma.car.update({
                    where: { id: rental.carId },
                    data: { status: 'RENTED' }
                });
            }

            return prisma.rental.update({
                where: { id: rentalId },
                data: { status: newStatus }
            });
        });
    }

    async findAll(userId?: string) {
        return this.prisma.rental.findMany({
            where: userId ? { userId } : {},
            include: { car: true, user: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getRentalsByUser(userId: string) {
        return this.prisma.rental.findMany({
            where: { userId },
            include: { car: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getStats() {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const [completed, active, thisWeek, availableCars] = await Promise.all([
            this.prisma.rental.count({ where: { status: 'COMPLETED' } }),
            this.prisma.rental.count({ where: { status: 'ACTIVE' } }),
            this.prisma.rental.count({
                where: {
                    startDate: {
                        gte: startOfWeek,
                        lte: endOfWeek,
                    },
                },
            }),
            this.prisma.car.count({ where: { status: 'AVAILABLE' } }),
        ]);

        return {
            completed,
            active,
            thisWeek,
            availableCars,
        };
    }
}
