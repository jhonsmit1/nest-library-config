import { z } from "zod";

export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.string().default("3000"),

    // CORS
    CORS_ALLOWED_ORIGINS: z
        .string()
        .optional()
        .describe("Comma-separated list of allowed CORS origins")
        .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),



    // Database connection details used when running the server normally
    DB_HOST: z.string(),
    DB_PORT: z.string().default("3000"),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
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
        .describe("Azure SQL Database port"),
    AZURE_SQL_ENCRYPT: z
        .string()
        .default("true")
        .describe("Enable encryption for Azure SQL connection"),
    AZURE_SQL_TRUST_SERVER_CERTIFICATE: z
        .string()
        .default("false")
        .describe("Trust server certificate for Azure SQL"),

    RUN_MIGRATIONS: z
        .string()
        .default("false")
        .describe("Run database migrations on startup"),

});

export type EnvConfig = z.infer<typeof envSchema>;
