/*
 * adonis-multitenancy
 *
 * (c) Remco Plasmeijer <remco.plasmeijer@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseModel } from '../index'
import { column } from '@adonisjs/lucid/build/src/Orm/Decorators'
import { belongsToTenant } from '../../src/Decorator/belongsToTenant'

@belongsToTenant()
export class User extends BaseModel {
  public organisationId: number

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public isAdmin: boolean
}
