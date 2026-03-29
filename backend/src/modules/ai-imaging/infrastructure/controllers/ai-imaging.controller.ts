import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiImagingService } from '../../application/service/ai-imaging.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('ai-imaging')
export class AiImagingController {
    constructor(private readonly aiImagingService: AiImagingService) {}

    @UseGuards(JwtAuthGuard)
    @Post('generate-car')
    async generateCar(@Body() body: { type: string, brand: string, model: string, color: string }) {
        return this.aiImagingService.generateCarImage(body);
    }
}
