"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorsConfigService = void 0;
const common_1 = require("@nestjs/common");
const app_config_service_1 = require("../app/app-config.service");
let CorsConfigService = class CorsConfigService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    isOriginAllowed(origin) {
        if (!origin)
            return true;
        const envOrigins = this.configService.corsAllowedOrigins || [];
        if (envOrigins.includes(origin)) {
            return true;
        }
        if ((origin.startsWith("https://") &&
            origin.endsWith(".connectasistencia.com")) ||
            (origin.startsWith("https://") &&
                origin.endsWith(".apps-connectassistance.com")) ||
            (origin.startsWith("https://") && origin.endsWith(".connect.pr")) ||
            (this.configService.env === "development" &&
                origin.startsWith("http://localhost"))) {
            return true;
        }
        return false;
    }
    getCorsOptions() {
        return {
            origin: (origin, callback) => {
                if (this.isOriginAllowed(origin)) {
                    callback(null, true);
                }
                else {
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
};
exports.CorsConfigService = CorsConfigService;
exports.CorsConfigService = CorsConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_config_service_1.AppConfigService])
], CorsConfigService);
