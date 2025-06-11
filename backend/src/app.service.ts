import { Injectable, BadRequestException } from "@nestjs/common";

// Types of characters we expect in the string. Either numbers or operator symbols.
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

// helper to check if string (character) is a digit
function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

// helper to check if a Token array has a left parantheses or not
function containsLPar(tokens: Token[]): boolean {
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === TokenType.LPar) {
      return true;
    }
  }
  return false;
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
      /*RULES
      - Skip spaces
      - Throw error if not a number/symbol
      - read numbers (including decimals)
      - handle symbols if they are in TokenType
      */
      let ch = expression[i];

      if (ch === " ") {
        i++;
        continue;
        // skips whitespaces
      }

      // 1) Signed numbers: '-' or '+' as part of a number
      const prevType = tokens.length ? tokens[tokens.length - 1].type : null;
      const canBeUnary =
        prevType === null ||
        prevType === TokenType.Plus ||
        prevType === TokenType.Minus ||
        prevType === TokenType.Multiply ||
        prevType === TokenType.Divide ||
        prevType === TokenType.LPar;

      if (
        (ch === "-" || ch === "+") &&
        canBeUnary &&
        i + 1 < expression.length &&
        (isDigit(expression[i + 1]) || expression[i + 1] === ".")
      ) {
        // Consume the sign
        let numberString = ch;
        i++;

        // Now read digits and at most one decimal point
        let dotCount = 0;
        while (
          i < expression.length &&
          (isDigit(expression[i]) || expression[i] === ".")
        ) {
          if (expression[i] === ".") {
            dotCount++;
            if (dotCount > 1) {
              throw new BadRequestException(
                `Invalid number format near '${numberString}.'`
              );
            }
          }
          numberString += expression[i++];
        }

        tokens.push({
          type: TokenType.Number,
          value: parseFloat(numberString),
        });
        continue;
      }

      // Digits: Handles decimals as well as consecutive digits and wraps them all into a single TokenType.Number Token
      if (isDigit(ch) || (ch === "." && isDigit(expression[i + 1]))) {
        let numberString = "";
        let dotCount = 0;

        // read digits and at most one decimal point
        while (
          i < expression.length &&
          (isDigit(expression[i]) || expression[i] === ".")
        ) {
          if (expression[i] === ".") {
            dotCount++;
            if (dotCount > 1) {
              throw new BadRequestException(
                `Invalid number format near '${numberString}.'`
              );
            }
          }
          numberString += expression[i++];
        }

        tokens.push({
          type: TokenType.Number,
          value: parseFloat(numberString),
        });
        continue;
      }

      // Operator symbols
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
      // Any other symbol should throw bad request error
      throw new BadRequestException(`Unknown character ${ch}`);
    }

    return tokens;
  }

  evaluateExpression(expression: string): number {
    // step 1 is to get the Token type array
    let tokens = this.tokenizeExpression(expression);

    /*
    Approach: 3 Passes over the tokenized array. Parantheses, Multiplication/Division, Addition/Subtraction.
    - The function is called recursively inside each parantheses pair. We want only a single term to remain inside the parantheses, and eventually the entire array.
    - We use the ... operator to zip parantheses/operators into a single value after performing the operations on them

    1) Parantheses:
    - Check if Left Parantheses exists, if it does, match the last LPar with the first RPar.
    - Goes from right most to left most parantheses, effectively going from innermost to outermost
    - Slice all tokens inside the parantheses in a new array `innerTokens`
    - Map the tokens back into an expression by joining them
    - Call evaluate() recursively until each array has only a single value
    - replace the paranthesized expression with the evaluated value
    */

    // PASS 1 for parantheses
    while (containsLPar(tokens)) {
      let types = tokens.map((t) => t.type); // inline function to get array of only token types
      let openIndex = types.lastIndexOf(TokenType.LPar);
      // last open bracket

      let closeIndex = types.indexOf(TokenType.RPar, openIndex + 1);
      // match first close bracket with last open bracket
      if (closeIndex === -1) {
        throw new BadRequestException("Missing closing parantheses");
      }

      // extract inner tokens
      let innerTokens = tokens.slice(openIndex + 1, closeIndex);

      //Map the tokens back into an expression
      let innerExpression: string = innerTokens
        .map((t) =>
          t.type === TokenType.Number ? t.value!.toString() : t.type
        )
        .join("");

      // recursive call
      let innerValue = this.evaluateExpression(innerExpression);

      // set this value inside the original array
      tokens.splice(openIndex, closeIndex - openIndex + 1, {
        type: TokenType.Number,
        value: innerValue,
      });
    }

    if (
      tokens.length === 0 || // nothing left
      tokens.length % 2 === 0 || // can't have even number of tokens
      tokens[tokens.length - 1].type !== TokenType.Number // last token must be a number
    ) {
      throw new BadRequestException("Malformed expression");
    }

    // After 1st Pass, we have removed all parantheses and only need to deal with operator precedences

    /*
    PASS 2: Multiplication/Division
    - Make a new `newTokens` Token Array. Push the first value of tokens to it.
    - If the 2nd element of tokens is / or * perform operation with right most element of newTokens and 3rd element of `tokens`
    - If not, push the entire thing to the `newTokens`
    - This ensures that all division/multiplication operations are carried out first
    - If a division/multiplication is found after a series of +- replace the right most term of newTokens with the evaluated inner expression.
    */
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
        if (operator.type === TokenType.Divide) {
          if (rightVal === 0) {
            throw new BadRequestException("Division by 0 is infinity");
          }
        }
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

    // Only +- operations remaining. Same approach as PASS 2 but simpler.

    // PASS 3
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
