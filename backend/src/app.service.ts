import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  evaluateExpression(expression: string): number {
    return 0;
  }
}
