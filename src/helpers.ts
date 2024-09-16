import fs from 'node:fs'
import path from 'node:path'
import { register } from 'ts-node'
import { compilerOptions } from '../tsconfig.json'

export const findConfig = async (commandPath: string) => {
	const configName = 'mongogrator.config'
	register({ compilerOptions })

	const configPathTs = path.join(commandPath, `${configName}.ts`)
	if (fs.existsSync(configPathTs)) {
		return (await import(configPathTs)).default
	}

	const configPathJs = path.join(commandPath, `${configName}.js`)
	if (fs.existsSync(configPathJs)) {
		return (await import(configPathJs)).default
	}

	throw `${configName} file not found`
}

export const commandList = [
	{
		command: 'help',
		description: 'Display the list of available commands',
	},
	{
		command: 'version',
		description: 'Display the current version of Mongogrator',
	},
	{
		command: 'init',
		options: '--js',
		description: 'Initialize config file',
	},
	{
		command: 'add [name]',
		description:
			'Add a new migration under the specified path in the config file',
	},
	{
		command: 'list',
		description:
			'Display the list of migrations and their status [NOT MIGRATED, MIGRATED]',
	},
	{
		command: 'migrate [path]',
		description: 'Run the migrations',
	},
]
