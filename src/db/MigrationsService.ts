import type { Collection } from 'mongodb'

type TMigration = {
	name: string
	createdAt: Date
}

export class MigrationsService {
	constructor(private readonly collection: Collection<TMigration>) {}

	public async getAppliedSet() {
		return new Set(
			(
				await this.collection
					.find({}, { projection: { name: 1, _id: 0 } })
					.toArray()
			).map((m) => m.name),
		)
	}

	public async insertApplied(migrationName: string) {
		return this.collection.insertOne({
			name: migrationName,
			createdAt: new Date(),
		})
	}
}
