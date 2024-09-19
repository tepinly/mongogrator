import { CliParser } from '../cli/CliParser'
import { AddCommand } from './AddCommand'
import { InitCommand } from './InitCommand'
import { ListCommand } from './ListCommand'
import { MigrateCommand } from './MigrateCommand'
import { VersionCommand } from './VersionCommand'

export class CommandExecutor {
	private commandName
	private commandOptions

	private commandsList = [
		InitCommand,
		AddCommand,
		ListCommand,
		MigrateCommand,
		VersionCommand,
	] as const

	private commandMap = Object.fromEntries(
		this.commandsList.flatMap((cmd) =>
			cmd.triggers.map((trigger) => [trigger, cmd]),
		),
	)

	constructor(argv: typeof process.argv) {
		const { commandName, commandOptions } = new CliParser(argv)
		this.commandName = commandName
		this.commandOptions = commandOptions
	}

	public async executeCommand() {
		const command = this.commandMap[this.commandName] ?? this.printHelpAndExit()
		await new command(this.commandOptions).execute()
	}

	private printHelp(cmd: (typeof this.commandsList)[number]) {
		console.log(`${cmd.triggers.join(', ').padEnd(25)} ${cmd.description}`)
	}

	private printHelpAndExit(): never {
		console.log(
			'Mongogrator is a lightweight database migration package for MongoDB.\n',
		)
		this.commandsList.forEach(this.printHelp)
		process.exit(0)
	}
}
