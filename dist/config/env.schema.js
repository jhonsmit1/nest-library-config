"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.string().default("3000"),
    CORS_ALLOWED_ORIGINS: zod_1.z
        .string()
        .optional()
        .describe("Comma-separated list of allowed CORS origins")
        .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.string().default("3000"),
    DB_USER: zod_1.z.string(),
    DB_PASSWORD: zod_1.z.string(),
    DB_NAME: zod_1.z.string(),
    DB_MAX_CONNECTIONS: zod_1.z
        .string()
        .default("20")
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number())
        .describe("Maximum number of connections in the PostgreSQL pool"),
    TEST_DB_HOST: zod_1.z.string(),
    TEST_DB_PORT: zod_1.z.string(),
    TEST_DB_USER: zod_1.z.string(),
    TEST_DB_PASSWORD: zod_1.z.string(),
    TEST_DB_NAME: zod_1.z.string(),
    AZURE_SQL_SERVER: zod_1.z.string().describe("Azure SQL Server hostname"),
    AZURE_SQL_DATABASE: zod_1.z.string().describe("Azure SQL Database name"),
    AZURE_SQL_USER: zod_1.z.string().describe("Azure SQL Database username"),
    AZURE_SQL_PASSWORD: zod_1.z.string().describe("Azure SQL Database password"),
    AZURE_SQL_PORT: zod_1.z
        .string()
        .default("1433")
        .describe("Azure SQL Database port"),
    AZURE_SQL_ENCRYPT: zod_1.z
        .string()
        .default("true")
        .describe("Enable encryption for Azure SQL connection"),
    AZURE_SQL_TRUST_SERVER_CERTIFICATE: zod_1.z
        .string()
        .default("false")
        .describe("Trust server certificate for Azure SQL"),
    RUN_MIGRATIONS: zod_1.z
        .string()
        .default("false")
        .describe("Run database migrations on startup"),
});
