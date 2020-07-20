/*
 * adonis-multitenancy
 *
 * (c) Remco Plasmeijer <remco.plasmeijer@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import {IsTenantDecorator, TenantManagerContract} from '@ioc:Hipsjs/MultiTenancy'
import {LucidModel} from '@ioc:Adonis/Lucid/Model'

export const isTenant: IsTenantDecorator = () => {
  return <T extends LucidModel>(constructor: T) => {
    constructor.boot()

    const parent = Object.getPrototypeOf(constructor.prototype).constructor

    const refreshManager = async function () {
      const tenantManager: TenantManagerContract = parent.$container.use('Hipsjs/MultiTenancy').TenantManager
      await tenantManager.refreshTenants()
    }

    // setup hooks to refresh the manager
    constructor.after('create', async () => {
      await refreshManager()
    })

    constructor.after('update', async () => {
      await refreshManager()
    })

    constructor.after('save', async () => {
      await refreshManager()
    })

    constructor.after('delete', async () => {
      await refreshManager()
    })
  }
}
