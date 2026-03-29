import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [CarsModule],
  providers: [RentalsService],
  controllers: [RentalsController]
})
export class RentalsModule {}
