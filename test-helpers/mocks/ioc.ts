import {Ioc} from '@adonisjs/fold/build'
import {Emitter} from '@adonisjs/events/build/standalone'
import {Logger} from '@adonisjs/logger/build/standalone'
import {SqliteConfig} from '@ioc:Adonis/Lucid/Database'
import {Database} from '@adonisjs/lucid/build/src/Database'
import {Profiler} from '@adonisjs/profiler/build/standalone'

export const ioc = new Ioc()

export function setupDB (dbConfig: SqliteConfig): Database {
  const emitter = new Emitter(ioc)
  const logger = new Logger({
    enabled: true,
    name: 'lucid',
    level: 'debug',
    prettyPrint: false,
  })
  const profiler = new Profiler(__dirname, logger, {enabled: true})

  return new Database({
    connection: 'sqlite',
    connections: {sqlite: dbConfig},
  }, logger, profiler, emitter)
}
