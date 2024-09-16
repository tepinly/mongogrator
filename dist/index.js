#!/usr/bin/env node
"use strict";
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
const node_path_1 = __importDefault(require("node:path"));
const package_json_1 = __importDefault(require("../package.json"));
const helpers_1 = require("./helpers");
const service_1 = require("./service");
const commandPath = process.cwd();
const args = process.argv.slice(2);
const argument = args[0];
const configNameTs = 'mongogrator.config.ts';
const configNameJs = 'mongogrator.config.js';
const processor = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        switch (argument) {
            case 'init':
                if (args.length > 1 && args[1] === '--js') {
                    yield (0, service_1.initConfig)(commandPath, configNameJs);
                    break;
                }
                yield (0, service_1.initConfig)(commandPath, configNameTs);
                break;
            case 'add':
                yield (0, service_1.addMigration)(commandPath, args[1]);
                break;
            case 'list':
                yield (0, service_1.listMigrations)(commandPath);
                break;
            case 'migrate':
                if (args.length > 1) {
                    yield (0, service_1.runMigrations)(node_path_1.default.join(commandPath, args[1]));
                    break;
                }
                yield (0, service_1.runMigrations)(commandPath);
                break;
            case 'version':
                {
                    console.log(`Mongogrator v${package_json_1.default.version}`);
                }
                break;
            default: {
                const decriptionWidth = 35;
                const commandWidth = 18;
                console.log('\nMongogrator is a lightweight typescript-based package for MongoDB database migrations\n');
                console.log('Commands:');
                for (const row of helpers_1.commandList) {
                    const options = row.options ? `options: ${row.options}` : '';
                    console.log((row.command.padEnd(commandWidth) + options).padEnd(decriptionWidth) + row.description);
                }
                console.log('');
            }
        }
    }
    catch (err) {
        console.error(err);
    }
});
processor();
