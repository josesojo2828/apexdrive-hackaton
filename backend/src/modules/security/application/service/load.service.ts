import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export class LoadServiceService {
    constructor(private readonly prisma: PrismaService) {
        this.execute();
    }

    async execute() {
        console.log('[LoadServiceService] Service loader skipped for hackathon.');
    }
}
