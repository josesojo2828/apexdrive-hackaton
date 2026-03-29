import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export class LoadSeedService {
    constructor(private readonly prisma: PrismaService) {
        this.execute();
    }

    private readonly cars = [
        {
            brand: "Aston Martin",
            model: "Valiant",
            image: "aston_martin_valiant_silver_studio.png",
            color: "Silver",
            price: 2500000.00,
            type: "Supercar",
            description: "Aston Martin Valiant: A track-focused, road-legal masterpiece of engineering and raw performance.",
            plate: "APX-VALI"
        },
        {
            brand: "Audi",
            model: "RS6 Performance",
            image: "audi_rs6_performance_gray_studio.png",
            color: "Nardo Gray",
            price: 130000.00,
            type: "Sport Wagon",
            description: "The Audi RS6 Performance: The ultimate everyday supercar with unmatched utility and speed.",
            plate: "APX-RS6P"
        },
        {
            brand: "Bentley",
            model: "Batur",
            image: "bentley_batur_blue_studio.png",
            color: "Azurite Blue",
            price: 2000000.00,
            type: "Grand Tourer",
            description: "Bentley Batur: Handcrafted luxury meeting the most powerful W12 engine ever created.",
            plate: "APX-BATR"
        },
        {
            brand: "BMW",
            model: "M4 CS",
            image: "bmw_m4_cs_green_studio.png",
            color: "Frozen Isle of Man Green",
            price: 125000.00,
            type: "Sport",
            description: "BMW M4 CS: Lightweight construction and track-tuned chassis for the ultimate driving precision.",
            plate: "APX-M4CS"
        },
        {
            brand: "Ferrari",
            model: "Purosangue",
            image: "ferrari_purosangue_red_studio.png",
            color: "Rosso Corsa",
            price: 400000.00,
            type: "SUV Supercar",
            description: "Ferrari Purosangue: The first ever four-door, four-seater Ferrari. Pure blood, pure performance.",
            plate: "APX-PURO"
        },
        {
            brand: "Lamborghini",
            model: "Revuelto",
            image: "lambo_revuelto_white_studio.png",
            color: "Bianco Monocerus",
            price: 600000.00,
            type: "Hypercar",
            description: "Lamborghini Revuelto: The first hybrid V12 HPEV, defining a new paradigm in performance.",
            plate: "APX-REVU"
        },
        {
            brand: "McLaren",
            model: "750S",
            image: "mclaren_750s_orange_studio.png",
            color: "Papaya Orange",
            price: 330000.00,
            type: "Supercar",
            description: "McLaren 750S: Lighter, more powerful, and even more engaging. The benchmark for supercars.",
            plate: "APX-750S"
        },
        {
            brand: "Mercedes-AMG",
            model: "GT Black Series",
            image: "mercedes_amg_gt_black_studio.png",
            color: "Obsidian Black",
            price: 350000.00,
            type: "Track Spec",
            description: "Mercedes-AMG GT Black Series: Motorsport technology translated for the road. Aggression in its purest form.",
            plate: "APX-AMGT"
        },
        {
            brand: "Porsche",
            model: "911 GT3 RS",
            image: "porsche_911_gt3_blue_studio.png",
            color: "Shark Blue",
            price: 225000.00,
            type: "Precision Sport",
            description: "Porsche 911 GT3 RS: Aerodynamics and chassis engineering pushed to the absolute limits of the possible.",
            plate: "APX-GT3R"
        },
        {
            brand: "Range Rover",
            model: "SV",
            image: "range_rover_sv_gold_studio.png",
            color: "Lantau Bronze / Gold",
            price: 215000.00,
            type: "Luxury SUV",
            description: "Range Rover SV: The pinnacle of luxury and capability. Refinement without compromise.",
            plate: "APX-RRSV"
        }
    ];

    public async execute() {
        console.log('[LoadSeedService] Initializing Selective Fleet Generation...');

        // Create the 10 High-Performance Cars
        for (const carData of this.cars) {
            const status = "AVAILABLE";
            
            const car = await this.prisma.car.upsert({
                where: { plate: carData.plate },
                update: { status },
                create: {
                    brand: carData.brand,
                    model: carData.model,
                    year: 2024,
                    plate: carData.plate,
                    color: carData.color,
                    type: carData.type,
                    mileage: 0,
                    status,
                    basePrice: carData.price as any,
                    description: carData.description,
                    images: [`/images/${carData.image}`]
                }
            });

            // Create history logs
            const logsCount = await this.prisma.carLog.count({ where: { carId: car.id } });
            if (logsCount === 0) {
                await this.prisma.carLog.createMany({
                    data: [
                        { carId: car.id, action: 'ACQUISITION', details: 'Direct manufacturer acquisition for premium fleet.' },
                        { carId: car.id, action: 'INSPECTION', details: 'PDI (Pre-Delivery Inspection) completed. Perfect condition.' },
                        { carId: car.id, action: 'STATUS_CHANGE', details: `Vehicle listed as AVAILABLE in store.` }
                    ]
                });
            }
        }

        console.log(`[LoadSeedService] ✅ Selective seed completed: ${this.cars.length} vehicles generated.`);
    }
}
