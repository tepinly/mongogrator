import fs from 'node:fs'
import path from 'node:path'
import { MongoClient } from 'mongodb'
import { findConfig } from './helpers'

export const initConfig = async (sourcePath: string, configName: string) => {
	const filePath = path.join(sourcePath, configName)
	if (fs.existsSync(filePath)) {
		throw `${configName} already initialized`
	}
	const configPath = path.join(__dirname, '../assets/', configName)
	fs.copyFileSync(configPath, filePath)
	console.log(`Config file created at ${filePath}`)
}

export const addMigration = async (
	sourcePath: string,
	fileName: string,
) => {
	const config = await findConfig(sourcePath)
	if (
		!(
			fs.existsSync(config.migrationsPath) &&
			fs.statSync(config.migrationsPath).isDirectory()
		)
	) {
		fs.mkdirSync(config.migrationsPath)
	}

	const timestamp = Math.ceil(new Date().getTime() / 1000)
	const filePath = path.join(
		sourcePath,
		`${config.migrationsPath}/${timestamp}_${fileName}.${config.format}`,
	)

	const templatePath = path.join(
		__dirname,
		`../assets/template.${config.format}`,
	)
	fs.copyFileSync(templatePath, filePath)
	console.log(`Migration created at ${filePath}`)
}

export const listMigrations = async (sourcePath: string) => {
	{
		const config = await findConfig(sourcePath).catch((err) => {
			throw err
		})
		const client = new MongoClient(config.url)
		const fileNameWidth = 30

		const functionsPath = path.join(sourcePath, config.migrationsPath)
		const files = fs.readdirSync(functionsPath)

		await client.connect()
		const db = client.db(config.database)
		for (const file of files) {
			const fileName = file.split('.')[0]
			const migrationsCollection = db.collection(config.logsCollectionName)

			const migrationExists = await migrationsCollection.findOne({
				name: fileName,
			})
			const list = migrationExists ? 'MIGRATED' : 'NOT MIGRATED'
			console.log(fileName.padEnd(fileNameWidth) + list)
		}
		await client.close()
	}
}

export const runMigrations = async (sourcePath: string) => {
	const config = await findConfig(sourcePath).catch((err) => {
		throw err
	})
	const client = new MongoClient(config.url)

	const functionsPath = path.join(sourcePath, config.migrationsPath)
	const files = fs.readdirSync(functionsPath)

	await client.connect()
	const db = client.db(config.database)
	for (const file of files) {
		const fileName = file.split('.')[0]
		const migrationsCollection = db.collection(config.logsCollectionName)

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
