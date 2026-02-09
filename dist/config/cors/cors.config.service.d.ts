import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { AppConfigService } from "../app/app-config.service";
export declare class CorsConfigService {
    private readonly configService;
    constructor(configService: AppConfigService);
    isOriginAllowed(origin: string | undefined): boolean;
    getCorsOptions(): CorsOptions;
}
