import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EvaluateController } from './evaluate/evaluate.controller';

@Module({
  imports: [],
  controllers: [AppController, EvaluateController],
  providers: [AppService],
})
export class AppModule {}
