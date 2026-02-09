import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "../env.schema";
import { AppConfigService } from "./app-config.service";


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
      validate: (config) => {
        const result = envSchema.safeParse(config);
        if (!result.success) {
          throw new Error("Invalid environment configuration");
        }
        return result.data;
      },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}