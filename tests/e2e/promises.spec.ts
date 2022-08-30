import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Server } from "http";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Async Transformer", () => {
  let server: Server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it("should accept promises", (done) => {
    // given

    // when
    request(server)
      .get("/cats/async")
      .expect(200)
      .end((err, { body }) => {
        // then
        expect(body.name).toEqual("Transformed Name");

        done();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
