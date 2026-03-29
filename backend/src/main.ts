import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ResponseInterceptor } from './shared/interceptor/response.interceptor'
import { GlobalExceptionFilter } from './shared/interceptor/exception.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api');
  app.enableShutdownHooks()

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.PORT || 9999;
  await app.listen(port);
  console.log(`[NestApplication] Listening on port ${port}`);
}
bootstrap();
