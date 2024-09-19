import type { ICommandStrategy } from './ICommandStrategy'

export class HelpCommand implements ICommandStrategy {
	static triggers = ['help', '-h', '--help']

	async execute(): Promise<void> {
		// TODO: Fix help command
		// TODO: add static property for each command with description and detailedDescription
		// TODO: add printHelp method to each command
		console.log(`
        Usage: 
            - init: Create a new configuration file
            - add: Add a new migration
            - list: List all migrations
            - migrate: Run all pending migrations
        `)
	}
}
