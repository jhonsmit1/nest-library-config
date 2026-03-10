import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { DatabaseModuleOptions } from "./database.options";
import { PostgresService } from "./postgres/postgres.service";
import { AzureSqlService } from "./azure-sql/azure-sql.service";
import { DATABASE_SCHEMA } from "./database.schema.token";
import { POSTGRES_DB, AZURE_SQL_DB } from "./database.tokens";

@Global()
@Module({})
export class DatabaseModule {
  static forRoot<TSchema extends Record<string, unknown>>(
    options: DatabaseModuleOptions & {
      schema?: TSchema;
      metricsProvider?: Provider;
    }
  ): DynamicModule {

    const providers: Provider[] = [];

    /**
     * Metrics provider opcional
     */
    if (options.metricsProvider) {
      providers.push(options.metricsProvider);
    }

    /**
     * POSTGRES
     */
    if (options.postgres) {

      providers.push(
        {
          provide: DATABASE_SCHEMA,
          useValue: options.schema,
        },

        PostgresService,

        {
          provide: POSTGRES_DB,
          useExisting: PostgresService,
        }
      );

    }

    /**
     * AZURE SQL
     */

    if (options.azureSql) {

      providers.push(
        AzureSqlService,

        {
          provide: AZURE_SQL_DB,
          useExisting: AzureSqlService,
        }
      );

    }

    return {
      module: DatabaseModule,
      providers,
      exports: [
        POSTGRES_DB,
        AZURE_SQL_DB,
        PostgresService,
        AzureSqlService
      ],
    };
  }
}
