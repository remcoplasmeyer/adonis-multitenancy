/*
 * adonis-multitenancy
 *
 * (c) Remco Plasmeijer <remco.plasmeijer@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare module '@ioc:Hipsjs/MultiTenancy' {
  import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
  import {LucidModel, LucidRow} from '@ioc:Adonis/Lucid/Model'
  import {BaseModel} from '@ioc:Adonis/Lucid/Orm'

  export interface TenantFinderContract {
    findForRequest (ctx: HttpContextContract): Promise<LucidRow>
  }

  export interface TenantManagerContract {
    tenants: LucidRow[]
    refreshTenants(): void
    findById(tenantId: number): Promise<LucidRow>;
  }

  export interface MultiTenancyConfig {
    tenant_model: LucidModel,
    tenant_foreign_key: string
  }

  /**
   * Decorator function
   */
  export type DecoratorFn = (target: any) => void

  export const TenantManager: TenantManagerContract
  export type BelongsToTenantDecorator = () => DecoratorFn
  export type IsTenantDecorator = () => DecoratorFn
  export const belongsToTenant: BelongsToTenantDecorator
  export const isTenant: IsTenantDecorator

  // todo:
  export const UserTenantFinder: TenantFinderContract
}
