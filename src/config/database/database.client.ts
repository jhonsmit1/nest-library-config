export interface DatabaseClient {

    withTransaction<T>(
        fn: (tx: unknown) => Promise<T>
    ): Promise<T>;
}
