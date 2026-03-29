import { Module } from '@nestjs/common';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { PrismaService } from 'src/config/prisma.service';
import { CarsModule } from '../cars/cars.module';
import { AuctionsGateway } from './auctions.gateway';

@Module({
  imports: [CarsModule],
  controllers: [AuctionsController],
  providers: [AuctionsService, PrismaService, AuctionsGateway],
  exports: [AuctionsService, AuctionsGateway]
})
export class AuctionsModule {}
