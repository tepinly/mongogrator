import { ConfigurationHandler } from '../config/ConfigurationHandler'
import { CONFIG_JS_FILE_NAME, CONFIG_TS_FILE_NAME } from '../config/config'
import type { CommandConfig, ICommandStrategy } from './ICommandStrategy'

export class InitCommand implements ICommandStrategy {
	static triggers = ['init']

	async execute(c: CommandConfig): Promise<void> {
		const configFileName = c.flags.js
			? CONFIG_JS_FILE_NAME
			: CONFIG_TS_FILE_NAME
		await ConfigurationHandler.initConfig(configFileName)
	}
}
