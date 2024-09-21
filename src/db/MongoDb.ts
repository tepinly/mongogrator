import { type Collection, type Db, MongoClient } from 'mongodb'
import type { TMongogratorConfig } from '../config/config'
import type { TMigration } from './MigrationsService'

export class Client {
	client: MongoClient
	db: Db
	collection: Collection<TMigration>
	constructor(config: TMongogratorConfig) {
		this.client = new MongoClient(config.url)
		this.db = this.client.db(config.database)
		this.collection = this.db.collection(config.logsCollectionName)
	}

	public run = async (
		fn: (
			clientArgs: { db: Db; collection: Collection<TMigration> },
			...args: any[]
		) => Promise<any>,
		...args: any[]
	) => {
		try {
			await this.client.connect()
			const result = await fn(
				{ db: this.db, collection: this.collection },
				...args,
			)
			return result
		} finally {
			await this.client.close()
		}
	}
}
