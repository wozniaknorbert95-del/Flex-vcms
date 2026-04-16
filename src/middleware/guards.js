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

    // Strict Security Headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
                connectSrc: ["'self'", ...allowedOrigins],
                frameAncestors: ["'none'"], // Prevent Clickjacking
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));

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
