#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mongodb_1 = require("mongodb");
const ts_node_1 = require("ts-node");
const package_json_1 = __importDefault(require("./package.json"));
const args = process.argv.slice(2);
const argument = args[0];
const commandPath = process.cwd();
const configName = '../assets/mongogrator.config.ts';
const commandList = [
    {
        command: 'help',
        description: 'Display the list of available commands',
    },
    {
        command: 'version',
        description: 'Display the current version of Mongogrator',
    },
    {
        command: 'init',
        description: 'Initialize config file',
    },
    {
        command: 'add [name]',
        description: 'Add a new migration under the specified path in the config file',
    },
    {
        command: 'list',
        description: 'Display the list of migrations and their status [NOT MIGRATED, MIGRATED]',
    },
    {
        command: 'migrate',
        description: 'Run the migrations',
    },
];
const findConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, ts_node_1.register)();
    const configPath = path_1.default.join(commandPath, configName);
    if (!fs_1.default.existsSync(configPath)) {
        console.error(`${configName} not found`);
    }
    const config = yield Promise.resolve(`${configPath}`).then(s => __importStar(require(s))).then((mongogratorConfig) => mongogratorConfig.default)
        .catch((err) => {
        console.error(`Error importing ${configName}:`, err);
    });
    return config;
});
const processor = () => __awaiter(void 0, void 0, void 0, function* () {
    switch (argument) {
        case 'init':
            {
                const filePath = path_1.default.join(commandPath, `./${configName}`);
                const templatePath = path_1.default.join(__dirname, `../${configName}`);
                fs_1.default.copyFileSync(templatePath, filePath);
                console.log(`Config file created at ${filePath}`);
            }
            break;
        case 'add':
            {
                if (args.length < 2) {
                    console.error('Incorrect format: mongogrator add [name]');
                    process.exit(1);
                }
                const config = yield findConfig();
                if (!(fs_1.default.existsSync(config.migrationsPath) &&
                    fs_1.default.statSync(config.migrationsPath).isDirectory())) {
                    fs_1.default.mkdirSync(config.migrationsPath);
                }
                const commandPath = process.cwd();
                const fileName = args[1];
                const timestamp = Math.ceil(new Date().getTime() / 1000);
                const filePath = path_1.default.join(commandPath, `${config.migrationsPath}/${timestamp}_${fileName}.ts`);
                const templatePath = path_1.default.join(__dirname, '../assets/template.ts');
                fs_1.default.copyFileSync(templatePath, filePath);
                console.log(`Migration created at ${filePath}`);
            }
            break;
        case 'list':
            {
                const config = yield findConfig();
                const client = new mongodb_1.MongoClient(config.url);
                const fileNameWidth = 30;
                const functionsPath = path_1.default.join(commandPath, config.migrationsPath);
                const files = fs_1.default.readdirSync(functionsPath);
                yield client.connect();
                const db = client.db(config.database);
                for (const file of files) {
                    const fileName = file.split('.')[0];
                    const migrationsCollection = db.collection(config.logsCollectionName);
                    const migrationExists = yield migrationsCollection.findOne({
                        name: fileName,
                    });
                    const list = migrationExists ? 'MIGRATED' : 'NOT MIGRATED';
                    console.log(fileName.padEnd(fileNameWidth) + list);
                }
                yield client.close();
            }
            break;
        case 'migrate':
            {
                const config = yield findConfig();
                const client = new mongodb_1.MongoClient(config.url);
                const functionsPath = path_1.default.join(commandPath, config.migrationsPath);
                const files = fs_1.default.readdirSync(functionsPath);
                yield client.connect();
                const db = client.db(config.database);
                for (const file of files) {
                    const fileName = file.split('.')[0];
                    const migrationsCollection = db.collection(config.logsCollectionName);
                    const migrationExists = yield migrationsCollection.findOne({
                        name: fileName,
                    });
                    if (migrationExists) {
                        continue;
                    }
                    const createdAt = new Date();
                    yield Promise.resolve(`${path_1.default.join(functionsPath, file)}`).then(s => __importStar(require(s))).then(({ migrate }) => migrate(db));
                    const updatedAt = new Date();
                    yield migrationsCollection.insertOne({
                        name: fileName,
                        createdAt,
                        updatedAt,
                    });
                }
                client.close();
            }
            break;
        case 'version':
            {
                console.log(`Mongogrator v${package_json_1.default.version}`);
            }
            break;
        default: {
            const commandWidth = 15;
            console.log('\nMongogrator is a lightweight typescript-based package for MongoDB database migrations\n');
            console.log('Commands:');
            for (const row of commandList) {
                console.log(row.command.padEnd(commandWidth) + row.description);
            }
            console.log('');
        }
    }
});
processor();
