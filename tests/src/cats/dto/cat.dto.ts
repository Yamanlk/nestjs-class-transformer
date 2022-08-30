import { Transformer } from "../../../../lib";
import { TransformerService } from "../../tranformer.service";

export class CatDto {
  @Transformer(TransformerService)
  name!: string;
}

export class CatNestedDto {
  cat: CatDto = new CatDto();
}
