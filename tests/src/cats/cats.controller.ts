import { Controller, Get } from "@nestjs/common";
import {
  CatAsyncDto,
  CatDto,
  CatNestedArrayResolvedTypeDto,
  CatNestedDto,
  CatTypedDto,
} from "./dto/cat.dto";

@Controller("cats")
export class CatsController {
  constructor() {}

  @Get()
  cats() {
    return new CatDto();
  }

  @Get("nested")
  catsNested() {
    return new CatNestedDto();
  }

  @Get("typed-nested")
  catsTypedNested() {
    return new CatTypedDto({ name: "Lu" });
  }

  @Get("typed-nested-array")
  catsTypedNestedArray() {
    return new CatNestedArrayResolvedTypeDto([{ name: "Lu" }]);
  }

  @Get("async")
  catsAsync() {
    return new CatAsyncDto();
  }
}
