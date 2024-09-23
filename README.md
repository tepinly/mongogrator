<p align="center">
  <img src="https://github.com/user-attachments/assets/103be6a4-d02c-473a-b95b-39fd6a84d8a8" alt="Mongogrator" />
</p>

Mongogrator is a very fast database migration CLI for MongoDB. Its purpose is to easily create and run migrations for development and production stages

## Installing

Using the following command, it will automatically download, install and add Mongogrator to `PATH`

### MacOS/Linux

```bash
curl -fsSL git.new/mongogrator-installer.sh | bash
```

### Windows

```powershell
powershell -c "irm git.new/mongogrator-installer.ps1 | iex"
```

## List of commands

```sh
Mongogrator CLI
Usage: mongogrator <command> [options]

Commands:
   init [--js]               Initialize a new configuration file
   add                       Creates a new migration file with the provided name
   list                      List all migrations and their status
   migrate [config_path]     Run all migrations that have not been applied yet
   version, -v, --version    Prints the current version of Mongogrator

Flags:
   --help, -h                Prints the detailed description of the command
```

## Usage guide

A basic guide on how to use the CLI

### Adding new migrations

Start by initializing the config file

```sh
mongogrator init
```

This initializes a `mongogrator.config.ts` file in the location of the command. You can optionally pass a `--js` flag at the end of the command to initialize in a js file

Setup the `url` to the desired mongo cluster, and make sure it's running

```sh
mongogrator add insert_user
```

This will create the migration file under the directory key assigned in the config `migrationsPath`

The following is an example of a newly created ts migration file

```ts
import type { Db } from 'mongodb'

/**
 * This function is called when the migration is run.
 * @param _db The mongodb database object that's passed to the migration
 */
export const migrate = async (_db: Db): Promise<void> => {
  // Migration code here
}
```

The migrations are executed through the native MongoDB Node.js driver

### Migration query example

```ts
import type { Db } from 'mongodb'

/**
 * This function is called when the migration is run.
 * @param _db The mongodb database object that's passed to the migration
 */
export const migrate = async (_db: Db): Promise<void> => {
  // Migration code here
  _db.collection('users').insertOne({ name: 'Alex' })
}
```

### Migrations list

You can add as many migrations as you want and then call the `list` command to display the status of each

```sh
mongogrator list
```

This will print out a list of all the migrations, each has a status of either `NOT MIGRATED` or `MIGRATED`

```sh
┌───┬───────────────────────────────┬──────────────┐
│   │ migration                     │ status       │
├───┼───────────────────────────────┼──────────────┤
│ 0 │ 20240923150201806_insert_user │ NOT MIGRATED │
└───┴───────────────────────────────┴──────────────┘
```

Naturally, the status will be `NOT MIGRATED` as we haven't run the migration yet

### Running the migrations

Run the migrations simply by calling

```sh
mongogrator migrate
```

This will run all the migrations and log them to the database under the specified collection name in the config `logsCollectionName`

For production purposes, you can pass the config path to the `migrate` command directly if it's not accessible under the same path

```sh
mongogrator migrate /dist
```

Now if you run the `list` command again, it will reveal that the migration file has been successfully executed

```sh
┌───┬───────────────────────────────┬──────────────┐
│   │ migration                     │ status       │
├───┼───────────────────────────────┼──────────────┤
│ 0 │ 20240923150201806_insert_user │ MIGRATED     │
└───┴───────────────────────────────┴──────────────┘
```

### Logs collection schema

```ts
{
  _id: objectId(),
  name: string,
  createdAt: Date(),
}
```

## Configuration

```ts
{
  url: 'mongodb://localhost:27017', // Cluster url
  database: 'test', // Database name for which the migrations will be executed
  migrationsPath: './migrations', // Migrations directory relative to the location of the commands
  logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
  format: 'ts', // Format type of the migration files ['ts', 'js']
}
```

> [!IMPORTANT]
> all the config keys with path values are relative to the location of the config file itself
