import fs from 'node:fs'
import path from 'node:path'
import { MongoClient } from 'mongodb'
import { ConfigurationHandler } from '../config/ConfigurationHandler'
import { MigrationsService } from '../db/MigrationsService'
import { MongogratorError } from '../errors/MongogratorError'
import { MongogratorLogger } from '../loggers/MongogratorLogger'
import { BaseCommandStrategy } from './BaseCommandStrategy'

export class MigrateCommand extends BaseCommandStrategy {
	static triggers = ['migrate']
	static description = 'Run all migrations that have not been applied yet'
	static args: string[] = ['[config_path]']
	static detailedDescription = `
		This command executes all pending migration files in the migrations directory.
		Migrations that have already been applied are skipped.
		The command should be run from the same location as the config file.
		The config file determines the location of the migrations folder.
	`

	async execute() {
		const customPath = this.commandOptions.args[0] ?? ''
		const config = await ConfigurationHandler.readConfig(customPath)
		const migrationsPath = path.join(
			process.cwd(),
			customPath,
			config.migrationsPath,
		)
		this.throwWhenNoMigrationsDirFound(migrationsPath)
		const migrationsFiles = fs.readdirSync(migrationsPath).sort()
		const client = await new MongoClient(config.url).connect()
		const db = client.db(config.database)
		const migrationsService = new MigrationsService(
			db.collection(config.logsCollectionName),
		)
		const appliedMigrationsSet = await migrationsService.getAppliedSet()
		for (const file of migrationsFiles) {
			if (!appliedMigrationsSet.has(path.parse(file).name)) {
				const { migrate } = await import(path.join(migrationsPath, file))
				await migrate(db)
				await migrationsService.insertApplied(path.parse(file).name)
				MongogratorLogger.logInfo(`Migration ${file} applied`)
			}
		}
		await client.close()
	}

	private throwWhenNoMigrationsDirFound(dirPath: string) {
		if (!fs.existsSync(dirPath)) {
			throw new MongogratorError('No migrations directory found')
		}
	}
}
