#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { MongoClient } from 'mongodb'
import { register } from 'ts-node'
import packageJson from '../package.json'
import { compilerOptions } from '../tsconfig.json'

const args = process.argv.slice(2)
const argument = args[0]
const commandPath = process.cwd()
const configName = 'mongogrator.config.ts'
const commandList = [
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
		command: 'migrate',
		description: 'Run the migrations',
	},
]

const findConfig = async () => {
	register({ compilerOptions })
	const configPath = path.join(commandPath, configName)

	if (!fs.existsSync(configPath)) {
		throw `${configName} not found`
	}

	return (await import(configPath)).default
}

const processor = async () => {
	try {
		switch (argument) {
			case 'init':
				try {
					const filePath = path.join(commandPath, configName)
					if (fs.existsSync(filePath)) {
						throw `${configName} already initialized`
					}
					const configPath = path.join(__dirname, '../assets/', configName)
					fs.copyFileSync(configPath, filePath)
					console.log(`Config file created at ${filePath}`)
				} catch (err) {
					console.error(err)
				}
				break
			case 'add':
				{
					if (args.length < 2) {
						console.error('Incorrect format: mongogrator add [name]')
						process.exit(1)
					}
					const config = await findConfig()
					if (
						!(
							fs.existsSync(config.migrationsPath) &&
							fs.statSync(config.migrationsPath).isDirectory()
						)
					) {
						fs.mkdirSync(config.migrationsPath)
					}

					const commandPath = process.cwd()
					const fileName = args[1]
					const timestamp = Math.ceil(new Date().getTime() / 1000)
					const filePath = path.join(
						commandPath,
						`${config.migrationsPath}/${timestamp}_${fileName}.ts`,
					)

					const templatePath = path.join(__dirname, '../assets/template.ts')
					fs.copyFileSync(templatePath, filePath)
					console.log(`Migration created at ${filePath}`)
				}
				break
			case 'list':
				{
					const config = await findConfig().catch((err) => {
						throw console.error(err)
					})
					const client = new MongoClient(config.url)
					const fileNameWidth = 30

					const functionsPath = path.join(commandPath, config.migrationsPath)
					const files = fs.readdirSync(functionsPath)

					await client.connect()
					const db = client.db(config.database)
					for (const file of files) {
						const fileName = file.split('.')[0]
						const migrationsCollection = db.collection(
							config.logsCollectionName,
						)

						const migrationExists = await migrationsCollection.findOne({
							name: fileName,
						})
						const list = migrationExists ? 'MIGRATED' : 'NOT MIGRATED'
						console.log(fileName.padEnd(fileNameWidth) + list)
					}
					await client.close()
				}
				break
			case 'migrate':
				{
					const config = await findConfig().catch((err) => {
						throw console.error(err)
					})
					const client = new MongoClient(config.url)

					const functionsPath = path.join(commandPath, config.migrationsPath)
					const files = fs.readdirSync(functionsPath)

					await client.connect()
					const db = client.db(config.database)
					for (const file of files) {
						const fileName = file.split('.')[0]
						const migrationsCollection = db.collection(
							config.logsCollectionName,
						)

						const migrationExists = await migrationsCollection.findOne({
							name: fileName,
						})
						if (migrationExists) {
							continue
						}

						const createdAt = new Date()
						await import(path.join(functionsPath, file)).then(({ migrate }) =>
							migrate(db),
						)
						const updatedAt = new Date()

						await migrationsCollection.insertOne({
							name: fileName,
							createdAt,
							updatedAt,
						})
					}
					client.close()
				}
				break
			case 'version':
				{
					console.log(`Mongogrator v${packageJson.version}`)
				}
				break
			default: {
				const commandWidth = 15
				console.log(
					'\nMongogrator is a lightweight typescript-based package for MongoDB database migrations\n',
				)
				console.log('Commands:')

				for (const row of commandList) {
					console.log(row.command.padEnd(commandWidth) + row.description)
				}
				console.log('')
			}
		}
	} catch (err) {
		console.error(err)
	}
}

processor()
