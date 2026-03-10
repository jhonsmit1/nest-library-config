"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectDatabase = InjectDatabase;
const common_1 = require("@nestjs/common");
const database_tokens_1 = require("../database.tokens");
function InjectDatabase(engine) {
    switch (engine) {
        case "postgres":
            return (0, common_1.Inject)(database_tokens_1.POSTGRES_DRIZZLE);
        case "azure":
            return (0, common_1.Inject)(database_tokens_1.AZURE_SQL_KNEX);
        default:
            throw new Error(`Unsupported database engine: ${engine}`);
    }
}
