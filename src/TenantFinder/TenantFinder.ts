import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {LucidRow} from '@ioc:Adonis/Lucid/Model'

export default abstract class TenantFinder{
  public abstract findForRequest (ctx: HttpContextContract): Promise<LucidRow>
}
