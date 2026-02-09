import { DynamicModule } from "@nestjs/common";
import { DatabaseModuleOptions } from "./database.options";
export declare class DatabaseModule {
    static forRoot(options?: DatabaseModuleOptions): DynamicModule;
}
