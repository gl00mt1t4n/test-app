import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "./../src/app.module";

describe("Calculator (AppController) E2E for POST/evaluate", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const evaluate = (expr: string) =>
    request(app.getHttpServer())
      .post("/evaluate")
      .send({ expression: expr })
      .set("Accept", "application/json");

  it("should add two numbers", () =>
    evaluate("2+3")
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({ result: 5 });
      }));

  it("should respect multiplication before addition", () =>
    evaluate("2+3*4").expect(201).expect({ result: 14 }));

  it("should handle division and subtraction", () =>
    evaluate("20-8/4").expect(201).expect({ result: 18 }));

  it("should handle chained operations", () =>
    evaluate("5*3+12/4-1").expect(201).expect({ result: 17 }));

  it("should evaluate simple parentheses", () =>
    evaluate("(2+3)*4").expect(201).expect({ result: 20 }));

  it("should evaluate nested parentheses", () =>
    evaluate("((1+1)+1)*2").expect(201).expect({ result: 6 }));

  it("should return 400 for malformed input", () =>
    evaluate("2+")
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      }));

  it("should return 400 for unknown characters", () =>
    evaluate("2&3")
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/Unknown character/);
      }));

  it("should handle decimal numbers correctly", () =>
    evaluate("12.5+3.75")
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({ result: 16.25 });
      }));

  it("should return 400 for malformed decimal input", () =>
    evaluate("1.2.3+4")
      .expect(400)
      .expect((res) => {
        // our tokenizer throws “Invalid number format …”
        expect(res.body.message).toMatch(/Invalid number format/);
      }));

  it("should divide non-zero correctly", () =>
    evaluate("10/2")
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({ result: 5 });
      }));

  it("should return 400 on division by zero", () =>
    evaluate("5/0")
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toMatch(/Division by 0 is infinity/);
      }));
      
  it("should handle unary minus division", () =>
    evaluate("-1/-1")
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({ result: 1 });
      }));

  it("should handle mixed unary signs with multiplication and division", () =>
    evaluate("-1*+5/-5")
      .expect(201)
      .expect((res) => {
        // -1 * +5 = -5, then -5 / -5 = 1
        expect(res.body).toEqual({ result: 1 });
      }));

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });
});
