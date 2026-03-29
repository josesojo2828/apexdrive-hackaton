import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoadSeedService {
    constructor(private readonly prisma: PrismaService) {
        this.execute();
    }

    private readonly carImages = [
        "/images/1.png",
        "/images/2.png",
        "/images/lambo_revuelto_white_studio.png",
        "/images/ferrari_purosangue_red_studio.png",
        "/images/porsche_911_gt3_blue_studio.png",
        "/images/mercedes_amg_gt_black_studio.png",
        "/images/bmw_m4_cs_green_studio.png",
        "/images/audi_rs6_performance_gray_studio.png",
        "/images/mclaren_750s_orange_studio.png",
        "/images/aston_martin_valiant_silver_studio.png",
        "/images/range_rover_sv_gold_studio.png",
        "/images/bentley_batur_blue_studio.png"
    ];

    private readonly carBrands = ["Ferrari", "Lamborghini", "Porsche", "Mercedes-Benz", "BMW", "Audi", "McLaren", "Aston Martin", "Land Rover", "Bentley"];
    private readonly carModels = ["Purosangue", "Revuelto", "911 GT3 RS", "AMG GT", "M4 CS", "RS6 Avant", "750S", "Valiant", "Range Rover SV", "Batur"];
    private readonly firstNames = ["James", "Robert", "John", "Michael", "David", "William", "Richard", "Joseph", "Thomas", "Christopher", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua"];
    private readonly lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

    public async execute() {
        console.log('[LoadSeedService] Initializing Seed Generation...');

        const permitAdmin = await this.prisma.permission.findFirst({ where: { name: 'admin' } });
        const permitUser = await this.prisma.permission.findFirst({ where: { name: 'user' } });

        if (!permitAdmin || !permitUser) {
            console.log('[LoadSeedService] ❌ Missing permissions. Skip.');
            return;
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash('abc.12345', salt);

        // 1. Create 80 Users
        console.log('[LoadSeedService] Creating 80 Users with Wallets...');
        for (let i = 1; i <= 80; i++) {
            const firstName = this.firstNames[i % this.firstNames.length];
            const lastName = this.lastNames[i % this.lastNames.length];
            const email = `user${i}@apexdrive.com`;
            const user = await this.prisma.user.upsert({
                where: { email },
                update: { status: 'ACTIVE' },
                create: {
                    email,
                    passwordHash,
                    firstName,
                    lastName,
                    status: 'ACTIVE',
                    role: i <= 5 ? 'ADMIN' : 'USER',
                    permissionId: i <= 5 ? permitAdmin.id : permitUser.id,
                    profile: { create: { avatarUrl: `https://i.pravatar.cc/150?u=${i}` } },
                    wallet: { create: { balance: (Math.random() * 50000).toFixed(2) as any } }
                }
            });

            // Sample Transactions
            await this.prisma.transaction.create({
                data: {
                    userId: user.id,
                    amount: 500 + Math.random() * 2000,
                    type: 'WALLET_TOPUP',
                    status: 'COMPLETED',
                    description: 'Initial balance'
                }
            });
        }

        // 2. Create 100 Cars
        console.log('[LoadSeedService] Creating 100 Cars with History...');
        const carStatuses: any[] = ['AVAILABLE', 'RENTED', 'IN_AUCTION', 'SOLD', 'MAINTENANCE'];
        for (let i = 1; i <= 100; i++) {
            const brandIndex = Math.floor(Math.random() * this.carBrands.length);
            const status = carStatuses[i % carStatuses.length];
            const plate = `APX-${i.toString().padStart(4, '0')}`;
            
            const car = await this.prisma.car.upsert({
                where: { plate },
                update: { status },
                create: {
                    brand: this.carBrands[brandIndex],
                    model: this.carModels[brandIndex],
                    year: 2022 + Math.floor(Math.random() * 3),
                    plate,
                    color: "Various",
                    type: brandIndex > 5 ? "Supercar" : "Sport",
                    mileage: Math.floor(Math.random() * 5000),
                    status,
                    basePrice: (50000 + Math.random() * 200000).toFixed(2) as any,
                    description: `Precision engineered ${this.carModels[brandIndex]}. Apex Velocity Performance package included.`,
                    images: [this.carImages[i % this.carImages.length]]
                }
            });

            // Create some history logs only if they don't exist
            const logsCount = await this.prisma.carLog.count({ where: { carId: car.id } });
            if (logsCount === 0) {
                await this.prisma.carLog.createMany({
                    data: [
                        { carId: car.id, action: 'ACQUISITION', details: 'Vehicle added to the high-performance fleet segment.' },
                        { carId: car.id, action: 'INSPECTION', details: 'Initial technical and performance validation completed by engineers.' },
                        { carId: car.id, action: 'STATUS_CHANGE', details: `Unit deployment finalized with status: ${status}` }
                    ]
                });
            }
        }

        console.log('[LoadSeedService] ✅ Seed execution COMPLETED.');
    }
}
