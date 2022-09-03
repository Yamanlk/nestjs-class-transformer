import { TypeMetadata } from "class-transformer";
import { TransformerMetadata } from "./meta-storage.interface";

export class MetaStorage {
  private static _metaStorage?: MetaStorage;

  private _typeMetadatas = new Map<Function, Map<string, TypeMetadata>>();
  private _transformerMetadata: Map<Function, TransformerMetadata[]> =
    new Map();

  /**
   *
   * @returns a singleton instance of the MetaStorage
   */
  public static instance(): MetaStorage {
    return MetaStorage._metaStorage
      ? MetaStorage._metaStorage
      : (MetaStorage._metaStorage = new MetaStorage());
  }

  public records(): TransformerMetadata[][] {
    return Array.from(this._transformerMetadata.values());
  }

  /**
   *
   * @param metadata
   * @description registers a property in a class to be transformed
   */
  public addTransformerMetadata(metadata: TransformerMetadata) {
    this._initializeOrSkip(metadata.target);

    const _metadataRecords = this._metaRecordsFor(metadata.target)!;

    this._detectAndThrowDuplicateTransformers(_metadataRecords, metadata);

    _metadataRecords.push(metadata);
  }
  public findTransformerMetadata(
    target: Function
  ): readonly TransformerMetadata[] | undefined {
    if (!this._transformerMetadata.has(target)) {
      return undefined;
    }
    return this._transformerMetadata.get(target)!;
  }

  public addTypeMetadata(metadata: TypeMetadata) {
    if (!this._typeMetadatas.has(metadata.target)) {
      this._typeMetadatas.set(metadata.target, new Map<string, TypeMetadata>());
    }
    this._typeMetadatas
      .get(metadata.target)!
      .set(metadata.propertyName, metadata);
  }

  public findTypeMetadata(
    target: Function,
    propertyName: string
  ): TypeMetadata | undefined {
    if (!this._typeMetadatas.has(target)) {
      return undefined;
    }
    return this._typeMetadatas.get(target)!.get(propertyName);
  }

  /**
   *
   * @param target metadata target
   * @description initializes an empty record for a target if it has no record
   */
  private _initializeOrSkip(target: any): void {
    if (!this._transformerMetadata.has(target)) {
      this._transformerMetadata.set(target, []);
    }
  }

  /**
   *
   * @param target metadata target
   * @returns transformer metadata registerd for this target
   */
  private _metaRecordsFor(target: any): TransformerMetadata[] | undefined {
    return this._transformerMetadata.get(target);
  }

  private _detectAndThrowDuplicateTransformers(
    records: TransformerMetadata[],
    newRecord: TransformerMetadata
  ) {
    if (records.some((meta) => meta.propertyName === newRecord.propertyName)) {
      throw {
        message: "You can't use multiple transformers for the same property",
      };
    }
  }
}
