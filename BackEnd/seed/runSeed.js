/**
 * Script para ejecutar schema.sql y seed.sql usando mysql2
 * No depende del CLI mysql - usa la conexión Node directa.
 * 
 * Uso: node seed/runSeed.js
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Cargar env manualmente
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function runSeed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        port: parseInt(process.env.DB_PORT) || 3306,
        multipleStatements: true  // Necesario para ejecutar múltiples queries
    });

    try {
        console.log('🔌 Conectado a MySQL\n');

        // 1. Ejecutar schema
        console.log('📋 Ejecutando schema.sql...');
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
        await connection.query(schema);
        console.log('✅ Schema creado exitosamente\n');

        // 2. Ejecutar seed
        console.log('🌱 Ejecutando seed.sql...');
        const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
        await connection.query(seed);
        console.log('✅ Datos seed insertados exitosamente\n');

        // 3. Verificar
        const [treatments] = await connection.query('SELECT COUNT(*) as count FROM finDashboardAI.treatments');
        const [records] = await connection.query('SELECT COUNT(*) as count FROM finDashboardAI.treatment_records');
        const [expenses] = await connection.query('SELECT COUNT(*) as count FROM finDashboardAI.expenses');
        const [patients] = await connection.query('SELECT COUNT(*) as count FROM finDashboardAI.patients');

        console.log('📊 Datos cargados:');
        console.log(`   Tratamientos: ${treatments[0].count}`);
        console.log(`   Registros:    ${records[0].count}`);
        console.log(`   Gastos:       ${expenses[0].count}`);
        console.log(`   Pacientes:    ${patients[0].count}`);
        console.log('\n🦷 DentalFlow AI - Base de datos lista ✅');

    } catch (error) {
        console.error('❌ Error:', error.message);
        // Si el error es de duplicados, probablemente ya se corrió
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('\n⚠️  Los datos seed ya existen. Si quieres recrear, ejecuta:');
            console.log('    DROP DATABASE finDashboardAI;');
            console.log('    Luego vuelve a correr: npm run seed');
        }
    } finally {
        await connection.end();
    }
}

runSeed();
