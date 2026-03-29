import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsListener } from './infrastructure/listeners/notification.listener';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from 'src/config/prisma.service';

@Module({
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationsGateway, NotificationsListener, PrismaService],
    exports: [NotificationsService, NotificationsGateway]
})
export class NotificationsModule {}
