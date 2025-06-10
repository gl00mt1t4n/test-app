import { Injectable, BadRequestException } from "@nestjs/common";

// Types of characters we expect in the string. Either numbers or these symbols.
export enum TokenType {
  Number = "Number",
  Plus = "+",
  Minus = "-",
  Multiply = "*",
  Divide = "/",
  LPar = "(",
  RPar = ")",
}

// General interface (like a struct) for Tokens. If they are numbers (enum type Number), they will have a value. Otherwise just a tokentype
export interface Token {
  type: TokenType;
  value?: number;
}

function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  tokenizeExpression(expression: string): Token[] {
    let tokens: Token[] = [];
    let i = 0;
    while (i < expression.length) {
      // Skip spaces
      // Throw error if not a number/symbol
      // read numbers (including decimals, but implement it later)
      // handle symbols if they are in TokenType

      let ch = expression[i];

      if (ch === " ") {
        i++;
        continue;
        // skips whitespaces
      }

      // digits
      // it should work for consecutive digits as well
      if (isDigit(ch)) {
        let numberString = ch;
        i++;
        while (i < expression.length && isDigit(expression[i])) {
          numberString += expression[i];
          i++;
        }
        tokens.push({
          type: TokenType.Number,
          value: parseInt(numberString, 10),
        });
        continue;
      }

      // general symbols
      if (ch === "+") {
        tokens.push({
          type: TokenType.Plus,
        });
        i++;
        continue;
      } else if (ch === "-") {
        tokens.push({
          type: TokenType.Minus,
        });
        i++;
        continue;
      } else if (ch === "*") {
        tokens.push({
          type: TokenType.Multiply,
        });
        i++;
        continue;
      } else if (ch === "/") {
        tokens.push({
          type: TokenType.Divide,
        });
        i++;
        continue;
      } else if (ch === "(") {
        tokens.push({
          type: TokenType.LPar,
        });
        i++;
        continue;
      } else if (ch === ")") {
        tokens.push({
          type: TokenType.RPar,
        });
        i++;
        continue;
      }
      // anything else should throw bad request error
      throw new BadRequestException(`Unknown Character ${ch}`);
    }

    return tokens;
  }

  evaluateExpression(expression: string): number {
    return 0;
  }
}
