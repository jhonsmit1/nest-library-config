import { Module, Global } from "@nestjs/common";
import { AppConfigModule } from "../app/app-config.module";
import { CorsConfigService } from "./cors.config.service";

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [CorsConfigService],
  exports: [CorsConfigService],
})
export class CorsConfigModule {}
