import { DynamicModule } from "@nestjs/common";
import { DatabaseModuleOptions } from "./database.options";
export declare class DatabaseModule {
    static forRoot<TSchema extends Record<string, unknown>>(options: DatabaseModuleOptions & {
        schema?: TSchema;
    }): DynamicModule;
}
