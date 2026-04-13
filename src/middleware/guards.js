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
        contentSecurityPolicy: false
    }));

    app.use(cors({
        origin: function(origin, callback){
            if(!origin) return callback(null, true);
            if(allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
            console.warn(`[CORS Blocked] Origin: ${origin}`);
            return callback(new Error('CORS policy violation'), false);
        }
    }));
};

const handleJsonErrors = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(`[SEC-WATCHDOG] SyntaxError: ${err.message}`);
        return res.status(400).json({ error: 'Niefortunny format JSON.' });
    }
    next();
};

module.exports = { setupGuards, handleJsonErrors };
