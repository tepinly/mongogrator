import { z } from 'zod'

export const CONFIG_FILE_NAME = 'mongogrator.config'
export const CONFIG_TS_FILE_NAME = `${CONFIG_FILE_NAME}.ts`
export const CONFIG_JS_FILE_NAME = `${CONFIG_FILE_NAME}.js`

export enum ConfigFormat {
	js = 'js',
	ts = 'ts',
}

export type TMongogratorConfig = {
	url: string
	database: string
	migrationsPath: string
	logsCollectionName: string
	format: ConfigFormat
}

export const mongogratorConfigSchema = z.object({
	url: z.string().url(), // Validates the cluster URL
	database: z.string(), // Database name
	migrationsPath: z.string(), // Migrations directory path
	logsCollectionName: z.string(), // Logs collection name
	format: z.nativeEnum(ConfigFormat), // Format must be either 'ts' or 'js'
})
