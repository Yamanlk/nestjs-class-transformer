import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TransformerInterceptor } from "../../lib";
import { CatsModule } from "./cats/cats.module";
import { TransformerService } from "./tranformer.service";

@Module({
  imports: [CatsModule],
  providers: [
    TransformerService,
    { provide: APP_INTERCEPTOR, useClass: TransformerInterceptor },
  ],
})
export class AppModule {}
