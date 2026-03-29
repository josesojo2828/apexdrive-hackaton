import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private readonly prisma: PrismaService) {}

    async createNotification(userId: string, title: string, content: string) {
        return this.prisma.notification.create({
            data: {
                userId,
                title,
                content,
                isRead: false
            }
        });
    }

    async getNotifications(userId: string, onlyUnread = false) {
        return this.prisma.notification.findMany({
            where: {
                userId,
                ...(onlyUnread ? { isRead: false } : {})
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }

    async getUnreadCount(userId: string) {
        return this.prisma.notification.count({
            where: { userId, isRead: false }
        });
    }

    async markAsRead(id: string) {
        const notification = await this.prisma.notification.findUnique({ where: { id } });
        if (!notification) throw new NotFoundException('Notificación no encontrada');

        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }

    async getAdmins() {
        // Return all users with ADMIN role
        return this.prisma.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true }
        });
    }
}
