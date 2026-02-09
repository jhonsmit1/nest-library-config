import { NodePgDatabase } from "drizzle-orm/node-postgres";
export type DrizzleDb<TSchema extends Record<string, unknown> = Record<string, unknown>> = NodePgDatabase<TSchema>;
