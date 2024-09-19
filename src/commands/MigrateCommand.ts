import fs from 'node:fs'
import path from 'node:path'
import { MongoClient } from 'mongodb'
import { ConfigurationHandler } from '../config/ConfigurationHandler'
import type { CommandConfig, ICommandStrategy } from './ICommandStrategy'

export class MigrateCommand implements ICommandStrategy {
	static triggers = ['migrate']

	async execute() {
		const config = await new ConfigurationHandler().readConfig()
		const client = new MongoClient(config.url)

		const functionsPath = path.join(process.cwd(), config.migrationsPath)
		const files = fs.readdirSync(functionsPath)

		await client.connect()
		const db = client.db(config.database)
		const migrationsCollection = db.collection(config.logsCollectionName)
		for (const file of files) {
			const fileName = file.split('.')[0]

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
}
