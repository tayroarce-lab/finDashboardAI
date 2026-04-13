const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const env = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'finDashboardAI',
    DB_PORT: parseInt(process.env.DB_PORT) || 3306,

    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

    isDev() {
        return this.NODE_ENV === 'development';
    }
};

// Validar variables críticas
const required = ['JWT_SECRET', 'DB_NAME'];
for (const key of required) {
    if (!env[key]) {
        console.error(`❌ Variable de entorno requerida: ${key}`);
        process.exit(1);
    }
}

module.exports = env;
