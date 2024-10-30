import { CommandExecutor } from './commands/CommandExecutor';
import { MongogratorLogger } from './loggers/MongogratorLogger';

// IIFE (Immediately Invoked Function Expression) to execute the command
(async () => {
  const start = Date.now(); // Record the start time

  try {
    // Execute the command with the provided arguments
    await new CommandExecutor(process.argv).executeCommand();
  } catch (err) {
    // Log the error and exit the process with an error code
    MongogratorLogger.logError(err);
    process.exit(1);
  }

  const end = Date.now(); // Record the end time
  MongogratorLogger.logInfo(`Execution took: ${(end - start).toFixed(0)} ms`);
})();
