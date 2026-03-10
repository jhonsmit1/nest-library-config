import { Inject } from "@nestjs/common";
import { POSTGRES_DRIZZLE, AZURE_SQL_KNEX } from "../database.tokens";

export type DatabaseEngine = "postgres" | "azure";

export function InjectDatabase(engine: DatabaseEngine) {

    switch (engine) {

        case "postgres":
            return Inject(POSTGRES_DRIZZLE);

        case "azure":
            return Inject(AZURE_SQL_KNEX);

        default:
            throw new Error(`Unsupported database engine: ${engine}`);

    }

}
