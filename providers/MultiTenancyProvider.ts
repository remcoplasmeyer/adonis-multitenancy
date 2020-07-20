/*
 * adonis-multitenancy
 *
 * (c) Remco Plasmeijer <remco.plasmeijer@gmail.com>sdf
 *
 * For the full copyright and license information, please va
 */

import {IocContract} from '@adonisjs/fold'
import {TenantManager} from '../src/TenantManager'
import {MultiTenancyConfig} from '@ioc:Hipsjs/MultiTenancy'
import {isTenant} from '../src/Decorator/isTenant'
import {belongsToTenant} from '../src/Decorator/belongsToTenant'

/**
 * Provider to register multitenancy with the IoC container
 */
export default class MultiTenancyProvider {
  constructor (protected container: IocContract) {}

  public register (): void {
    this.container.singleton('Hipsjs/MultiTenancy', () => {
      const multiTenancyConfig = this.getConfig()
      return {
        TenantManager: new TenantManager(this.container, multiTenancyConfig),
        isTenant: isTenant,
        belongsToTenant: belongsToTenant,
      }
    })
  }

  private getConfig (): MultiTenancyConfig {
    return this.container.use('Adonis/Core/Config').get('multitenancy', {})
  }

  /**
   * Hook into boot to load initial tenants
   */
  public async boot () {
    this.container.use('Hipsjs/MultiTenancy').TenantManager.refreshTenants()
  }
}
