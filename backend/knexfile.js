
// This file is used by Knex.js migrations and seeding.
// You can configure database connections and settings here.
// For more information, see: https://knexjs.org/#knexfile

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3' // Path relative to backend directory root
    },
    useNullAsDefault: true,
    migrations: {
      directory: './src/db/migrations',
    },
  },
};
