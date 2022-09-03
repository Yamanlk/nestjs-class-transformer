import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Server } from "http";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Transformer", () => {
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

  it("should transform outgoing properties using provided transformer", (done) => {
    // given

    // when
    request(server)
      .get("/cats")
      .expect(200)
      .end((err, { body }) => {
        // then
        expect(body.name).toEqual("Transformed Name");

        done();
      });
  });

  it("should transform outgoing nested properties using provided transformer", (done) => {
    // given

    // when
    request(server)
      .get("/cats/nested")
      .expect(200)
      .end((err, { body }) => {
        // then
        expect(body.cat.name).toEqual("Transformed Name");

        done();
      });
  });

  it("should resolve nested properties types using type decorator", (done) => {
    // given

    // when
    request(server)
      .get("/cats/typed-nested")
      .expect(200)
      .end((err, { body }) => {
        // then
        expect(body.cat.name).toEqual("Transformed Name");

        done();
      });
  });

  it("should resolve nested arrays types using type decorator", (done) => {
    // given

    // when
    request(server)
      .get("/cats/typed-nested-array")
      .expect(200)
      .end((err, { body }) => {
        // then
        expect(body.cats[0].name).toEqual("Transformed Name");

        done();
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
