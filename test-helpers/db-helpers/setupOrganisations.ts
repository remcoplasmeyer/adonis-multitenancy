import Knex from 'knex'

export async function setupOrganisationsTable (schema: Knex.SchemaBuilder) {
  const hasUsers = await schema.hasTable('organisations')
  if (!hasUsers) {
    await schema.createTable('organisations', (table) => {
      table.increments('id').notNullable().primary()
      table.string('name').notNullable()
      table.string('domain').notNullable()
      table.timestamps(true)
    })
  }
}
