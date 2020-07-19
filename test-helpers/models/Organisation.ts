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
import { isTenant } from '../../src/Decorator/isTenant'

@isTenant()
export class Organisation extends BaseModel {
  @column()
  public id: number

  @column()
  public name: string

  @column()
  public domain: string
}
