const logger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const ms = Date.now() - start;
        if(req.path.startsWith('/api') || res.statusCode >= 400) {
           console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | Status: ${res.statusCode} | Time: ${ms}ms`);
        }
    });
    next();
};

module.exports = logger;
