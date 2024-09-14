<p align="center">
  <img src="/assets/mongogrator.png" alt="Mongogrator" />
</p>

Mongogrator is a lightweight typescript-based package for MongoDB database migrations. 

The original purpose of the package is to utilize a config file based on `.ts` format to allow importing values and assign them to the config keys.

## Peer dependencies

The following dependencies are required in order to use Mongogrator

- typescript
- mongodb
- ts-node

## Setup

Mongogrator comes with its own CLI. You can either install it globally

```bash
npm install -g mongogrator

mongogrator init
```

Or use it directly by adding npx prefix before every command

```bash
npx mongogrator init
```

The `init` command spawns the `mongogrator.config.ts` file

## List of commands

```bash
help           Display the list of available commands
version        Display the current Mongogrator version
init           Initialize config file
add [name]     Add a new migration under the specified path in the config file
list           Display the list of migrations and their status [NOT MIGRATED, MIGRATED]
migrate        Run the migrations
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
> The default migrations directory is `./migrations`,
> more on that in the configuration section

```ts
import { type Db } from 'mongodb'

export const migrate = async (_db: Db): Promise<void> => {
	// Migration code here
}
```

The migrations are executed through the native MongoDB Node.js driver

### Migration query example

```ts
import { type Db } from 'mongodb'

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
const mongogratorConfig = {
	url: 'mongodb://localhost:27017', // Cluster url
	database: 'test', // Database name for which the migrations will be executed
	migrationsPath: './migrations', // Relative directory to the location of the commands
	logsCollectionName: 'migrations', // Name of the logs collection that will be stored in the database
}
```
