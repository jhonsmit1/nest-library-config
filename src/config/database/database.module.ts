import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { DatabaseModuleOptions } from "./database.options";

import { PostgresService } from "./postgres/postgres.service";
import { AzureSqlService } from "./azure-sql/azure-sql.service";

import { DATABASE_SCHEMA } from "./database.schema.token";

import {
  POSTGRES_DB,
  AZURE_SQL_DB,
  POSTGRES_DRIZZLE,
  AZURE_SQL_KNEX,
} from "./database.tokens";

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
    const exports: Array<Provider | string | symbol> = [];

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

        /**
         * Servicio postgres
         */

        {
          provide: POSTGRES_DB,
          useExisting: PostgresService,
        },

        /**
         * Cliente drizzle
         */

        {
          provide: POSTGRES_DRIZZLE,
          useFactory: (postgres: PostgresService) => postgres.getDb(),
          inject: [PostgresService],
        }

      );

      exports.push(
        POSTGRES_DB,
        POSTGRES_DRIZZLE,
        PostgresService
      );

    }

    /**
     * AZURE SQL
     */

    if (options.azureSql) {

      providers.push(

        AzureSqlService,

        /**
         * Servicio azure
         */

        {
          provide: AZURE_SQL_DB,
          useExisting: AzureSqlService,
        },

        /**
         * Cliente knex
         */

        {
          provide: AZURE_SQL_KNEX,
          useFactory: (azure: AzureSqlService) => azure.getKnex(),
          inject: [AzureSqlService],
        }

      );

      exports.push(
        AZURE_SQL_DB,
        AZURE_SQL_KNEX,
        AzureSqlService
      );

    }

    return {
      module: DatabaseModule,
      providers,
      exports,
    };

  }

}
