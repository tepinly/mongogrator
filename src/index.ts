import { CommandExecutor } from './commands/CommandExecutor'
import { MongogratorLogger } from './loggers/MongogratorLogger'
;(async () => {
	const start = Date.now()
	await new CommandExecutor(process.argv).executeCommand().catch((err) => {
		MongogratorLogger.logError(err)
		process.exit(1)
	})
	const end = Date.now()
	MongogratorLogger.logInfo(`Took: ${(end - start).toFixed(0)} ms`)
})()
