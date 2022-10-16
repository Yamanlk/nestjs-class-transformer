import { Type } from "class-transformer";
import { Transformer } from "../../../../lib";
import {
  AsyncTransformerService,
  TransformerService,
} from "../../tranformer.service";

export class CatDto {
  @Transformer(TransformerService)
  name!: string;
}

export class CatNestedDto {
  cat: CatDto = new CatDto();
}

export class CatAsyncDto {
  @Transformer(AsyncTransformerService)
  name!: string;
}

export class CatTypedDto {
  @Type(() => CatDto)
  cat!: CatDto;

  constructor(cat: any) {
    this.cat = cat;
  }
}

export class CatNestedArrayResolvedTypeDto {
  @Type(() => CatDto)
  cats!: CatDto[];

  constructor(cats: any) {
    this.cats = cats;
  }
}
