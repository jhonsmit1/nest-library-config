import {
  DynamicModule,
  Global,
  Module,
  Provider,
} from "@nestjs/common";
import { APP_CONFIG_OPTIONS } from "./app-config.constants";
import { AppConfigService } from "./app-config.service";
import { AppConfigModuleOptions } from "./app-config.interfaces";

@Global()
@Module({})
export class AppConfigModule {
  static forRoot(options: AppConfigModuleOptions = {}): DynamicModule {
    const optionsProvider: Provider = {
      provide: APP_CONFIG_OPTIONS,
      useValue: options,
    };

    return {
      module: AppConfigModule,
      providers: [optionsProvider, AppConfigService],
      exports: [AppConfigService],
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) =>
      | Promise<AppConfigModuleOptions>
      | AppConfigModuleOptions;
    inject?: any[];
  }): DynamicModule {
    const optionsProvider: Provider = {
      provide: APP_CONFIG_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject ?? [],
    };

    return {
      module: AppConfigModule,
      providers: [optionsProvider, AppConfigService],
      exports: [AppConfigService],
    };
  }
}
