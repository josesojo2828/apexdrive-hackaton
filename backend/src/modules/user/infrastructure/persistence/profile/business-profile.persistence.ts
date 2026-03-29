import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export class BusinessProfilePersistence {
    constructor(private readonly prisma: PrismaService) { }

    public async update({ userId, data }: { userId: string, data: any }) {
        return null;
    }

    public async findByUserId(userId: string) {
        return null;
    }
}
