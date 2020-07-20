import {TenantManagerContract} from '@ioc:Hipsjs/MultiTenancy'
import {IocContract} from '@adonisjs/fold/build'
import {BaseModel} from '@ioc:Adonis/Lucid/Orm'
import {LucidRow} from '@ioc:Adonis/Lucid/Model'

/*
    Holds all tenants, cached in memory
*/
export class TenantManager implements TenantManagerContract {
  public tenants: LucidRow[]

  // @ts-ignore
  constructor (private container: IocContract) {
    // todo:
    // const validator = new TenantConfigValidator(config, 'multitenancy', 'config/multitenancy')
  }

  private model (): typeof BaseModel{
    const Config = this.container.use('Adonis/Core/Config')
    const config = Config.get('multitenancy')
    return config.tenant_model
  }

  public async refreshTenants (): Promise<LucidRow[]> {
    this.tenants = await this.model().all()
    return this.tenants
  }

  public async findById (tenantId: number): Promise<LucidRow> {
    for (let i = 0; i < this.tenants.length; i++) {
      const tenant = this.tenants[i]
      // todo: get rid of ts-ignore? not sure how to get typed primary key here
      // @ts-ignore
      if(tenant.id === tenantId) {
        return tenant
      }
    }
    throw new Error(`Tenant with id ${tenantId} not found`)
  }
}
