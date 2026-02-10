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
const database_metrics_facade_1 = require("../observability/database-metrics.facade");
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static forRoot(options) {
        const providers = [];
        const exports = [];
        if (options.postgres) {
            providers.push({
                provide: postgres_service_1.PostgresService,
                useFactory: (config, metrics) => {
                    return new postgres_service_1.PostgresService(config, metrics, options.schema);
                },
                inject: [app_config_service_1.AppConfigService, database_metrics_facade_1.DatabaseMetricsFacade],
            });
            exports.push(postgres_service_1.PostgresService);
        }
        if (options.azureSql) {
            providers.push(azure_sql_service_1.AzureSqlService);
            exports.push(azure_sql_service_1.AzureSqlService);
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
