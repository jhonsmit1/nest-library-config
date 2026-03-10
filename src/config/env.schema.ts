import { z } from "zod";

export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z
        .string()
        .default("3000")
        .transform((val) => parseInt(val, 10))
        .pipe(z.number()),

    // CORS
    CORS_ALLOWED_ORIGINS: z
        .string()
        .optional()
        .describe("Comma-separated list of allowed CORS origins")
        .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),



    // Database connection details used when running the server normally
    DB_HOST: z.string(),
    DB_PORT: z.string()
        .default("3000")
        .transform((val) => parseInt(val, 10))
        .pipe(z.number()),

    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    USE_SSL: z
        .string()
        .default("false")
        .transform((val) => val === "true")
        .describe("Enable SSL for PostgreSQL connection"),
    DB_MAX_CONNECTIONS: z
        .string()
        .default("20")
        .transform((val) => parseInt(val, 10))
        .pipe(z.number())
        .describe("Maximum number of connections in the PostgreSQL pool"),

    // Test DB variables are only used when running tests when the environment is "test"
    TEST_DB_HOST: z.string(),
    TEST_DB_PORT: z.string(),
    TEST_DB_USER: z.string(),
    TEST_DB_PASSWORD: z.string(),
    TEST_DB_NAME: z.string(),

    // Azure SQL Database connection (for Knex.js)
    AZURE_SQL_SERVER: z.string().describe("Azure SQL Server hostname"),
    AZURE_SQL_DATABASE: z.string().describe("Azure SQL Database name"),
    AZURE_SQL_USER: z.string().describe("Azure SQL Database username"),
    AZURE_SQL_PASSWORD: z.string().describe("Azure SQL Database password"),
    AZURE_SQL_PORT: z
        .string()
        .default("1433")
        .transform((val) => parseInt(val, 10))
        .pipe(z.number()),
    AZURE_SQL_ENCRYPT: z
        .string()
        .default("true")
        .transform((val) => val === "true"),
    AZURE_SQL_TRUST_SERVER_CERTIFICATE: z
        .string()
        .default("false")
        .describe("Trust server certificate for Azure SQL"),

    RUN_MIGRATIONS: z
        .string()
        .default("false")
        .describe("Run database migrations on startup"),

    HELIOS_API_KEY: z
        .string()
        .describe("The key used to authenticate incoming requests from Helios API"),

    // Loki Configuration
    LOKI_ENDPOINT: z.string().optional().describe("Loki endpoint for logs"),
    LOKI_USERNAME: z.string().optional().describe("Loki username"),
    LOKI_PASSWORD: z.string().optional().describe("Loki password"),

    // CloudWatch Configuration
    AWS_REGION: z.string().optional().describe("AWS region for CloudWatch"),
    CLOUDWATCH_LOG_GROUP: z
        .string()
        .optional()
        .describe("CloudWatch log group name"),
    CLOUDWATCH_LOG_STREAM: z
        .string()
        .optional()
        .describe("CloudWatch log stream name"),

    LOG_LEVEL: z
        .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
        .default("debug"),

    SIC_COGNITO_USER_POOL_ID: z
        .string()
        .describe("The Cognito User Pool ID for the SIC application"),
    HELIOS_WEB_COGNITO_USER_POOL_ID: z
        .string()
        .describe("The Cognito User Pool ID for the Helios web application"),


});

export type EnvConfig = z.infer<typeof envSchema>;
