import fs from 'node:fs'
import path from 'node:path'
import { MongoClient } from 'mongodb'
import { ConfigurationHandler } from '../config/ConfigurationHandler'
import { MigrationsService } from '../db/MigrationsService'
import { BaseCommandStrategy } from './BaseCommandStrategy'

export class ListCommand extends BaseCommandStrategy {
	static triggers = ['list']
	static description = 'List all migrations and their status'
	static detailedDescription = `
		This command lists all the migration files located in the configured migrations directory.
		It checks each migration file to determine whether it has been applied to the database.
		Each migration will be displayed with a status of either "MIGRATED" if it has been applied,
		or "NOT MIGRATED" if it has not been applied yet.
	`

	async execute() {
		const config = await ConfigurationHandler.readConfig()
		const migrationsPath = path.join(process.cwd(), config.migrationsPath)
		const files = fs.readdirSync(migrationsPath).sort()
		const client = await new MongoClient(config.url).connect()
		const db = client.db(config.database)
		const migrationsService = new MigrationsService(
			db.collection(config.logsCollectionName),
		)
		const appliedMigrationsSet = await migrationsService.getAppliedSet()
		const migrations = files.map((file) => {
			const migration = path.parse(file).name
			const status = appliedMigrationsSet.has(migration)
				? 'MIGRATED'
				: 'NOT MIGRATED'
			return { migration, status }
		})
		console.table(migrations)
		await client.close()
	}
}
