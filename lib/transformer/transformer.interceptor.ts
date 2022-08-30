import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { cloneDeep, isArray, isObject, pickBy, values } from "lodash";
import { map, Observable } from "rxjs";
import { MetaStorage } from "../meta-storage/meta-storage";

@Injectable()
export class TransformerInterceptor implements NestInterceptor {
  constructor(private _moduleRef: ModuleRef) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((body) => {
        const _body = cloneDeep(body);
        this._inPlaceTransform(_body);
        return _body;
      })
    );
  }

  private _inPlaceTransform(object: any) {
    if (isArray(object)) {
      object.forEach((_obj) => this._inPlaceTransform(_obj));

      return;
    }

    if (!isObject(object)) {
      return object;
    }

    const metarecords =
      MetaStorage.instance().findTransformerMetadata(object.constructor) ?? [];

    metarecords.forEach((metarecord) => {
      const transformer = this._moduleRef.get(metarecord.transformer);
      (object as any)[metarecord.propertyName] = transformer.transform({
        key: metarecord.propertyName,
        obj: object,
        options: metarecord.options,
        value: (object as any)[metarecord.propertyName],
      });
    });

    const nested = values(pickBy({ ...object }, isObject));

    if (nested.length === 0) {
      return;
    }

    this._inPlaceTransform(nested);
  }
}
