const mongogratorConfig = {
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Database name for which the migrations will be executed
	migrationsPath: './migrations', // Migrations directory relative to the location of the commands
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
	buildPath: '../dist', // Production build directory relative to the location of the commands
	format: 'ts', // Format of the config file & migrations ['ts', 'js']
}

exports.default(mongogratorConfig)
