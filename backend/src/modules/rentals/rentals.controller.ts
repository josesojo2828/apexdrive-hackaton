import { Controller, Get, Post, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RentalStatus } from 'prisma/generated/client';

@Controller('rentals')
export class RentalsController {
    constructor(private readonly rentalsService: RentalsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() body: { carId: string, userId?: string, startDate: string, endDate: string, dailyRate: number, paidAmount?: number }, @Request() req: any) {
        // Use the new isAdmin flag to enable user assignment
        const isAdmin = req.user?.isAdmin;
        const targetUserId = (isAdmin && body.userId) ? body.userId : req.user?.id;
        
        console.log(`[RENTAL_CREATE_LOG]: Admin=${isAdmin}, Source_userId=${body.userId}, Target_userId=${targetUserId}`);
        
        return this.rentalsService.createRental(body.carId, targetUserId, new Date(body.startDate), new Date(body.endDate), body.dailyRate, body.paidAmount);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/payment')
    async addPayment(@Param('id') id: string, @Body('amount') amount: number) {
        return this.rentalsService.updatePayment(id, amount);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: RentalStatus) {
        return this.rentalsService.updateStatus(id, status);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req: any) {
        const userId = !req.user?.isAdmin ? req.user?.id : undefined;
        return this.rentalsService.findAll(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    async getStats() {
        return this.rentalsService.getStats();
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-rentals')
    async getMyRentals(@Request() req: any) {
        return this.rentalsService.getRentalsByUser(req.user?.id);
    }
}
