import { Inject, Injectable } from "@nestjs/common";
import { DatabaseClient } from "../database.client";
import { AZURE_SQL_DB, POSTGRES_DB } from "../database.tokens";
import { TransactionManager } from "./transaction-manager.interface";

@Injectable()
export class DatabaseTransactionManager implements TransactionManager {

    constructor(
        @Inject(AZURE_SQL_DB)
        private readonly azure?: DatabaseClient,

        @Inject(POSTGRES_DB)
        private readonly postgres?: DatabaseClient
    ) { }

    async runInTransaction<T>(
        fn: (trx?: any) => Promise<T>
    ): Promise<T> {

        if (this.azure) {
            return this.azure.withTransaction(async (trx) => {
                return fn(trx);
            });
        }

        if (this.postgres) {
            return this.postgres.withTransaction(async (trx) => {
                return fn(trx);
            });
        }

        throw new Error("No database client available for transactions");

    }


}
