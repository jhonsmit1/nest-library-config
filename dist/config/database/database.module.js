"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const postgres_service_1 = require("./postgres/postgres.service");
const azure_sql_service_1 = require("./azure-sql/azure-sql.service");
const database_schema_token_1 = require("./database.schema.token");
const database_tokens_1 = require("./database.tokens");
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static forRoot(options) {
        const providers = [];
        const exports = [];
        if (options.metricsProvider) {
            providers.push(options.metricsProvider);
        }
        if (options.postgres) {
            providers.push({
                provide: database_schema_token_1.DATABASE_SCHEMA,
                useValue: options.schema,
            }, postgres_service_1.PostgresService, {
                provide: database_tokens_1.POSTGRES_DB,
                useExisting: postgres_service_1.PostgresService,
            });
            exports.push(database_tokens_1.POSTGRES_DB, postgres_service_1.PostgresService);
        }
        if (options.azureSql) {
            providers.push(azure_sql_service_1.AzureSqlService, {
                provide: database_tokens_1.AZURE_SQL_DB,
                useExisting: azure_sql_service_1.AzureSqlService,
            });
            exports.push(database_tokens_1.AZURE_SQL_DB, azure_sql_service_1.AzureSqlService);
        }
        return {
            module: DatabaseModule_1,
            providers,
            exports,
        };
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = DatabaseModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], DatabaseModule);
