<p align="center">
  <img src="/assets/mongogrator.png" alt="Mongogrator" />
</p>

Mongogrator is a lightweight database migration package for MongoDB. 

The original purpose of the package is to utilize a config file based on `.ts` format to allow importing values and assign them to the config keys.

## Dependencies

Since Mongogrator is mainly a CLI based package, it relies on the following dependencies

- typescript
- ts-node
- mongodb

## Setup

Mongogrator comes with its own CLI. You can either install it globally

```bash
npm install -g mongogrator

mongogrator init
```

Or use it directly by adding npx prefix before every command

```bash
npx mongogrator init #--js
```

The `init` command spawns the `mongogrator.config.ts` file. You can also pass a `--js` option to generate the config file in js format instead

## List of commands

```bash
Commands:
help                      Display the list of available commands
version                   Display the current version of Mongogrator
init              --js    Initialize config file
add [name]                Add a new migration
list                      Display the list of migrations and their status
migrate [path]            Run the migrations

Options:
  --js     Used to generate files in js format (ts is the default)
```

## Usage guide

A basic guide on how to use the package

### Adding new migrations

Start by adding a new migration file with the desired name

```bash
mongogrator add insert_user
```

This will create the migration file under the directory assigned in the config `migrationsPath`

> [!NOTE]
> - The default migrations directory is `./migrations`
> - The default migrations file format is `ts` (typescript)

```ts
import type { Db } from 'mongodb'

export const migrate = async (_db: Db): Promise<void> => {
	// Migration code here
}
```

The migrations are executed through the native MongoDB Node.js driver

### Migration query example

```ts
import type { Db } from 'mongodb'

export const migrate = async (_db: Db): Promise<void> => {
	_db.collection('users').insertOne({ name: 'Alex' })
}
```

### Migrations list

You can add as many migrations as you want and then the list command to display the status of each

```bash
mongogrator list
```

This will print out a list of all the migrations, each of them has the status of either `NOT MIGRATED` or `MIGRATED`

```bash
1726339397_add_user           NOT MIGRATED
```

Naturally, the status will be `NOT MIGRATED` as we haven't run the migration yet

### Running the migrations

Run the migrations simply by calling

```
mongogrator migrate
```

This will run all the migrations and log them to the database under the specified collection name in the config `logsCollectionName`

For production migrations that are built in a different directory, simply add the directory path at the end of the command

```
mongogrator migrate /dist
```

Now if you run the `list` command again, it will reveal that the file migration has completed

```bash
1726339397_add_user           MIGRATED
```

### Logs collection schema

```ts
{
  _id: objectId(),
  name: string,
  createdAt: Date(),
  updatedAt: Date()
}
```

Each migration log is created with the `createdAt` date assigned before running the migration, and `updatedAt` date is assigned after the migration is completed

## Configuration

```ts
{
{
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Database name for which the migrations will be executed
	migrationsPath: './migrations', // Migrations directory relative to the location of the commands
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
	format: 'ts', // Format type of the migration files ['ts', 'js']
}
```

> [!IMPORTANT]
> all path values are relative to the location from which the command was called
