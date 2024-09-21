import path from 'node:path'
import { ConfigurationHandler } from '../config/ConfigurationHandler'
import { MigrationsService } from '../db/MigrationsService'
import { Client } from '../db/MongoDb'
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
		const migrationsPath = [process.cwd(), customPath, config.migrationsPath]
		const migrationFiles = MigrationsService.getMigrations(migrationsPath)
		const clientInstance = new Client(config)

		await clientInstance.run(async ({ collection, db }) => {
			const migrationsService = new MigrationsService(collection)
			const appliedMigrationsSet = await migrationsService.getAppliedSet()
			for (const file of migrationFiles) {
				if (!appliedMigrationsSet.has(path.parse(file).name)) {
					const { migrate } = await import(path.join(...migrationsPath, file))
					await migrate(db)
					await migrationsService.insertApplied(path.parse(file).name)
					MongogratorLogger.logInfo(`Migration ${file} applied`)
				}
			}
		})
	}
}
