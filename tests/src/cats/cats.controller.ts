import { Controller, Get } from "@nestjs/common";
import { CatDto, CatNestedDto } from "./dto/cat.dto";

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
}
