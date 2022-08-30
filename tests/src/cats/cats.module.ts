import { Module } from "@nestjs/common";
import { TransformerService } from "../tranformer.service";
import { CatsController } from "./cats.controller";

@Module({
  controllers: [CatsController],
  providers: [TransformerService],
})
export class CatsModule {}
