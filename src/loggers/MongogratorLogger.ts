import { MongogratorError } from '../errors/MongogratorError'

export namespace MongogratorLogger {
	const prefixLog = (level: string) =>
		`[Mongogrator:${new Date().toISOString()}:${level}]`

	export function logInfo(...values: unknown[]) {
		console.log(prefixLog('info'), ...values)
	}

	export function logError(error: Error): void
	export function logError(message: string): void
	export function logError(errorOrMessage: Error | string) {
		if (errorOrMessage instanceof Error) {
			console.error(
				prefixLog('error'),
				errorOrMessage.name,
				errorOrMessage.message,
			)
		} else {
			console.error(prefixLog('error'), errorOrMessage)
		}
	}
}
