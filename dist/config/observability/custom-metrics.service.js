"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMetricsService = void 0;
const common_1 = require("@nestjs/common");
const api_1 = require("@opentelemetry/api");
let CustomMetricsService = class CustomMetricsService {
    meter;
    dbQueryDurationSeconds;
    async onModuleInit() {
        try {
            this.meter = api_1.metrics.getMeter("database-lib", "1.0.0");
            this.initializeMetrics();
        }
        catch {
            this.meter = undefined;
        }
    }
    initializeMetrics() {
        if (!this.meter)
            return;
        this.dbQueryDurationSeconds = this.meter.createHistogram("db_query_duration_seconds", {
            description: "Database query duration in seconds",
            unit: "s",
        });
    }
    recordDbQuery(dbSystem, operation, durationSeconds, dbName) {
        if (!this.dbQueryDurationSeconds)
            return;
        const attributes = {
            db_system: dbSystem,
            db_operation: operation,
        };
        if (dbName) {
            attributes.db_name = dbName;
        }
        this.dbQueryDurationSeconds.record(durationSeconds, attributes);
    }
};
exports.CustomMetricsService = CustomMetricsService;
exports.CustomMetricsService = CustomMetricsService = __decorate([
    (0, common_1.Injectable)()
], CustomMetricsService);
