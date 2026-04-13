const express = require('express');
const cors = require('cors');

const corsConfig = require('./config/cors');
const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const authMiddleware = require('./middlewares/authMiddleware');
const routes = require('./routes');

const app = express();

// ─── Middlewares Globales ────────────────────────────
app.use(requestLogger);
app.use(cors(corsConfig));
app.use(express.json({ limit: '10mb' }));

// ─── Health Check (público) ─────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        data: {
            status: 'ok',
            service: 'DentalFlow AI API',
            timestamp: new Date().toISOString()
        }
    });
});

// ─── Rutas de la API ────────────────────────────────
app.use('/api', routes);

// ─── 404 Handler ────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
        }
    });
});

// ─── Error Handler (siempre al final) ───────────────
app.use(errorHandler);

module.exports = app;
