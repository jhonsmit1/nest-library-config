"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z
        .string()
        .default("3000")
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number()),
    CORS_ALLOWED_ORIGINS: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.string()
        .default("3000")
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number()),
    DB_USER: zod_1.z.string(),
    DB_PASSWORD: zod_1.z.string(),
    DB_NAME: zod_1.z.string(),
    USE_SSL: zod_1.z
        .string()
        .default("false")
        .transform((val) => val === "true"),
    DB_MAX_CONNECTIONS: zod_1.z
        .string()
        .default("20")
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number()),
    RUN_MIGRATIONS: zod_1.z
        .string()
        .default("false")
        .transform((val) => val === "true"),
    TEST_DB_HOST: zod_1.z.string(),
    TEST_DB_PORT: zod_1.z.string(),
    TEST_DB_USER: zod_1.z.string(),
    TEST_DB_PASSWORD: zod_1.z.string(),
    TEST_DB_NAME: zod_1.z.string(),
    AZURE_SQL_SERVER: zod_1.z.string(),
    AZURE_SQL_DATABASE: zod_1.z.string(),
    AZURE_SQL_USER: zod_1.z.string(),
    AZURE_SQL_PASSWORD: zod_1.z.string(),
    AZURE_SQL_PORT: zod_1.z
        .string()
        .default("1433")
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number()),
    AZURE_SQL_ENCRYPT: zod_1.z
        .string()
        .default("true")
        .transform((val) => val === "true"),
    AZURE_SQL_TRUST_SERVER_CERTIFICATE: zod_1.z
        .string()
        .default("false")
        .transform((val) => val === "true"),
    DOCUMENT_BASE_URL: zod_1.z.string().min(1),
    SENDGRID_API_KEY: zod_1.z.string().min(1),
    CLAIMS_TRACKER_BASE_URL: zod_1.z.string(),
    CLAIMS_TRACKER_USERNAME: zod_1.z.string(),
    CLAIMS_TRACKER_PASSWORD: zod_1.z.string(),
    CLAIMS_TRACKER_USER_ID: zod_1.z.string(),
    CONNECT_SERVICE_APP_URL: zod_1.z.string(),
    CONNECT_SERVICE_APP_API_KEY: zod_1.z.string(),
    FRAUD_SCAN_API_KEY: zod_1.z.string(),
    FRAUD_SCAN_URL: zod_1.z.string(),
    LOW_FRAUD_SCORE_LIMIT: zod_1.z
        .string()
        .transform((val) => Number(val)),
    MEDIUM_FRAUD_SCORE_LIMIT: zod_1.z
        .string()
        .transform((val) => Number(val)),
    PIQE_ENDPOINT: zod_1.z.string().min(1),
    PIQE_EMAIL: zod_1.z.string(),
    PIQE_PASSWORD: zod_1.z.string(),
    HELIOS_API_ENDPOINT: zod_1.z.string().url(),
    HELIOS_API_KEY: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    NEW_AUTHENTICATION: zod_1.z
        .string()
        .default("false")
        .transform((val) => val === "true"),
    SIC_COGNITO_USER_POOL_ID: zod_1.z.string(),
    HELIOS_WEB_COGNITO_USER_POOL_ID: zod_1.z.string(),
    VIRTUAL_INSPECTION_APP_ORIGIN: zod_1.z.string(),
    BEDROCK_ACCESS_KEY_ID: zod_1.z.string(),
    BEDROCK_SECRET_ACCESS_KEY: zod_1.z.string(),
    BEDROCK_REGION: zod_1.z.string(),
    REKOGNITION_ACCESS_KEY_ID: zod_1.z.string(),
    REKOGNITION_SECRET_ACCESS_KEY: zod_1.z.string(),
    REKOGNITION_REGION: zod_1.z.string(),
    TEXTRACT_ACCESS_KEY_ID: zod_1.z.string(),
    TEXTRACT_SECRET_ACCESS_KEY: zod_1.z.string(),
    TEXTRACT_REGION: zod_1.z.string(),
    S3_ACCESS_KEY_ID: zod_1.z.string(),
    S3_SECRET_ACCESS_KEY: zod_1.z.string(),
    S3_REGION: zod_1.z.string(),
    S3_BUCKET_NAME: zod_1.z.string(),
    AUTOMATIC_OFFER_PAYMENT_THRESHOLD: zod_1.z
        .string()
        .default("1000")
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number()),
    OTEL_SERVICE_NAME: zod_1.z.string().default("cpe-api"),
    OTEL_SERVICE_VERSION: zod_1.z.string().default("1.0.0"),
    OTEL_EXPORTER_OTLP_ENDPOINT: zod_1.z.string().optional(),
    OTEL_TRACES_EXPORTER: zod_1.z.string().default("otlp"),
    OTEL_METRICS_EXPORTER: zod_1.z.string().default("prometheus"),
    OTEL_TRACES_SAMPLER: zod_1.z.string().default("parentbased_traceidratio"),
    OTEL_TRACES_SAMPLER_ARG: zod_1.z.string().default("1.0"),
    LOG_LEVEL: zod_1.z
        .enum(["error", "warn", "info", "http", "verbose", "debug", "silly"])
        .default("debug"),
    LOKI_ENDPOINT: zod_1.z.string().optional(),
    LOKI_USERNAME: zod_1.z.string().optional(),
    LOKI_PASSWORD: zod_1.z.string().optional(),
    AWS_REGION: zod_1.z.string().optional(),
    CLOUDWATCH_LOG_GROUP: zod_1.z.string().optional(),
    CLOUDWATCH_LOG_STREAM: zod_1.z.string().optional(),
    PROMETHEUS_PORT: zod_1.z
        .string()
        .default("9464")
        .transform((val) => parseInt(val, 10))
        .pipe(zod_1.z.number()),
    PROMETHEUS_PATH: zod_1.z.string().default("/metrics"),
    CATALOGS_CACHE_REFRESH_INTERVAL_MS: zod_1.z
        .string()
        .optional()
        .default("3600000")
        .transform((val) => parseInt(val, 10)),
});
