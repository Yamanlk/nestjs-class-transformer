import { Type } from "@nestjs/common";
import { TransformMetadata } from "class-transformer";
import { Transform } from "../transformer";

export interface TransformerMetadata
  extends Omit<TransformMetadata, "transformFn"> {
  transformer: Type<Transform> | string | symbol;
}
