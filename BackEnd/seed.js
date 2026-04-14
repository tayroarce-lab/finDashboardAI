const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dentalflow_db'
};

async function seed() {
    const connection = await mysql.createConnection(dbConfig);
    console.log('🌱 Starting database seeding...');

    try {
        // 1. Clear existing data (Careful: for practice purposes)
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE fixed_expenses');
        await connection.query('TRUNCATE TABLE appointments');
        await connection.query('TRUNCATE TABLE inventory');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // 2. Seed Fixed Expenses (Last 3 months)
        const expenses = [
            { category: 'Alquiler', amount: 1500, billing_month: '2026-04-01' },
            { category: 'Alquiler', amount: 1500, billing_month: '2026-03-01' },
            { category: 'Marketing', amount: 500, billing_month: '2026-04-01' },
            { category: 'Marketing', amount: 450, billing_month: '2026-03-01' },
            { category: 'Salarios', amount: 4200, billing_month: '2026-04-01' },
            { category: 'Servicios', amount: 300, billing_month: '2026-04-01' },
        ];

        for (const exp of expenses) {
            await connection.query(
                'INSERT INTO fixed_expenses (category, amount, clinic_id, billing_month) VALUES (?, ?, 1, ?)',
                [exp.category, exp.amount, exp.billing_month]
            );
        }

        // 3. Seed Inventory
        const items = [
            { name: 'Resina 3M A2', stock: 15, min_stock: 5, unit_price: 25.50 },
            { name: 'Guantes Nitrilo M', stock: 8, min_stock: 10, unit_price: 8.90 },
            { name: 'Anestesia 2%', stock: 45, min_stock: 20, unit_price: 1.20 },
            { name: 'Eyectores (paquete)', stock: 3, min_stock: 5, unit_price: 5.40 },
        ];

        for (const item of items) {
            await connection.query(
                'INSERT INTO inventory (name, stock, min_stock, unit_price, clinic_id) VALUES (?, ?, ?, ?, 1)',
                [item.name, item.stock, item.min_stock, item.unit_price]
            );
        }

        // 4. Seed Appointments (Random for last 30 days)
        console.log('📅 Generating realistic appointments...');
        for (let i = 0; i < 40; i++) {
            const daysAgo = Math.floor(Math.random() * 30);
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            
            const revenue = 150 + Math.random() * 800;
            const cost = revenue * (0.2 + Math.random() * 0.4);
            const duration = [30, 60, 90, 120][Math.floor(Math.random() * 4)];
            const doctorId = (i % 3) + 1;
            const treatmentId = (i % 5) + 1;

            await connection.query(
                'INSERT INTO appointments (doctor_id, treatment_id, appointment_date, real_duration_minutes, revenue, supply_cost, clinic_id) VALUES (?, ?, ?, ?, ?, ?, 1)',
                [doctorId, treatmentId, date, duration, revenue, cost]
            );
        }

        console.log('✅ Seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await connection.end();
    }
}

seed();
