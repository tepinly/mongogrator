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
		name: 'help',
		description: 'Display the list of available commands',
		detailed: 'Display the list of available commands',
	},
	{
		name: 'version',
		description: 'Display the current version of Mongogrator',
		detailed:
			'Display the current version of Mongogrator. This may differ depending on whether you have it installed locally or running it via npx',
	},
	{
		name: 'init',
		options: '--js',
		description: 'Initialize config file',
		detailed:
			'Initialize config file. It may be initialized in either ts or js format by adding --js option at the end of the command',
	},
	{
		name: 'add [name]',
		description: 'Adds a new migration file',
		detailed:
			'Adds a new migration file. The migration file is configured and created in the path relative to the config file. And it can be configured to be either js or ts as well',
	},
	{
		name: 'list',
		description: 'Display the list of all migrations and their status',
		detailed:
			'Displays the list all the migrations under the configured path. Both js & ts. each will have a status of either "MIGRATED" if it has been migrated or "NOT MIGRATED" if it hasn\'t been yet',
	},
	{
		name: 'migrate [path]',
		description: 'Run the migrations',
		detailed:
			'Runs all the migrations in the configured path, ones that have been already migrated will be ignored. Additionally, path can be added as an option at the end to specify a built directory for production purposes',
	},
]

export const optionList = [
	{
		name: '--js, -j',
		description: 'Flag the file creation to be in js',
	},
	{
		name: '--help, -h',
		description: 'Add at the end of every command to get detailed help on it',
	},
	{
		name: '--version, -v',
		description: 'Display the current version of Mongogrator',
	},
]
