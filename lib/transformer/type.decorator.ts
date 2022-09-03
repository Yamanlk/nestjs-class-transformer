import { TypeHelpOptions, TypeOptions } from "class-transformer";
import { MetaStorage } from "../meta-storage/meta-storage";

export function Type(
  typeFunction: (type?: TypeHelpOptions) => Function,
  options: TypeOptions = {}
): PropertyDecorator {
  return function (target: any, propertyName: string | symbol): void {
    try {
      const ClassTransformer = require("class-transformer");
      ClassTransformer.Type(typeFunction, options)(target, propertyName);
    } catch (error) {}
    const reflectedType = (Reflect as any).getMetadata(
      "design:type",
      target,
      propertyName
    );
    MetaStorage.instance().addTypeMetadata({
      target: target.constructor,
      propertyName: propertyName as string,
      reflectedType,
      typeFunction,
      options,
    });
  };
}
