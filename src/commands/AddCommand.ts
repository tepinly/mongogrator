import fs from 'node:fs'
import path from 'node:path'
import { ConfigurationHandler } from '../config/ConfigurationHandler'
import { MongogratorLogger } from '../loggers/MongogratorLogger'
import type { CommandConfig, ICommandStrategy } from './ICommandStrategy'

export class AddCommand implements ICommandStrategy {
	static triggers = ['add']

	async execute({ args }: CommandConfig) {
		const fileName = args[0]
		const config = await new ConfigurationHandler().readConfig()
		if (
			!(
				fs.existsSync(config.migrationsPath) &&
				fs.statSync(config.migrationsPath).isDirectory()
			)
		) {
			fs.mkdirSync(config.migrationsPath)
		}

		// new Date().toISOString() returns a string in the format "YYYY-MM-DDTHH:mm:ss.sssZ"
		// So we remove all the characters and only keep the digits so we get the format "YYYYMMDDHHmmsssss"
		const timestamp = new Date().toISOString().replace(/[TZ\-\.:]/g, '')
		const newFilePath = path.join(
			process.cwd(),
			config.migrationsPath,
			`${timestamp}_${fileName}.${config.format}`,
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
}
