import fs from 'node:fs'
import path from 'node:path'
import { MongoClient } from 'mongodb'
import { ConfigurationHandler } from '../config/ConfigurationHandler'
import type { CommandConfig, ICommandStrategy } from './ICommandStrategy'

export class ListCommand implements ICommandStrategy {
	static triggers = ['list']

	async execute() {
		const config = await ConfigurationHandler.readConfig()
		const client = new MongoClient(config.url)
		const fileNameWidth = 30

		const migrationsPath = path.join(process.cwd(), config.migrationsPath)
		const files = fs.readdirSync(migrationsPath)

		await client.connect()
		const db = client.db(config.database)
		const migrationsCollection = db.collection(config.logsCollectionName)
		for (const file of files) {
			// TODO: Fix this because it will not work with files that have multiple dots
			const fileName = file.split('.')[0]

			// TODO: Move this logic into a separate module
			// TODO: Optimize this by using a single query to get all migrations
			const migrationExists = await migrationsCollection.findOne({
				name: fileName,
			})
			const list = migrationExists ? 'MIGRATED' : 'NOT MIGRATED'
			console.log(fileName.padEnd(fileNameWidth) + list)
		}
		await client.close()
	}
}
