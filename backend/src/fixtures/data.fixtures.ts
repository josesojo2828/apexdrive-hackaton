import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

/**
 * Service to handle initial data seeding (Fixtures)
 * Ensures that the system has all necessary master data to operate.
 */
@Injectable()
export class DataFixtures {
    constructor(private readonly prisma: PrismaService) { }
}