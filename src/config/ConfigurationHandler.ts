import fs from 'node:fs'
import path from 'node:path'
import { MongogratorError } from '../errors/MongogratorError'
import { MongogratorLogger } from '../loggers/MongogratorLogger'
import {
	CONFIG_FILE_NAME,
	CONFIG_JS_FILE_NAME,
	CONFIG_TS_FILE_NAME,
	type TMongogratorConfig,
	mongogratorConfigSchema,
} from './config'
import { configTemplates } from './templates'

export namespace ConfigurationHandler {
	export async function readConfig(
		customPath = '',
	): Promise<TMongogratorConfig> {
		for (const configFileName of [CONFIG_TS_FILE_NAME, CONFIG_JS_FILE_NAME]) {
			const relativePath = path.join(process.cwd(), customPath, configFileName)
			if (fs.existsSync(relativePath)) {
				return await import(relativePath).then((module) =>
					mongogratorConfigSchema.parseAsync(module.default),
				)
			}
		}

		throw new MongogratorError(`${CONFIG_FILE_NAME} file not found`)
	}

	export async function initConfig(useJs: boolean) {
		const fileName = useJs ? CONFIG_JS_FILE_NAME : CONFIG_TS_FILE_NAME
		const extension = useJs ? 'js' : 'ts'
		const configFilePath = path.join(process.cwd(), fileName)
		if (fs.existsSync(configFilePath)) {
			throw new MongogratorError(`${fileName} already initialized`)
		}
		fs.writeFileSync(configFilePath, configTemplates[extension])
		MongogratorLogger.logInfo(`Config file created at ${configFilePath}`)
	}
}
