const app = require('./app');
const env = require('./config/env');
const { testConnection } = require('./config/db');

/**
 * Arranca el servidor después de verificar la conexión a DB.
 */
async function startServer() {
    try {
        // Verificar conexión a MySQL antes de arrancar
        await testConnection();

        app.listen(env.PORT, () => {
            console.log(`\n🦷 DentalFlow AI API`);
            console.log(`   Entorno:  ${env.NODE_ENV}`);
            console.log(`   Puerto:   ${env.PORT}`);
            console.log(`   Base URL: http://localhost:${env.PORT}/api`);
            console.log(`   Health:   http://localhost:${env.PORT}/api/health\n`);
        });
    } catch (error) {
        console.error('❌ No se pudo iniciar el servidor:', error.message);
        process.exit(1);
    }
}

startServer();
