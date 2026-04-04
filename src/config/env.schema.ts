import { z } from "zod";

export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z
        .string()
        .default("3000")
        .transform((val) => parseInt(val, 10))
        .pipe(z.number()),

    /* ===========================
     * CORS
     * =========================== */
    CORS_ALLOWED_ORIGINS: z
        .string()
        .optional()
        .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),

    /* ===========================
     * DATABASE (POSTGRES)
     * =========================== */
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
        .transform((val) => val === "true"),

    DB_MAX_CONNECTIONS: z
        .string()
        .default("20")
        .transform((val) => parseInt(val, 10))
        .pipe(z.number()),

    RUN_MIGRATIONS: z
        .string()
        .default("false")
        .transform((val) => val === "true"),

    /* ===========================
    * TEST DB
    * =========================== */
    TEST_DB_HOST: z.string(),
    TEST_DB_PORT: z.string(),
    TEST_DB_USER: z.string(),
    TEST_DB_PASSWORD: z.string(),
    TEST_DB_NAME: z.string(),


    /* ===========================
     * AZURE SQL
     * =========================== */
    AZURE_SQL_SERVER: z.string(),
    AZURE_SQL_DATABASE: z.string(),
    AZURE_SQL_USER: z.string(),
    AZURE_SQL_PASSWORD: z.string(),
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
        .transform((val) => val === "true"),



    /* ===========================
     * EXTERNAL SERVICES
     * =========================== */
    DOCUMENT_BASE_URL: z.string().min(1),
    SENDGRID_API_KEY: z.string().min(1),

    /* ===========================
     * CLAIMS TRACKER
     * =========================== */
    CLAIMS_TRACKER_BASE_URL: z.string(),
    CLAIMS_TRACKER_USERNAME: z.string(),
    CLAIMS_TRACKER_PASSWORD: z.string(),
    CLAIMS_TRACKER_USER_ID: z.string(),


    /* ===========================
    * CONNECT SERVICE
    * =========================== */
    CONNECT_SERVICE_APP_URL: z.string(),
    CONNECT_SERVICE_APP_API_KEY: z.string(),

    /* ===========================
     * FRAUD
     * =========================== */
    FRAUD_SCAN_API_KEY: z.string(),
    FRAUD_SCAN_URL: z.string(),

    LOW_FRAUD_SCORE_LIMIT: z
        .string()
        .transform((val) => Number(val)),

    MEDIUM_FRAUD_SCORE_LIMIT: z
        .string()
        .transform((val) => Number(val)),

    /* ===========================
    * PIQE
    * =========================== */
    PIQE_ENDPOINT: z.string().min(1),
    PIQE_EMAIL: z.string(),
    PIQE_PASSWORD: z.string(),

    /* ===========================
     * HELIOS
     * =========================== */
    HELIOS_API_ENDPOINT: z.string().url(),
    HELIOS_API_KEY: z.string(),

    /* ===========================
     * AUTH
     * =========================== */
    JWT_SECRET: z.string(),

    NEW_AUTHENTICATION: z
        .string()
        .default("false")
        .transform((val) => val === "true"),

    SIC_COGNITO_USER_POOL_ID: z.string(),
    HELIOS_WEB_COGNITO_USER_POOL_ID: z.string(),
    VIRTUAL_INSPECTION_APP_ORIGIN: z.string(),

    /* ===========================
      * AWS (MULTI-SERVICE)
      * =========================== */

    // Bedrock
    BEDROCK_ACCESS_KEY_ID: z.string(),
    BEDROCK_SECRET_ACCESS_KEY: z.string(),
    BEDROCK_REGION: z.string(),

    // Rekognition
    REKOGNITION_ACCESS_KEY_ID: z.string(),
    REKOGNITION_SECRET_ACCESS_KEY: z.string(),
    REKOGNITION_REGION: z.string(),

    // Textract
    TEXTRACT_ACCESS_KEY_ID: z.string(),
    TEXTRACT_SECRET_ACCESS_KEY: z.string(),
    TEXTRACT_REGION: z.string(),

    // S3
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_REGION: z.string(),
    S3_BUCKET_NAME: z.string(),

    /* ===========================
     * BUSINESS RULES
     * =========================== */
    AUTOMATIC_OFFER_PAYMENT_THRESHOLD: z
        .string()
        .default("1000")
        .transform((val) => parseInt(val, 10))
        .pipe(z.number()),

    /* ===========================
     * OBSERVABILITY (OTEL)
     * =========================== */
    OTEL_SERVICE_NAME: z.string().default("cpe-api"),
    OTEL_SERVICE_VERSION: z.string().default("1.0.0"),
    OTEL_EXPORTER_OTLP_ENDPOINT: z.string().optional(),
    OTEL_TRACES_EXPORTER: z.string().default("otlp"),
    OTEL_METRICS_EXPORTER: z.string().default("prometheus"),
    OTEL_TRACES_SAMPLER: z.string().default("parentbased_traceidratio"),
    OTEL_TRACES_SAMPLER_ARG: z.string().default("1.0"),

    /* ===========================
     * LOGGING
     * =========================== */
    LOG_LEVEL: z
        .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
        .default("debug"),
    LOKI_ENDPOINT: z.string().optional(),
    LOKI_USERNAME: z.string().optional(),
    LOKI_PASSWORD: z.string().optional(),
    AWS_REGION: z.string().optional(),
    CLOUDWATCH_LOG_GROUP: z.string().optional(),
    CLOUDWATCH_LOG_STREAM: z.string().optional(),


    /* ===========================
     * PROMETHEUS
     * =========================== */
    PROMETHEUS_PORT: z
        .string()
        .default("9464")
        .transform((val) => parseInt(val, 10))
        .pipe(z.number()),

    PROMETHEUS_PATH: z.string().default("/metrics"),

    /* ===========================
    * CACHE
    * =========================== */
    CATALOGS_CACHE_REFRESH_INTERVAL_MS: z
        .string()
        .optional()
        .default("3600000")
        .transform((val) => parseInt(val, 10)),

});

export type EnvConfig = z.infer<typeof envSchema>;
