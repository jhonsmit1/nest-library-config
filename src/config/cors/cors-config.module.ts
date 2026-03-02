import { Module, Global } from "@nestjs/common";
import { CorsConfigService } from "./cors.config.service";

@Global()
@Module({
  imports: [],
  providers: [CorsConfigService],
  exports: [CorsConfigService],
})
export class CorsConfigModule {}
