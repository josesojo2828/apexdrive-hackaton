import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { PrismaModule } from './config/prisma.module'
import { DataFixtures } from './fixtures/data.fixtures'
import { TimerMiddleware } from './shared/middleware/timer.middleware';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

import SecurityModule from './modules/security/security.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CarsModule } from './modules/cars/cars.module';
import { RentalsModule } from './modules/rentals/rentals.module';
import { AuctionsModule } from './modules/auctions/auctions.module';
import { BidsModule } from './modules/bids/bids.module';
import { AdminModule } from './modules/admin/admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import AppicationModule from './modules/app/app.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    PrismaModule,
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: {
        path: path.join(__dirname, 'locales/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.join(process.cwd(), 'src/generated/i18n.generated.ts'),
    }),
    
    // # # # # # # #
    // #  MODULES  #
    // # # # # # # #
    
    AuthModule,
    SecurityModule,
    UserModule,
    AppicationModule,
    CarsModule,
    RentalsModule,
    AuctionsModule,
    BidsModule,
    AdminModule,
    NotificationsModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [
    DataFixtures,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TimerMiddleware)
      .forRoutes('*');
  }
}
