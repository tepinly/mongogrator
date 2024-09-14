"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const migratorConfig = {
    url: 'mongodb://admin:password@localhost:27030/?authSource=admin',
    database: 'test',
    migrationsPath: './migrations',
    logsCollectionName: 'migrations',
};
exports.default = migratorConfig;
