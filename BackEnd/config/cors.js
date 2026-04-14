const env = require('./env');

const allowedOrigins = [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
];

const corsConfig = {
    origin: function (origin, callback) {
        // Allow requests with no origin (n8n, curl, server-to-server)
        if (!origin) return callback(null, true);
        // Allow if origin matches or is a localtunnel URL
        if (allowedOrigins.includes(origin) || origin.endsWith('.loca.lt')) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'bypass-tunnel-reminder'],
    credentials: true,
    maxAge: 86400 // 24 horas
};

module.exports = corsConfig;
