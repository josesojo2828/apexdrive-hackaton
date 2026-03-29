import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../../notifications.service';
import { NotificationsGateway } from '../../notifications.gateway';

@Injectable()
export class NotificationsListener {
    private readonly logger: Logger = new Logger('NotificationsListener');

    constructor(
        private readonly notificationService: NotificationsService,
        private readonly gateway: NotificationsGateway,
    ) {}

    @OnEvent('rental.created')
    async handleRentalCreated(payload: { rentalId: string, userId: string, carId: string, totalAmount: number, userName: string, carBrand: string, carModel: string }) {
        this.logger.log(`Handling rental.created for ${payload.rentalId}`);

        const admins = await this.notificationService.getAdmins();
        const adminIds = admins.map(admin => admin.id);

        const title = 'Nueva Reserva Detectada';
        const content = `El usuario ${payload.userName} ha alquilado un ${payload.carBrand} ${payload.carModel} por $${payload.totalAmount}.`;

        // Notify Admins
        for (const adminId of adminIds) {
            const notification = await this.notificationService.createNotification(adminId, title, content);
            this.gateway.sendNotificationToUser(adminId, 'notification:new', notification);
        }

        // Notify User (owner of the rental)
        const userTitle = 'Reserva Confirmada';
        const userContent = `Tu reserva del ${payload.carBrand} ha sido procesada con éxito. ¡A disfrutar!`;
        const userNotification = await this.notificationService.createNotification(payload.userId, userTitle, userContent);
        this.gateway.sendNotificationToUser(payload.userId, 'notification:new', userNotification);
    }

    @OnEvent('auction.bid.placed')
    async handleBidPlaced(payload: { auctionId: string, userId: string, amount: number, userName: string, carBrand: string, carModel: string }) {
        this.logger.log(`Handling auction.bid.placed for ${payload.auctionId}`);

        const admins = await this.notificationService.getAdmins();
        const adminIds = admins.map(admin => admin.id);

        const title = 'Nueva Puja en Subasta';
        const content = `El usuario ${payload.userName} ha pujado $${payload.amount} por el ${payload.carBrand} ${payload.carModel}.`;

        // Notify Admins
        for (const adminId of adminIds) {
            const notification = await this.notificationService.createNotification(adminId, title, content);
            this.gateway.sendNotificationToUser(adminId, 'notification:new', notification);
        }

        // Optional: Notify other bidders (skipped for now for simplicity as per "algo preciso")
    }
}
