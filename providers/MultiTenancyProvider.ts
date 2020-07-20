/*
 * adonis-multitenancy
 *
 * (c) Remco Plasmeijer <remco.plasmeijer@gmail.com>sdf
 *
 * For the full copyright and license information, please va
 */

import {TenantManager} from '../src/TenantManager'
import {isTenant} from '../src/Decorator/isTenant'
import {belongsToTenant} from '../src/Decorator/belongsToTenant'

/**
 * Provider to register multitenancy with the IoC container
 */
export default class MultiTenancyProvider {
  constructor (protected container: any) {}

  public register (): void {
    this.container.singleton('Hipsjs/MultiTenancy', () => {
      return {
        TenantManager: new TenantManager(this.container),
        isTenant: isTenant,
        belongsToTenant: belongsToTenant,
      }
    })
  }

  /**
   * Hook into boot to load initial tenants
   */
  public async boot () {
    this.container.use('Hipsjs/MultiTenancy').TenantManager.refreshTenants()
  }
}
