const Joi = require('joi');
require('dotenv').config();

const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(8001),
    GEMINI_API_KEY: Joi.string().required().messages({
        'any.required': 'BŁĄD KRYTYCZNY: Brak GEMINI_API_KEY w pliku .env!'
    }),
    VCMS_DIR: Joi.string().default(process.cwd()),
    AGENT_CONTEXT_PATH: Joi.string().allow(''),
    ALLOWED_ORIGINS: Joi.string().default('http://localhost:5173,https://vcms.flexgrafik.nl')
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
    console.error('--- STARTUP FAILURE (Audit 2.0 Guard) ---');
    console.error(`Config validation error: ${error.message}`);
    console.error('-----------------------------------------');
    process.exit(1);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    geminiKey: envVars.GEMINI_API_KEY,
    vcmsBase: envVars.VCMS_DIR,
    githubBase: envVars.AGENT_CONTEXT_PATH || require('path').resolve(process.cwd(), '..'),
    allowedOrigins: envVars.ALLOWED_ORIGINS.split(',')
};
