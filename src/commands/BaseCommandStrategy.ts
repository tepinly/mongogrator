export type CommandOptions = {
	args: string[]
	flags: { [key: string]: string | boolean }
}

export abstract class BaseCommandStrategy {
	static triggers: string[]
	static description: string

	abstract detailedDescription: string
	abstract execute(): Promise<void>

	constructor(protected readonly commandOptions: CommandOptions) {}

	protected handleHelpFlag() {
		if (this.commandOptions.flags.help || this.commandOptions.flags.h) {
			console.log(this.detailedDescription)
			process.exit(0)
		}
	}
}
