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
const app_config_service_1 = require("../app/app-config.service");
const database_tokens_1 = require("./database.tokens");
const database_metrics_token_1 = require("./database.metrics.token");
const noop_database_metrics_1 = require("./noop-database-metrics");
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static forRoot(options) {
        const providers = [
            {
                provide: database_metrics_token_1.DATABASE_METRICS,
                useClass: noop_database_metrics_1.NoopDatabaseMetrics,
            },
        ];
        if (options.postgres) {
            providers.push({
                provide: postgres_service_1.PostgresService,
                useFactory: (config, metrics) => {
                    return new postgres_service_1.PostgresService(config, metrics, options.schema);
                },
                inject: [app_config_service_1.AppConfigService, database_metrics_token_1.DATABASE_METRICS],
            }, {
                provide: database_tokens_1.DATABASE_CLIENT,
                useExisting: postgres_service_1.PostgresService,
            });
        }
        if (options.azureSql) {
            providers.push(azure_sql_service_1.AzureSqlService, {
                provide: database_tokens_1.DATABASE_CLIENT,
                useExisting: azure_sql_service_1.AzureSqlService,
            });
        }
        return {
            module: DatabaseModule_1,
            providers,
            exports: [database_tokens_1.DATABASE_CLIENT],
        };
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = DatabaseModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], DatabaseModule);
