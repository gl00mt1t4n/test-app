import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Post method `evaluate` under /evaluate which reads the body of the json request under 'expression' field and returns the same thing. Only a function stub for now
  @Post('evaluate')
  evaluate(@Body('expression')expr: string) {
  const result = this.appService.evaluateExpression(expr);
  const tokens = this.appService.tokenizeExpression(expr);
  console.log('TOKENS: ', tokens);
  return {result};
  }
}
