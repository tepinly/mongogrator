#!/usr/bin/env node

import path from 'node:path'
import packageJson from '../package.json'
import { commandList, optionList } from './helpers'
import {
	addMigration,
	initConfig,
	listMigrations,
	runMigrations,
} from './service'

const commandPath = process.cwd()
const args = process.argv.slice(2)
const argument = args[0]

const configNameTs = 'mongogrator.config.ts'
const configNameJs = 'mongogrator.config.js'

const decriptionWidth = 25
const commandWidth = 16

const processor = async () => {
	if (args[1] && ['--help', '-h'].includes(args[1].toLowerCase())) {
		const command = commandList.find((command) => command.name === argument)
		return console.log(`\n${command?.name}:\n\n${command?.detailed}\n`)
	}

	try {
		switch (argument) {
			case 'init':
				if (args.length > 1 && args[1] === '--js') {
					await initConfig(commandPath, configNameJs)
					break
				}
				await initConfig(commandPath, configNameTs)
				break
			case 'add':
				await addMigration(commandPath, args[1])
				break
			case 'list':
				await listMigrations(commandPath)
				break
			case 'migrate':
				if (args.length > 1) {
					await runMigrations(path.join(commandPath, args[1]))
					break
				}
				await runMigrations(commandPath)
				break
			case 'version':
			case '--version':
			case '-v':
				{
					console.log(`Mongogrator v${packageJson.version}`)
				}
				break
			default: {
				console.log(
					'\nMongogrator is a lightweight database migration package for MongoDB\n',
				)
				console.log('Commands:')
				for (const command of commandList) {
					const options = command.options ? `${command.options}` : ''
					console.log(
						(''.padEnd(2) + command.name.padEnd(commandWidth) + options).padEnd(
							decriptionWidth,
						) + command.description,
					)
				}
				console.log('\nOptions:')
				for (const option of optionList) {
					console.log(
						''.padEnd(2) + option.name.padEnd(20) + option.description,
					)
				}
				console.log('')
			}
		}
	} catch (err) {
		console.error(err)
	}
}

processor()
