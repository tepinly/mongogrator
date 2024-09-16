#!/usr/bin/env node

import path from 'node:path'
import packageJson from '../package.json'
import { commandList } from './helpers'
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

const processor = async () => {
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
				{
					console.log(`Mongogrator v${packageJson.version}`)
				}
				break
			default: {
				const decriptionWidth = 35
				const commandWidth = 18
				console.log(
					'\nMongogrator is a lightweight typescript-based package for MongoDB database migrations\n',
				)
				console.log('Commands:')
				for (const row of commandList) {
					const options = row.options ? `options: ${row.options}` : ''
					console.log(
						(row.command.padEnd(commandWidth) + options).padEnd(
							decriptionWidth,
						) + row.description,
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
