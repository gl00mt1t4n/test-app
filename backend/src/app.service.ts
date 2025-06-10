import { Injectable, BadRequestException } from '@nestjs/common';

// Types of characters we expect in the string. Either numbers or these symbols.
export enum TokenType {
  Number = 'Number',
  Plus = '+',
  Minus = '-',
  Multiply = '*',
  Divide = '/',
  LPar = '(',
  RPar = ')'
};

// General interface (like a struct) for Tokens. If they are numbers (enum type Number), they will have a value. Otherwise just a tokentype
export interface Token {
  type: TokenType;
  value?: number;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  tokenizeExpression(expression: string): Token[] {
    let tokens: Token[] = [];
    let i = 0;
    return tokens;
  }

  evaluateExpression(expression: string): number {
    return 0;
  }
}
