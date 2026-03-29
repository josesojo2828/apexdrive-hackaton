import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('auctions')
export class AuctionsController {
    constructor(private readonly auctionsService: AuctionsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() data: any) {
        return this.auctionsService.createAuction(data);
    }

    @Get()
    async findAll() {
        return this.auctionsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.auctionsService.getAuctionDetails(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/bid')
    async placeBid(@Param('id') id: string, @Body() data: { amount: number, userId?: string }, @Request() req: any) {
        // Use user's own ID if not specified or not admin
        const userId = data.userId && req.user?.isAdmin ? data.userId : req.user?.id;
        return this.auctionsService.placeBid(id, userId, data.amount);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id/close')
    async close(@Param('id') id: string) {
        return this.auctionsService.closeAuctionManually(id);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        return this.auctionsService.updateAuction(id, data);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.auctionsService.deleteAuction(id);
    }
}
