import { DynamicModule } from "@nestjs/common";
import { AppConfigModuleOptions } from "./app-config.interfaces";
export declare class AppConfigModule {
    static forRoot(options?: AppConfigModuleOptions): DynamicModule;
    static forRootAsync(options: {
        useFactory: (...args: any[]) => Promise<AppConfigModuleOptions> | AppConfigModuleOptions;
        inject?: any[];
    }): DynamicModule;
}
