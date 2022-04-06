<p>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" style="margin-inline-end: 25px;" alt="Nest Logo" /></a>
</p>

# Nestjs Injectable class transformer

Community libarary that allows you to use DI to transform your dto.

# Table of Contents

- [How to use](#how-to-use)
- [Not Supported](#not-supported)

---

# How to use

## Installation

```shell
$ npm install nestjs-class-transformer
```

<details>
  <summary>Using yarn</summary>

```shell
$ yarn add nestjs-class-transformer
```

</details>

<details>
  <summary>Using pnpm</summary>

```shell
$ pnpm install nestjs-class-transformer
```

</details>

## Usage

First add the intercepter to the controller

```typescript
import { TransformerInterceptor } from "nestjs-class-transformer";

@UseInterceptors(TransformerInterceptor)
export class SomeController {}
```

> Remeber, you need to use <code>UseInterceptors</code> on every controller you need it's value to be transformed.
> You <b>CANNOT</b> use <code>useGlobalInterceptors</code> because each controller must include his own interceptor to be able to use DI correctly.

Then you need to define a transformer.

A transformer is just an injectable class that has a <code>transform</code> as shown below.
This class can inject whatever it needs and is accessible in it's module.

```typescript
import { Transform } from "nestjs-class-transformer";

export class NameTransformer implements Transform {
  constructor(public injectedService: InjectedService) {}

  transform(params: TransformFnParams) {
    return injectedService.formatName(params.value, params.key);
  }
}
```

Last, in your dto class do the following:

```typescript
import { Transformer } from "nestjs-class-transformer";
class SomeDto {
  @Transformer(NameTransformer)
  name: string;
}
```

And that is it, congratulations now you can transform your dtos from your injectable services with ease.

# Not Supported

- it does not work for incoming dto, it only transforms outgoing dto.
- it does not support any of the <code>TransformOptions</code> object.
