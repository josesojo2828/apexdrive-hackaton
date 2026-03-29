import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export class LoadDashboardDataService {
    constructor(
        private readonly prisma: PrismaService
    ) {
        this.execute();
    }

    public async execute() {
        const count = await this.prisma.car.count();
        if (count > 0) {
            console.log('[Seeder] ⏭️ Autos ya existen, omitiendo seed.');
            return;
        }

        console.log('[Seeder] 🚀 Iniciando datos de prueba para Hackathon...');

        const carsData = [
            { brand: 'Toyota', model: 'Corolla', year: 2022, plate: 'HCK-001', type: 'Sedan', status: 'AVAILABLE' as const, basePrice: 15000, description: 'Excelente estado, bajo kilometraje' },
            { brand: 'Honda', model: 'Civic', year: 2023, plate: 'HCK-002', type: 'Sedan', status: 'AVAILABLE' as const, basePrice: 18000, description: 'Casi nuevo, full equipo' },
            { brand: 'Ford', model: 'Mustang', year: 2021, plate: 'HCK-003', type: 'Sport', status: 'AVAILABLE' as const, basePrice: 35000, description: 'Potencia pura, V8' },
            { brand: 'Chevrolet', model: 'Camaro', year: 2021, plate: 'HCK-004', type: 'Sport', status: 'AVAILABLE' as const, basePrice: 34000, description: 'Clásico deportivo americano' },
            { brand: 'Tesla', model: 'Model 3', year: 2024, plate: 'HCK-005', type: 'Electric', status: 'AVAILABLE' as const, basePrice: 40000, description: 'Autopilot incluido' },
            { brand: 'BMW', model: 'X5', year: 2022, plate: 'HCK-006', type: 'SUV', status: 'AVAILABLE' as const, basePrice: 50000, description: 'Lujo y confort total' },
            { brand: 'Audi', model: 'Q7', year: 2023, plate: 'HCK-007', type: 'SUV', status: 'AVAILABLE' as const, basePrice: 55000, description: 'SUV Premium familiar' },
            { brand: 'Mercedes', model: 'C-Class', year: 2022, plate: 'HCK-008', type: 'Sedan', status: 'AVAILABLE' as const, basePrice: 42000, description: 'Elegancia alemana' },
            { brand: 'Nissan', model: 'GT-R', year: 2020, plate: 'HCK-009', type: 'Sport', status: 'AVAILABLE' as const, basePrice: 80000, description: 'Godzilla en persona' },
            { brand: 'Jeep', model: 'Wrangler', year: 2021, plate: 'HCK-010', type: 'SUV', status: 'AVAILABLE' as const, basePrice: 38000, description: 'Todo terreno imparable' },
        ];

        const cars = await Promise.all(
            carsData.map(c => this.prisma.car.create({ data: c }))
        );

        const users = await this.prisma.user.findMany({ take: 2 });
        const user = users[0];

        if (!user) {
            console.log('[Seeder] ⚠️ No hay usuarios, seed de relaciones omitido.');
            return;
        }

        // Alquiler activo
        await this.prisma.rental.create({
            data: {
                carId: cars[0].id,
                userId: user.id,
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 86400000),
                status: 'ACTIVE',
                totalAmount: 350
            }
        });
        await this.prisma.car.update({ where: { id: cars[0].id }, data: { status: 'RENTED' } });

        // Subasta 1
        const a1 = await this.prisma.auction.create({
            data: {
                carId: cars[1].id,
                startingPrice: 17000,
                currentPrice: 17000,
                startDate: new Date(),
                endDate: new Date(Date.now() + 2 * 86400000),
                status: 'ACTIVE'
            }
        });
        await this.prisma.car.update({ where: { id: cars[1].id }, data: { status: 'IN_AUCTION' } });

        // Subasta 2
        await this.prisma.auction.create({
            data: {
                carId: cars[2].id,
                startingPrice: 30000,
                currentPrice: 30000,
                startDate: new Date(),
                endDate: new Date(Date.now() + 5 * 86400000),
                status: 'ACTIVE'
            }
        });
        await this.prisma.car.update({ where: { id: cars[2].id }, data: { status: 'IN_AUCTION' } });

        // Puja en subasta 1
        await this.prisma.bid.create({
            data: { auctionId: a1.id, userId: user.id, amount: 17500 }
        });
        await this.prisma.auction.update({ where: { id: a1.id }, data: { currentPrice: 17500 } });

        console.log('[Seeder] ✅ Hackathon data: 10 Autos, 1 Alquiler, 2 Subastas, 1 Puja.');
    }
}
