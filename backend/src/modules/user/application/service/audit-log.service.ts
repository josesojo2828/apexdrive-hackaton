import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";

@Injectable()
export default class AuditLogService {
    constructor(private readonly prisma: PrismaService) { }

    async createLog(userId: string, action: string, details?: any) {
        try {
            return await this.prisma.auditLog.create({
                data: {
                    userId,
                    action,
                    details: details || {},
                },
            });
        } catch (error) {
            console.error("Error creating audit log:", error);
        }
    }

    async getLogsByUser(userId: string, limit: number = 20) {
        return this.prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    async getRecentLogs(limit: number = 50) {
        return this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                }
            }
        });
    }
}
