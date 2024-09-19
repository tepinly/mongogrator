import { CliParser } from '../cli/CliParser'
import { AddCommand } from './AddCommand'
import { HelpCommand } from './HelpCommand'
import type { CommandConfig, ICommandStrategy } from './ICommandStrategy'
import { InitCommand } from './InitCommand'
import { ListCommand } from './ListCommand'
import { MigrateCommand } from './MigrateCommand'
import { VersionCommand } from './VersionCommand'

export class CommandExecutor {
	private readonly commandName: string
	private readonly commandConfig: CommandConfig

	private readonly commandsList = [
		InitCommand,
		AddCommand,
		ListCommand,
		MigrateCommand,
		VersionCommand,
		HelpCommand,
	] as const

	private commandMap: Record<string, new () => ICommandStrategy> = {}

	constructor(argv: typeof process.argv) {
		const cliParser = new CliParser(argv)
		this.commandName = cliParser.commandName
		this.commandConfig = cliParser.commandConfig
		for (const command of this.commandsList) {
			for (const trigger of command.triggers) {
				this.commandMap[trigger] = command
			}
		}
	}

	public async executeCommand() {
		const chosenCommand = this.commandMap[this.commandName] ?? HelpCommand
		await new chosenCommand().execute(this.commandConfig)
	}
}
