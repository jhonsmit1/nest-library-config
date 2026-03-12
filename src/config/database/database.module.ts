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

      if (options.schema) {
        providers.push({
          provide: DATABASE_SCHEMA,
          useValue: options.schema,
        });
      }

      providers.push(
        PostgresService,

        /**
         * Alias del servicio
         */

        {
          provide: POSTGRES_DB,
          useExisting: PostgresService,
        },

        /**
         * Proxy lazy para Drizzle
         */


        {
          provide: POSTGRES_DRIZZLE,
          useFactory: (postgres: PostgresService) => {

            let db: any;

            return new Proxy(
              {},
              {
                get(_, prop) {

                  /**
                   * NestJS inspecciona propiedades internas
                   * NO debemos inicializar la DB aquí
                   */

                  if (
                    prop === "constructor" ||
                    prop === "then" ||
                    prop === "inspect" ||
                    prop === Symbol.toStringTag ||
                    prop === Symbol.iterator
                  ) {
                    return undefined;
                  }

                  if (!db) {
                    db = postgres.getDb();
                  }

                  return db[prop];
                },
              }
            );

          },
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
         * Alias del servicio
         */

        {
          provide: AZURE_SQL_DB,
          useExisting: AzureSqlService,
        },

        /**
         * Proxy lazy para Knex
         */

        {
          provide: AZURE_SQL_KNEX,
          useFactory: (azure: AzureSqlService) => {

            let knex: any;

            const handler: ProxyHandler<any> = {

              apply(_, __, args) {

                if (!knex) {
                  knex = azure.getKnex();
                }

                return knex(...args);

              },

              get(_, prop) {

                if (
                  prop === "constructor" ||
                  prop === "then" ||
                  prop === "inspect" ||
                  prop === Symbol.toStringTag ||
                  prop === Symbol.iterator
                ) {
                  return undefined;
                }

                if (!knex) {
                  knex = azure.getKnex();
                }

                return knex[prop];

              }

            };

            return new Proxy(function () { }, handler);

          },
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
