const helmet = require('helmet');
const cors = require('cors');

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
    'http://localhost:5173', 
    'http://127.0.0.1:5173', 
    'https://vcms.flexgrafik.nl',
    'http://cmd.flexgrafik.nl',
    'https://cmd.flexgrafik.nl',
    'http://185.243.54.115',
    'https://185.243.54.115'
];

const setupGuards = (app) => {
    app.disable('x-powered-by');

    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
                connectSrc: ["'self'", ...allowedOrigins],
                frameAncestors: ["'self'"],
                objectSrc: ["'none'"],
                // upgradeInsecureRequests omitted: would break IP-direct HTTP fallback.
                // TLS enforcement is handled by nginx (HTTP→HTTPS 301).
                upgradeInsecureRequests: null,
            },
        },
        crossOriginEmbedderPolicy: false,
    }));

    // Permissions-Policy not set by helmet ≥6; add explicitly.
    app.use((req, res, next) => {
        res.setHeader(
            'Permissions-Policy',
            'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()'
        );
        next();
    });

    app.use(cors({
        origin: function(origin, callback){
            // Allow requests with no origin (like mobile apps or curl)
            if(!origin) return callback(null, true);
            
            // Strict check against allowed list
            if(allowedOrigins.indexOf(origin) !== -1) {
                return callback(null, true);
            }
            
            console.warn(`[SECURITY-ALERT] CORS Blocked for Origin: ${origin}`);
            return callback(new Error('CORS policy violation'), false);
        },
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
};

const handleJsonErrors = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(`[SEC-WATCHDOG] Malformed JSON: ${err.message}`);
        return res.status(400).json({ error: 'Niefortunny format JSON.' });
    }
    next();
};

module.exports = { setupGuards, handleJsonErrors };
