import fs from 'node:fs'
import path from 'node:path'
import type { Collection } from 'mongodb'
import { MongogratorError } from '../errors/MongogratorError'

export type TMigration = {
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

	public static getMigrations(pathArray: string[]) {
		const migrationsPath = path.join(...pathArray)
		MigrationsService.throwWhenNoMigrationsDirFound(migrationsPath)
		return fs.readdirSync(migrationsPath).sort()
	}

	private static throwWhenNoMigrationsDirFound(dirPath: string) {
		if (!fs.existsSync(dirPath)) {
			throw new MongogratorError('No migrations directory found. Try to "add" migrations first.')
		}
	}
}
