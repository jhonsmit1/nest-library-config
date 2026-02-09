import { OnModuleInit } from "@nestjs/common";
export declare class CustomMetricsService implements OnModuleInit {
    private meter?;
    private dbQueryDurationSeconds?;
    onModuleInit(): Promise<void>;
    private initializeMetrics;
    recordDbQuery(dbSystem: "postgresql" | "mssql", operation: string, durationSeconds: number, dbName?: string): void;
}
