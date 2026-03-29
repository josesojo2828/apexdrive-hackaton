import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { CarsService } from './cars.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CarStatus } from 'prisma/generated/client';

@Controller('cars')
export class CarsController {
    constructor(private readonly carsService: CarsService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req: any, @Query('status') status?: CarStatus) {
        // Normal behavior: Filter for non-admins to only see their assets
        const userId = !req.user?.isAdmin ? req.user?.id : undefined;
        return this.carsService.findAll(status, userId);
    }

    // NEW: Public Inventory for the store (no filters applied by user session)
    @Get('inventory')
    async findInventory(@Query('status') status?: CarStatus) {
        // Force status AVAILABLE if not provided, or just return what's requested freely
        return this.carsService.findAll(status || 'AVAILABLE');
    }

    // NEW: List of users for assignment (Admin only)
    @UseGuards(JwtAuthGuard)
    @Get('users')
    async findAllUsers(@Request() req: any) {
        if (!req.user?.isAdmin) {
            return [];
        }
        return this.carsService.findAllUsers();
    }

    @Get('logs')
    async findLogs(@Query('carId') carId?: string) {
        return this.carsService.findLogs(carId);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.carsService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/buy')
    async buyCar(@Param('id') id: string, @Request() req: any) {
        return this.carsService.buyCar(id, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() data: any) {
        return this.carsService.createCar(data);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/status')
    async changeStatus(@Param('id') id: string, @Body('status') status: CarStatus) {
        return this.carsService.changeStatus(id, status);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        return this.carsService.update(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.carsService.remove(id);
    }
}
