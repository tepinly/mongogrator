export const configTemplates = {
	ts: `
const mongogratorConfig = {
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Database name for which the migrations will be executed
	migrationsPath: './migrations', // Migrations directory relative to the location of the commands
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
	format: 'ts', // Format type of the migration files ['ts', 'js']
}

export default mongogratorConfig
`,
	js: `
const mongogratorConfig = {
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Database name for which the migrations will be executed
	migrationsPath: './migrations', // Migrations directory relative to the location of the commands
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
	format: 'js', // Format type of the migration files ['ts', 'js']
}

module.exports = mongogratorConfig
`,
}

export const migrationTemplates = {
	ts: `
import type { Db } from 'mongodb'

/**
 * This function is called when the migration is run.
 * @param _db The mongodb database object that's passed to the migration
 */
export const migrate = async (_db: Db): Promise<void> => {
	// Migration code here
}
`,
	js: `
const { Db } = require('mongodb')

/**
 * This function is called when the migration is run.
 * @param {Db} _db The mongodb database object that's passed to the migration
 * @returns {Promise<void>}
 */
const migrate = async (_db) => {
	// Migration code here
}

module.exports = { migrate }
`,
}
