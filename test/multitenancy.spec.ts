/*
 * adonis-multitenancy
 *
 * (c) Remco Plasmeijer <remco.plasmeijer@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import test from 'japa'
import {cleanup, db, reset, setup, tenantManager} from '../test-helpers'
import {User} from '../test-helpers/models'
import {Organisation} from '../test-helpers/models/Organisation'

test.group('MultiTenancy Checks', (group) => {
  group.before(async () => {
    await setup(db)
    User.boot()
    Organisation.boot()
  })

  group.after(async () => {
    await cleanup(db)
  })

  group.afterEach(async () => {
    await reset(db)
  })

  test('new user has tenant', async (assert) => {
    const org: Organisation = new Organisation()
    await org.fill({ name: 'Hips', domain: 'www.google.com'}).save()

    const user1: User = new User()
    user1.fill({username: 'hips', email: 'remco.plasmeijer@gmail.com', organisationId: 1})
    await user1.save()
    // check if tenant is saved
    assert.isTrue(user1.organisationId === 1)

    // check if we can fetch the tenant with the Lucid API
    const fetchedUser: User = await User.query().where('id', 1).preload('organisation').first()
    assert.isTrue(fetchedUser.organisation.id === 1)
  })

  test('throw error without tenant', async (assert) => {
    // japa expects 1 assertion
    assert.plan(1)

    const user: User = new User()
    user.fill({username: 'hips', email: 'remco.plasmeijer@gmail.com'})
    try {
      await user.save()
    } catch (e) {
      // assert here as we want it to throw
      assert.isTrue(true)
    }
  })

  test('TenantManager is filled after creating tenants', async (assert) => {
    const org: Organisation = new Organisation()
    await org.fill({ name: 'Hips', domain: 'www.google.com'}).save()

    const org2: Organisation = new Organisation()
    await org2.fill({ name: 'Hips2', domain: 'www.google2.com'}).save()

    assert.strictEqual(tenantManager.tenants.length, 2)

    const foundOrg = await tenantManager.findById(2) as Organisation
    assert.strictEqual(foundOrg.name, 'Hips2')
  })
})
