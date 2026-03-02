import { ZodSchema } from "zod";
export interface AppConfigModuleOptions {
    schema?: ZodSchema<any>;
    cache?: boolean;
}
