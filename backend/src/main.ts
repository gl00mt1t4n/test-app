import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // enable cross module calling (interaction bw frontend and backend)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
