import { Injectable } from "@nestjs/common";
import { TransformFnParams } from "class-transformer";
import { Transform } from "../../lib";

@Injectable()
export class TransformerService implements Transform {
  transform(params: Omit<TransformFnParams, "type">) {
    return "Transformed Name";
  }
}

export class AsyncTransformerService implements Transform {
  transform(params: Omit<TransformFnParams, "type">) {
    return Promise.resolve("Transformed Name");
  }
}
