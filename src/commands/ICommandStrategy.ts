export type CommandConfig = {
	args: string[]
	flags: {
		[key: string]: string | boolean
	}
}

export interface ICommandStrategy {
	execute(config: CommandConfig): Promise<void>
}
