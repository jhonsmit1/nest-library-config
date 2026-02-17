import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { DatabaseModuleOptions } from "./database.options";
import { PostgresService } from "./postgres/postgres.service";
import { AzureSqlService } from "./azure-sql/azure-sql.service";
import { DATABASE_CLIENT } from "./database.tokens";
import { DATABASE_SCHEMA } from "./database.schema.token";

@Global()
@Module({})
export class DatabaseModule {
  static forRoot<TSchema extends Record<string, unknown>>(
    options: DatabaseModuleOptions & { schema?: TSchema }
  ): DynamicModule {

    const providers: Provider[] = [];

    if (options.postgres) {
      providers.push(
        {
          provide: DATABASE_SCHEMA,
          useValue: options.schema,
        },
        PostgresService,
        {
          provide: DATABASE_CLIENT,
          useExisting: PostgresService,
        }
      );
    }

    if (options.azureSql) {
      providers.push(
        AzureSqlService,
        {
          provide: DATABASE_CLIENT,
          useExisting: AzureSqlService,
        }
      );
    }

    return {
      module: DatabaseModule,
      providers,
      exports: [DATABASE_CLIENT],
    };
  }
}
