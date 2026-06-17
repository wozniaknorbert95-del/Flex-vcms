const Joi = require('joi');
require('dotenv').config();

// Placeholder for logger (will be injected via middleware at app startup)
// During early startup, we use stderr directly for critical errors
const logError = (msg) => {
  process.stderr.write(`[ERROR] ${msg}\n`);
};

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(8001),
  VCMS_DIR: Joi.string().default(process.cwd()),
  AGENT_CONTEXT_PATH: Joi.string().allow(''),
  ALLOWED_ORIGINS: Joi.string().default('http://localhost:5173,https://vcms.flexgrafik.nl'),
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  logError('--- STARTUP FAILURE (Audit 2.0 Guard) ---');
  logError(`Config validation error: ${error.message}`);
  logError('-----------------------------------------');
  process.exit(1);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  vcmsBase: envVars.VCMS_DIR,
  githubBase: envVars.AGENT_CONTEXT_PATH || require('path').resolve(process.cwd(), '..'),
  allowedOrigins: envVars.ALLOWED_ORIGINS.split(','),
};
