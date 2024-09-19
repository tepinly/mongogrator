import fs from 'node:fs'
import path from 'node:path'
import { MongoClient } from 'mongodb'
import { ConfigurationHandler } from '../config/ConfigurationHandler'
import type { ICommandStrategy } from './ICommandStrategy'

export class MigrateCommand implements ICommandStrategy {
	static triggers = ['migrate']

	async execute() {
		const config = await ConfigurationHandler.readConfig()
		// TODO: separate the mongo db connection logic into a database module
		const client = new MongoClient(config.url)

		const functionsPath = path.join(process.cwd(), config.migrationsPath)
		const files = fs.readdirSync(functionsPath)

		await client.connect()
		const db = client.db(config.database)
		// TODO: separate the migrations collection logic into a database module
		const migrationsCollection = db.collection(config.logsCollectionName)
		for (const file of files) {
			const fileName = file.split('.')[0]

			// TODO: Move this logic into a separate module
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

			// TODO: Move this logic into a separate module
			await migrationsCollection.insertOne({
				name: fileName,
				createdAt,
				updatedAt,
			})
		}
		client.close()
	}
}
