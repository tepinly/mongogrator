import { CommandExecutor } from './commands/CommandExecutor'
import { MongogratorLogger } from './loggers/MongogratorLogger'
;(async () => {
	await new CommandExecutor(process.argv).executeCommand().catch((err) => {
		MongogratorLogger.logError(err)
		process.exit(1)
	})
})()
