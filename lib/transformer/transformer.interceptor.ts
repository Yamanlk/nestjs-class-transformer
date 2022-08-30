import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { cloneDeep, isArray, isObject, pickBy, values } from "lodash";
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
        const _body = cloneDeep(body);
        const promises = this._inPlaceTransform(_body);
        return of(Promise.allSettled(promises).then(() => _body));
      })
    );
  }

  private _inPlaceTransform(
    object: any,
    promises: Promise<any>[] = []
  ): Promise<any>[] {
    if (isArray(object)) {
      object.forEach((_obj) => this._inPlaceTransform(_obj));

      return promises;
    }

    if (!isObject(object)) {
      return promises;
    }

    const metarecords =
      MetaStorage.instance().findTransformerMetadata(object.constructor) ?? [];

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

    const nested = values(pickBy({ ...object }, isObject));

    if (nested.length === 0) {
      return promises;
    }

    this._inPlaceTransform(nested);

    return promises;
  }
}
