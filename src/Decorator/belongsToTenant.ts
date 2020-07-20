/*
 * adonis-multitenancy
 *
 * (c) Remco Plasmeijer <remco.plasmeijer@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {LucidModel, LucidRow} from '@ioc:Adonis/Lucid/Model'
import {BelongsToTenantDecorator, MultiTenancyConfig} from '@ioc:Hipsjs/MultiTenancy'
import {NeedsTenantException} from '../Exceptions/NeedsTenantException'
import {scope} from '@adonisjs/lucid/build/src/Helpers/scope'
import {lodash} from '@poppinss/utils'

export const belongsToTenant: BelongsToTenantDecorator = () => {
  return <T extends LucidModel>(constructor: T) => {
    constructor.boot()

    const parent = Object.getPrototypeOf(constructor.prototype).constructor
    const Config = parent.$container.use('Adonis/Core/Config')

    // options provided in /options/multitenancy.ts
    const config: MultiTenancyConfig = Config.get('multitenancy', {})

    const columnName: string = config.tenant_foreign_key
    const modelColumnName = lodash.camelCase(columnName)
    const TenantModel = config.tenant_model

    // add a forTenant Lucid query scope
    constructor['forTenant'] = scope((query, id) => {
      query.where(columnName, '=', id)
    })

    // construct options
    const columnOptions = {
      meta: {
        type: 'number',
      },
    }

    // add column and relation
    constructor.$addColumn(modelColumnName, columnOptions)
    constructor.$addRelation(
      TenantModel.name.toLowerCase(),
      'belongsTo',
      () => TenantModel,
      { foreignKey: modelColumnName }
    )

    // add hook that throws error when no tenant is supplied
    constructor.before('create', (modelInstance: LucidRow) => {
      if(
        modelInstance.$attributes[modelColumnName] === undefined
          && modelInstance.$dirty[modelColumnName] === undefined
      ) {
        throw new NeedsTenantException(`${constructor.name} needs a tenant`)
      }
    })
  }
}
