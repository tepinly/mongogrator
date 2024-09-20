export class MongogratorError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'MongogratorError'
	}
}
