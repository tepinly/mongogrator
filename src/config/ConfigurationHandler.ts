import fs from 'node:fs'
import path from 'node:path'
import { register } from 'ts-node'
import { z } from 'zod'
import { compilerOptions } from '../../tsconfig.json'
import { MongogratorError } from '../errors/MongogratorError'
import { MongogratorLogger } from '../loggers/MongogratorLogger'
import {
	CONFIG_FILE_NAME,
	CONFIG_JS_FILE_NAME,
	CONFIG_TS_FILE_NAME,
} from './config'

const configurationSchema = z.object({
	url: z.string().url(), // Validates the cluster URL
	database: z.string(), // Database name
	migrationsPath: z.string(), // Migrations directory path
	logsCollectionName: z.string(), // Logs collection name
	format: z.enum(['ts', 'js']), // Format must be either 'ts' or 'js'
})

export type MongogratorConfig = z.infer<typeof configurationSchema>

export class ConfigurationHandler {
	public async readConfig(): Promise<MongogratorConfig> {
		register({ compilerOptions })

		// TODO: Join path if needed
		const possibleConfigNames = [CONFIG_TS_FILE_NAME, CONFIG_JS_FILE_NAME]

		for (const configFileName of possibleConfigNames) {
			if (fs.existsSync(configFileName)) {
				const relativePath = path.join(process.cwd(), configFileName)
				return await import(relativePath).then((module) =>
					configurationSchema.parseAsync(module.default),
				)
			}
		}

		throw new MongogratorError(`${CONFIG_FILE_NAME} file not found`)
	}

	public async initConfig(configFileName: string) {
		const configFilePath = path.join(process.cwd(), configFileName)
		if (fs.existsSync(configFilePath)) {
			throw new MongogratorError(`${configFileName} already initialized`)
		}
		const configPath = path.join(
			__dirname,
			'..',
			'..',
			'assets',
			configFileName,
		)
		fs.copyFileSync(configPath, configFilePath)
		MongogratorLogger.logInfo(`Config file created at ${configFilePath}`)
	}
}
