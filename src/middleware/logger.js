const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(info => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`)
);

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/vcms-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d',
    level: 'info'
});

const winLogger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        dailyRotateFileTransport,
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        })
    ]
});

// Middleware for Express
const loggerMiddleware = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        const msg = `${req.method} ${req.originalUrl || req.url} | Status: ${res.statusCode} | Time: ${ms}ms | IP: ${req.ip}`;
        
        if (res.statusCode >= 500) {
            winLogger.error(msg);
        } else if (res.statusCode >= 400) {
            winLogger.warn(msg);
        } else {
            winLogger.info(msg);
        }
    });
    next();
};

module.exports = {
    logger: loggerMiddleware,
    winLogger: winLogger // Export for manual logging
};
