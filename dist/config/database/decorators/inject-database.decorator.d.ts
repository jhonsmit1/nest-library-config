export type DatabaseEngine = "postgres" | "azure";
export declare function InjectDatabase(engine: DatabaseEngine): PropertyDecorator & ParameterDecorator;
