import { ConfigurationHandler } from '../config/ConfigurationHandler'
import { CONFIG_JS_FILE_NAME, CONFIG_TS_FILE_NAME } from '../config/config'
import { BaseCommandStrategy } from './BaseCommandStrategy'

export class InitCommand extends BaseCommandStrategy {
	static triggers = ['init']
	static description = 'Initialize a new configuration file'
	public detailedDescription = `
		Creates a new configuration file for Mongogrator in the current working directory.
		By default creates a TypeScript configuration file (${CONFIG_TS_FILE_NAME}).
		Add the --js flag to create a JavaScript configuration file (${CONFIG_JS_FILE_NAME}).
		`

	async execute(): Promise<void> {
		this.handleHelpFlag()
		const configFileName = this.commandOptions.flags.js
			? CONFIG_JS_FILE_NAME
			: CONFIG_TS_FILE_NAME
		await ConfigurationHandler.initConfig(configFileName)
	}
}
