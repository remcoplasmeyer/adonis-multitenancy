# AdonisJS Multitenancy

> Works with adonis preview v5

Simple multi tenancy for AdonisJS - WIP but functional :)

- Single database (for now)
- `@isTenant` and `@belongsToTenant` Lucid decorators
- Caches tenants in memory
- Errors thrown when tenant not provided
- Roadmap: query scopes, plug and play middleware, more caching options, multi database 

## :page_facing_up: Installation

1\. Install using `npm` or `yarn` and call ace's invoke

```bash
npm i --save @hipsjs/adonis-multitenancy
node ace invoke @hipsjs/adonis-multitenancy
```

2\. Edit `config/multitenancy.ts` with your configuration.

3\. Make sure to register the provider inside `.adonisrc.json` file.

```json
"providers": [
  "@hipsjs/adonis-multitenancy"
]
```

4\. For TypeScript projects add to `tsconfig.json` file:
```json
"compilerOptions": {
  "types": [
    "@hipsjs/adonis-multitenancy"
  ]
}
```


## :wrench: Usage

Add the `@isTenant` decorator to your Tenant's Lucid model, in this example we use `Organisation` as our Tenant, the model will need an `id`:

```typescript
import { BaseModel } from '../index'
import { column } from '@adonisjs/lucid/build/src/Orm/Decorators'
import { isTenant } from '../../src/Decorator/isTenant'

@isTenant()
export class Organisation extends BaseModel {
  @column()
  public id: number
}
```

Add the `@belongsToTenant` decorator to models that belong to a tenant:
```
@belongsToTenant()
export class User extends BaseModel {
  public organisationId: number
}
```


## :gear: Development
See `package.json` scripts

## :star: Show Your Support

Please give a :star: if this project helped you!

## :two_hearts: Contributing

If you have any questions or requests or want to contribute to `@hipsjs/adonis-multitenancy` or other packages, please write an [issue](https://github.com/remcoplasmeyer/adonis-multitenancy/issues) or send in a Pull Request freely.
