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
