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
			'Display the current version of Mongogrator\n\
      This may differ depending on whether you have it installed or running it via npx',
	},
	{
		name: 'init',
		options: '--js',
		description: 'Initialize config file',
		detailed:
			'Initialize config file\n\
      May be initialized in either ts or js format by adding --js option at the end of the command',
	},
	{
		name: 'add',
		variables: '[name]',
		description: 'Adds a new migration file',
		detailed:
			'Adds a new migration file\n\
      The file is configured and created in the path relative to the config file\n\
      It can be configured to be either js or ts',
	},
	{
		name: 'list',
		description: 'Display the list of all migrations and their status',
		detailed:
			'Displays the list all the migrations under the configured path, both js & ts\n\
      Each migrations will have a status of either "MIGRATED" if it has been migrated or "NOT MIGRATED" if it hasn\'t been yet',
	},
	{
		name: 'migrate',
		variables: '[path]',
		description: 'Run the migrations',
		detailed:
			'Runs the command within the same location as the config file\n\
      Migrations that have already been executed previously are ignored\n\
      Path can be directly passed at the end of the command to determine the relative location of the config file\n\
      The location of the "migrations" folder is determined through the config file',
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
