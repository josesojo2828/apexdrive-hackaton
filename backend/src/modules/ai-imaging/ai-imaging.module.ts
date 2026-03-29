import { Module } from '@nestjs/common';
import { AiImagingService } from './application/service/ai-imaging.service';
import { AiImagingController } from './infrastructure/controllers/ai-imaging.controller';

@Module({
    providers: [AiImagingService],
    controllers: [AiImagingController],
})
export class AiImagingModule {}
