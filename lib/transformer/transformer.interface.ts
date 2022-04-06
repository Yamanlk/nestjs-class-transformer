import { TransformFnParams } from "class-transformer";

export interface Transform {
  transform(params: Omit<TransformFnParams, "type">): any;
}
