export interface TransactionManager {
    runInTransaction<T>(fn: (trx?: any) => Promise<T>): Promise<T>;
}
