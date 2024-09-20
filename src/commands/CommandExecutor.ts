import { CliParser } from '../cli/CliParser'
import { AddCommand } from './AddCommand'
import { InitCommand } from './InitCommand'
import { ListCommand } from './ListCommand'
import { MigrateCommand } from './MigrateCommand'
import { VersionCommand } from './VersionCommand'

type TCommand = CommandExecutor['commandsList'][number]
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
		const command = this.commandMap[this.commandName]
		this.handlePrintHelp(command)
		await new command(this.commandOptions).execute()
	}

	private handlePrintHelp(chosenCommand?: TCommand) {
		// if the commandName is found and the help flag is present, print the detailed description
		const { flags } = this.commandOptions
		const isHelpFlagPresent = flags.help || flags.h
		if (chosenCommand && isHelpFlagPresent) {
			console.log(chosenCommand.detailedDescription)
			process.exit(0)
		}
		// if the commandName is not found, print the general help message
		if (!chosenCommand) {
			console.log('Mongogrator CLI')
			console.log('Usage: mongogrator <command> [options]')
			console.log('\nCommands:')
			const PADDING = 30
			const printHelp = ({ triggers, args, flags, description }: TCommand) =>
				console.log(
					`${triggers.join(', ')} ${args.join(', ')}${flags.join(', ')}`.padEnd(
						PADDING,
					),
					`${description}`,
				)
			this.commandsList.forEach(printHelp)
			console.log('\nFlags:')
			console.log(
				'--help, -h'.padEnd(PADDING),
				'Prints the detailed description of the command',
			)
			process.exit(0)
		}
	}
}
