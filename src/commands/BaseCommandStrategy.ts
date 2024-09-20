export type CommandOptions = {
	args: string[]
	flags: { [key: string]: string | boolean }
}

export abstract class BaseCommandStrategy {
	static triggers: string[]
	static flags: string[] = []
	static args: string[] = []
	static description: string
	static detailedDescription: string

	constructor(protected readonly commandOptions: CommandOptions) {}

	abstract execute(): Promise<void>
}
