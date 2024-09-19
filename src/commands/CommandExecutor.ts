import { CliParser } from '../cli/CliParser'
import { AddCommand } from './AddCommand'
import { HelpCommand } from './HelpCommand'
import type { CommandConfig } from './ICommandStrategy'
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
	]

	private readonly commandMap = new Map(
		this.commandsList.flatMap((cmd) =>
			cmd.triggers.map((trigger) => [trigger, cmd]),
		),
	)

	constructor(argv: typeof process.argv) {
		const cliParser = new CliParser(argv)
		this.commandName = cliParser.commandName
		this.commandConfig = cliParser.commandConfig
	}

	public async executeCommand() {
		const chosenCommand = this.commandMap.get(this.commandName) ?? HelpCommand
		await new chosenCommand().execute(this.commandConfig)
	}
}
