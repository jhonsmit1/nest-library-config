import { Global, Module, DynamicModule } from "@nestjs/common";
import { AppConfigService } from "./app-config.service";

@Global()
@Module({})
export class AppConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: AppConfigModule,
      providers: [AppConfigService],
      exports: [AppConfigService],
    };
  }
}
