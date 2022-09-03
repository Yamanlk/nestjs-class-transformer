import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { entries, isArray, isObject, pickBy } from "lodash";
import { Observable, of, switchMap } from "rxjs";
import { MetaStorage } from "../meta-storage/meta-storage";

@Injectable()
export class TransformerInterceptor implements NestInterceptor {
  constructor(private _moduleRef: ModuleRef) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      switchMap((body) => {
        if (!isObject(body)) {
          return of(body);
        } else {
          const promises = this._inPlaceTransform(body);
          return of(Promise.allSettled(promises).then(() => body));
        }
      })
    );
  }

  private _inPlaceTransform(
    object: any,
    type?: Function,
    promises: Promise<any>[] = []
  ): Promise<any>[] {
    type = type ?? object.constructor;

    if (isArray(object)) {
      object.forEach((_obj) => this._inPlaceTransform(_obj, type, promises));

      return promises;
    }

    if (!isObject(object)) {
      return promises;
    }

    const metarecords = type
      ? MetaStorage.instance().findTransformerMetadata(type) ?? []
      : [];

    promises.push(
      ...metarecords.map(async (metarecord) => {
        const transformer = this._moduleRef.get(metarecord.transformer);
        (object as any)[metarecord.propertyName] = await transformer.transform({
          key: metarecord.propertyName,
          obj: object,
          options: metarecord.options,
          value: (object as any)[metarecord.propertyName],
        });
      })
    );

    const nested = entries(pickBy({ ...object }, isObject));

    if (nested.length === 0) {
      return promises;
    }

    for (const [key, value] of nested) {
      const propType =
        value.constructor ?? !!type
          ? MetaStorage.instance().findTypeMetadata(type!, key)?.typeFunction
          : undefined;

      this._inPlaceTransform(value, propType?.(), promises);
    }

    return promises;
  }
}
