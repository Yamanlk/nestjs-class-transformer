import { TransformOptions } from "class-transformer";
import { MetaStorage } from "../meta-storage/meta-storage";
import { Transform } from "./transformer.interface";

export function Transformer(
  transformer: { new (...args: any): Transform } | string | symbol,
  options?: TransformOptions
): PropertyDecorator {
  return function (object: any, propertyName: string | symbol): void {
    MetaStorage.instance().addTransformerMetadata({
      target: object.constructor,
      propertyName: propertyName as string,
      transformer,
      options: options ?? {},
    });
  };
}
