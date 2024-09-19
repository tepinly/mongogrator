import type { CommandConfig } from '../commands/ICommandStrategy'

export class CliParser {
	private command = ''
	private args: CommandConfig['args'] = []
	private flags: CommandConfig['flags'] = {}

	constructor(argv: typeof process.argv) {
		this.command = argv[2]
		this.args = argv.slice(3).filter((arg) => !arg.startsWith('--'))
		this.flags = argv.reduce(
			(acc, arg) => {
				if (arg.startsWith('--')) {
					const [key, value] = arg.split('=')
					acc[key.slice(2)] = value ?? true
				} else if (arg.startsWith('-')) {
					acc[arg.slice(1)] = true
				}
				return acc
			},
			{} as CliParser['flags'],
		)
	}

	public get commandName(): string {
		return this.command
	}

	public get commandConfig(): CommandConfig {
		return {
			args: this.args,
			flags: this.flags,
		}
	}
}
