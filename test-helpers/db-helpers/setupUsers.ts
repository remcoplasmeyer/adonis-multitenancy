import Knex from 'knex'

export async function setupUsersTable (schema: Knex.SchemaBuilder) {
  const hasUsers = await schema.hasTable('users')
  if (!hasUsers) {
    await schema.createTable('users', (table) => {
      table.increments()
      table.string('uid')
      table.string('username').unique()
      table.string('email').unique()
      table.boolean('is_admin')
      table.string('password')
      table.integer('organisation_id')
      table.timestamps()
    })
  }
}
