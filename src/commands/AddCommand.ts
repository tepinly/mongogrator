import fs from 'node:fs'
import path from 'node:path'
import { ConfigurationHandler } from '../config/ConfigurationHandler'
import { MongogratorError } from '../errors/MongogratorError'
import { MongogratorLogger } from '../loggers/MongogratorLogger'
import { BaseCommandStrategy } from './BaseCommandStrategy'

export class AddCommand extends BaseCommandStrategy {
	static triggers = ['add']
	static description = 'Creates a new migration file with the provided name'
	public detailedDescription = `
		This command creates a new migration file in the configured migrationsPath directory.
		It takes one argument, the name of the migration file to be created. It appends a timestamp 
		to the name to ensure uniqueness. The migration file can be generated in either JavaScript (.js)
		or TypeScript (.ts) format, based on the specified configuration in the mongogrator.config file.
	`

	async execute() {
		this.handleHelpFlag()
		const fileName =
			this.commandOptions.args[0] ?? this.throwWhenNoFileNameProvided()
		const config = await ConfigurationHandler.readConfig()
		this.createMigrationDirectoryIfNotExists(config.migrationsPath)

		const newFilePath = path.join(
			process.cwd(),
			config.migrationsPath,
			`${this.getTimestamp()}_${fileName}.${config.format}`,
		)
		const templatePath = path.join(
			__dirname,
			'..',
			'..',
			'assets',
			`template.${config.format}`,
		)
		fs.copyFileSync(templatePath, newFilePath)
		MongogratorLogger.logInfo(`Migration created at ${newFilePath}`)
	}

	private throwWhenNoFileNameProvided = () => {
		throw new MongogratorError('Please provide a name for the migration file')
	}

	private createMigrationDirectoryIfNotExists = (migrationsPath: string) =>
		!fs.existsSync(migrationsPath) &&
		fs.mkdirSync(migrationsPath, { recursive: true })

	// new Date().toISOString() returns a string in the format "YYYY-MM-DDTHH:mm:ss.sssZ"
	// So we remove all the characters and only keep the digits so we get the format "YYYYMMDDHHmmsssss"
	private getTimestamp = () =>
		new Date().toISOString().replace(/[TZ\-\.:]/g, '')
}
