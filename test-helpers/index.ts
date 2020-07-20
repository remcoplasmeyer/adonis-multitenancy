import 'reflect-metadata'
import {join} from 'path'
import {Ioc} from '@adonisjs/fold'
import {Filesystem} from '@poppinss/dev-utils'
import {IncomingMessage, ServerResponse} from 'http'
import {Logger} from '@adonisjs/logger/build/standalone'
import {Database} from '@adonisjs/lucid/build/src/Database'
import {Profiler} from '@adonisjs/profiler/build/standalone'
import {Emitter} from '@adonisjs/events/build/standalone'
import {Adapter} from '@adonisjs/lucid/build/src/Orm/Adapter'
import {Encryption} from '@adonisjs/encryption/build/standalone'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {SessionConfig} from '@ioc:Adonis/Addons/Session'
import {HttpContext, Router} from '@adonisjs/http-server/build/standalone'
import {SessionManager} from '@adonisjs/session/build/src/SessionManager'
import {DatabaseContract, QueryClientContract} from '@ioc:Adonis/Lucid/Database'
import {BaseModel as LucidBaseModel} from '@adonisjs/lucid/build/src/Orm/BaseModel'
import * as decorators from '@adonisjs/lucid/build/src/Orm/Decorators'
import {scope} from '@adonisjs/lucid/build/src/Helpers/scope'
import {Config} from '@adonisjs/config/build/standalone'
import {setupUsersTable} from './db-helpers/setupUsers'
import {setupOrganisationsTable} from './db-helpers/setupOrganisations'
import {TenantManager} from '../src/TenantManager'
import {MultiTenancyConfig} from '@ioc:Hipsjs/MultiTenancy'

const fs = new Filesystem(join(__dirname, '__tmpTestData'))
const logger = new Logger({enabled: false, level: 'debug', name: 'adonis', prettyPrint: true})
const profiler = new Profiler(__dirname, logger, {})
const sessionConfig: SessionConfig = {
  driver: 'cookie',
  cookieName: 'adonis-session',
  clearWithBrowser: false,
  age: '2h',
  cookie: {
    path: '/',
  },
}

export const container = new Ioc()
export const secret = 'securelong32characterslongsecret'
export const encryption = new Encryption({secret})

export const emitter = new Emitter(container)
container.singleton('Adonis/Core/Event', () => emitter)

/**
 * Create the users tables
 */
async function createUsersTable (client: QueryClientContract) {
  await setupUsersTable(client.schema)
}

/**
 * Create the tenants tables
 */
async function createTenantsTable (client: QueryClientContract) {
  await setupOrganisationsTable(client.schema)
}

/**
 * Returns instance of database
 */
export function getDb () {
  const db: Database = new Database({
    connection: 'primary',
    connections: {
      primary: {
        client: 'sqlite3',
        connection: {
          filename: join(fs.basePath, 'primary.sqlite3'),
        },
      },
      secondary: {
        client: 'sqlite3',
        connection: {
          filename: join(fs.basePath, 'secondary.sqlite3'),
        },
      },
    },
  }, logger, profiler, emitter)

  container.singleton('Adonis/Lucid/Database', () => db)
  return db
}

/**
 * Performs an initial setup
 */
export async function setup (db: Database) {
  await fs.ensureRoot()
  await createUsersTable(db.connection())
  await createUsersTable(db.connection('secondary'))
  await createTenantsTable(db.connection())
  await createTenantsTable(db.connection('secondary'))

  HttpContext.getter('session', function session () {
    const sessionManager = new SessionManager(container, sessionConfig)
    return sessionManager.create(this)
  }, true)
}

/**
 * Performs cleanup
 */
export async function cleanup (db: DatabaseContract) {
  // await db.connection().schema.dropTableIfExists('users')
  // await db.connection('secondary').schema.dropTableIfExists('users')
  await db.manager.closeAll(true)
  await fs.cleanup()
}

/**
 * Reset database tables
 */
export async function reset (db: DatabaseContract) {
  await db.connection().truncate('users')
  await db.connection('secondary').truncate('users')

  await db.connection().truncate('organisations')
  await db.connection('secondary').truncate('organisations')
}

/**
 * Returns an instance of ctx
 */
export function getCtx (req?: IncomingMessage, res?: ServerResponse) {
  const httpRow = profiler.create('http:request')
  const router = new Router(encryption)

  return HttpContext
    .create(
      '/',
      {},
      logger,
      httpRow,
      encryption,
      router,
      req,
      res,
      {} as any,
    ) as unknown as HttpContextContract
}

/**
 * Signs value to be set as cookie header
 */
export function signCookie (value: any, name: string) {
  return `${name}=s:${encryption.verifier.sign(value, undefined, name)}`
}

/**
 * Encrypt value to be set as cookie header
 */
export function encryptCookie (value: any, name: string) {
  return `${name}=e:${encryption.encrypt(value, undefined, name)}`
}

/**
 * Decrypt cookie
 */
export function decryptCookie (cookie: any, name: string) {
  const cookieValue = decodeURIComponent(cookie.split(';')[0])
    .replace(`${name}=`, '')
    .slice(2)

  return encryption.decrypt<any>(cookieValue, name)
}

/**
 * Unsign cookie
 */
export function unsignCookie (cookie: any, name: string) {
  const cookieValue = decodeURIComponent(cookie.split(';')[0])
    .replace(`${name}=`, '')
    .slice(2)

  return encryption.verifier.unsign<any>(cookieValue, name)
}

/**
 * Mocks action on a object
 */
export function mockAction (collection: any, name: string, verifier: any) {
  collection[name] = function (...args: any[]) {
    verifier(...args)
    delete collection[name]
  }
}

/**
 * Mocks property on a object
 */
export function mockProperty (collection: any, name: string, value: any) {
  Object.defineProperty(collection, name, {
    get () {
      delete collection[name]
      return value
    },
    enumerable: true,
    configurable: true,
  })
}

export const db = getDb()

container.singleton('Adonis/Lucid/Orm', () => {
  return {
    BaseModel: LucidBaseModel,
    scope,
    ...decorators,
  }
})

container.singleton('Adonis/Core/Config', () => {
  return config
})

export const adapter = new Adapter(db)
LucidBaseModel.$adapter = adapter
LucidBaseModel.$container = container

export const BaseModel = LucidBaseModel

export const tenantConfig: MultiTenancyConfig = {
  'tenant_model': require('./models/Organisation').Organisation,
  'tenant_foreign_key': 'organisation_id',
}

export const config = new Config({
  multitenancy: tenantConfig,
})

export const tenantManager = new TenantManager(container, tenantConfig)

container.singleton('Hipsjs/MultiTenancy', () => {
  return {
    TenantManager: tenantManager,
  }
})
