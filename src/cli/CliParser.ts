import type { CommandOptions } from '../commands/BaseCommandStrategy'

export class CliParser {
	private command
	private args: CommandOptions['args']
	private flags: CommandOptions['flags']

	constructor(argv: typeof process.argv) {
		this.command = argv[2] ?? ''
		this.args = argv.slice(3).filter((arg) => !arg.startsWith('--'))
		this.flags = Object.fromEntries(
			argv
				.filter((arg) => arg.startsWith('-'))
				.map((flag) => {
					const [key, value = true] = flag.split('=')
					return [key.startsWith('--') ? key.slice(2) : key.slice(1), value]
				}),
		)
	}

	public get commandName(): string {
		return this.command
	}

	public get commandOptions(): CommandOptions {
		return {
			args: this.args,
			flags: this.flags,
		}
	}
}
