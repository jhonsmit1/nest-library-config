import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { DatabaseModuleOptions } from "./database.options";
import { PostgresService } from "./postgres/postgres.service";
import { AzureSqlService } from "./azure-sql/azure-sql.service";

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions = {}): DynamicModule {
    const providers: Provider[] = [];
    const exports: Provider[] = [];

    if (options.postgres) {
      providers.push(PostgresService);
      exports.push(PostgresService);
    }

    if (options.azureSql) {
      providers.push(AzureSqlService);
      exports.push(AzureSqlService);
    }

    return {
      module: DatabaseModule,
      providers,
      exports,
    };
  }
}
