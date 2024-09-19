import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import { MongogratorError } from '../errors/MongogratorError'
import { MongogratorLogger } from '../loggers/MongogratorLogger'
import {
	CONFIG_FILE_NAME,
	CONFIG_JS_FILE_NAME,
	CONFIG_TS_FILE_NAME,
} from './config'

export const mongogratorConfigSchema = z.object({
	url: z.string().url(), // Validates the cluster URL
	database: z.string(), // Database name
	migrationsPath: z.string(), // Migrations directory path
	logsCollectionName: z.string(), // Logs collection name
	format: z.enum(['ts', 'js']), // Format must be either 'ts' or 'js'
})

type TMongogratorConfig = z.infer<typeof mongogratorConfigSchema>

export namespace ConfigurationHandler {
	export async function readConfig(): Promise<TMongogratorConfig> {
		for (const configFileName of [CONFIG_TS_FILE_NAME, CONFIG_JS_FILE_NAME]) {
			if (fs.existsSync(configFileName)) {
				const relativePath = path.join(process.cwd(), configFileName)
				return await import(relativePath).then((module) =>
					mongogratorConfigSchema.parseAsync(module.default),
				)
			}
		}

		throw new MongogratorError(`${CONFIG_FILE_NAME} file not found`)
	}

	export async function initConfig(fileName: string) {
		const configFilePath = path.join(process.cwd(), fileName)
		if (fs.existsSync(configFilePath)) {
			throw new MongogratorError(`${fileName} already initialized`)
		}
		const configPath = path.join(__dirname, '..', '..', 'assets', fileName)
		fs.copyFileSync(configPath, configFilePath)
		MongogratorLogger.logInfo(`Config file created at ${configFilePath}`)
	}
}
