import { Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly service: NotificationsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getNotifications(@Request() req, @Query('unread') unread: boolean) {
        return this.service.getNotifications(req.user.userId, unread);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/unread-count')
    async getUnreadCount(@Request() req) {
        const count = await this.service.getUnreadCount(req.user.userId);
        return { count };
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id/read')
    async markAsRead(@Param('id') id: string) {
        return this.service.markAsRead(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/read-all')
    async markAllAsRead(@Request() req) {
        return this.service.markAllAsRead(req.user.userId);
    }
}
