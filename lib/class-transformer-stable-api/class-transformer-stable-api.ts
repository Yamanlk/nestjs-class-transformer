// import { TypeMetadata } from "class-transformer";
export interface ClassTransformerStableAPI {
  findTypeMetadata(target: any, propertyName: string): any;
}

export class ClassTransformerStableAPI implements ClassTransformerStableAPI {
  private readonly classTransformerStorage =
    require("class-transformer/cjs/storage").defaultMetadataStorage;

  constructor() {}

  findTypeMetadata(target: any, propertyName: string) {
    return this.classTransformerStorage.findTypeMetadata(target, propertyName);
  }
}
