import packageJson from '../../package.json'
import { MongogratorLogger } from '../loggers/MongogratorLogger'
import type { ICommandStrategy } from './ICommandStrategy'

export class VersionCommand implements ICommandStrategy {
	static triggers = ['version', '-v', '--version']

	async execute() {
		MongogratorLogger.logInfo(`version: ${packageJson.version}`)
	}
}
