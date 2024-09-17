const mongogratorConfig = {
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Database name for which the migrations will be executed
	migrationsPath: './migrations', // Migrations directory relative to the location of the commands
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
	format: 'ts', // Format type of the migration files ['ts', 'js']
}

exports.default(mongogratorConfig)
