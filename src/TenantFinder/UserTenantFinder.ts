import TenantFinder from './TenantFinder'
import {MultiTenancyConfig, TenantManager} from '@ioc:Hipsjs/MultiTenancy'
import {LucidRow} from '@ioc:Adonis/Lucid/Model'

/*
  TODO
 */
export class UserTenantFinder extends TenantFinder {
  constructor (private config: MultiTenancyConfig) {
    super()
  }
  public async findForRequest (ctx): Promise<LucidRow> {
    const tenantId = ctx.auth.user[this.config.tenant_foreign_key]
    return TenantManager.findById(tenantId)
  }
}
