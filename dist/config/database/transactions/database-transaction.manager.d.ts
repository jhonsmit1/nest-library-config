import { DatabaseClient } from "../database.client";
import { TransactionManager } from "./transaction-manager.interface";
export declare class DatabaseTransactionManager implements TransactionManager {
    private readonly azure?;
    private readonly postgres?;
    constructor(azure?: DatabaseClient | undefined, postgres?: DatabaseClient | undefined);
    runInTransaction<T>(fn: () => Promise<T>): Promise<T>;
}
