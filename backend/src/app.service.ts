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
      // RULES
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
    // step 1 is to get the Token type array
    let tokens = this.tokenizeExpression(expression);

    // our approach is going to be like so: 3 Passes over the tokenized array for parantheses, /*, +- with the function being called recursively inside each parantheses pair. We want only a single term to remain inside the parantheses, and eventually the entire term. We will use the ... operator to zip parantheses/operators into a single value

    /*
    1) Parantheses:
    - have a counter set to 0
    - Left parantheses means counter += 1
    - Right means counter -= 1
    - if counter comes back to 0, zip the terms between open and close parantheses and then call evaluate expression on it again
    - stubbing it for now
    2) basic precedence/conditional passes for /* and +-
    
    // STUBBING PARANTHESES 

    */

    // PASS 1 STUBBED OUT

    // Below is Pass 2 and 3 for /* and +- respectively

    let newTokens: Token[] = [tokens[0]];

    for (let i = 1; i < tokens.length; i += 2) {
      const operator = tokens[i];
      const right = tokens[i + 1];

      if (
        operator.type === TokenType.Divide ||
        operator.type === TokenType.Multiply
      ) {
        const leftVal = newTokens[newTokens.length - 1].value!;
        const rightVal = right.value!;
        const combined =
          operator.type === TokenType.Multiply
            ? leftVal * rightVal
            : leftVal / rightVal;
        let combined_result: Token = {
          type: TokenType.Number,
          value: combined,
        };

        newTokens = [...newTokens.slice(0, -1), combined_result];
        // replace right most term with combined result because it is being used in the /* operation
      } else {
        newTokens = [...newTokens, operator, right];
      } // if operator is +- we just append them as is to the newTokens array
    }
    tokens = newTokens;
    // We now have an expression which only consists of +- operators as all the /* have been taken care of and placed back into the array in the order in which the operations should have occurred.

    let [first, ...rest] = tokens;
    let result = first.value!;
    for (let i = 0; i < rest.length; i += 2) {
      const op = rest[i].type;
      const rightVal = rest[i + 1].value!;

      if (op === TokenType.Plus) {
        result += rightVal;
      } else if (op === TokenType.Minus) {
        result -= rightVal;
      }
    }
    return result;
  }
}
