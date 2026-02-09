import { Injectable, OnModuleInit } from "@nestjs/common";
import { metrics, Meter } from "@opentelemetry/api";

@Injectable()
export class CustomMetricsService implements OnModuleInit {
    private meter?: Meter;
    private dbQueryDurationSeconds?: any;

    async onModuleInit() {
        try {
            this.meter = metrics.getMeter("database-lib", "1.0.0");
            this.initializeMetrics();
        } catch {
            // OpenTelemetry not available
            this.meter = undefined;
        }
    }

    private initializeMetrics() {
        if (!this.meter) return;

        this.dbQueryDurationSeconds = this.meter.createHistogram(
            "db_query_duration_seconds",
            {
                description: "Database query duration in seconds",
                unit: "s",
            }
        );
    }

    recordDbQuery(
        dbSystem: "postgresql" | "mssql",
        operation: string,
        durationSeconds: number,
        dbName?: string
    ): void {
        if (!this.dbQueryDurationSeconds) return;

        const attributes: Record<string, string> = {
            db_system: dbSystem,
            db_operation: operation,
        };

        if (dbName) {
            attributes.db_name = dbName;
        }

        this.dbQueryDurationSeconds.record(durationSeconds, attributes);
    }
}
