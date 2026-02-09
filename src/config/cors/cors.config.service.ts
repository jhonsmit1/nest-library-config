import { Injectable } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { AppConfigService } from "../app/app-config.service";

@Injectable()
export class CorsConfigService {
  constructor(private readonly configService: AppConfigService) {}

  isOriginAllowed(origin: string | undefined): boolean {
    if (!origin) return true;

    const envOrigins = this.configService.corsAllowedOrigins || [];

    if (envOrigins.includes(origin)) {
      return true;
    }

    if (
      (origin.startsWith("https://") &&
        origin.endsWith(".connectasistencia.com")) ||
      (origin.startsWith("https://") &&
        origin.endsWith(".apps-connectassistance.com")) ||
      (origin.startsWith("https://") && origin.endsWith(".connect.pr")) ||
      (this.configService.env === "development" &&
        origin.startsWith("http://localhost"))
    ) {
      return true;
    }

    return false;
  }

  /**
   * Returns full CORS config ready to be used in app.enableCors()
   */
  getCorsOptions(): CorsOptions {
    return {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => {
        if (this.isOriginAllowed(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "authorization",
        "sentry-trace",
        "X-Requested-With",
        "User-Id",
        "cognito-authorization",
      ],
      credentials: true,
    };
  }
}
