const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        if (!Database.instance) {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'dentalflow_db',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            this.query = this.query.bind(this);
            this.testConnection = this.testConnection.bind(this);
            Database.instance = this;
        }
        return Database.instance;
    }

    async query(sql, params) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Database Query Error:', error);
            throw error;
        }
    }

    async testConnection() {
        try {
            const connection = await this.pool.getConnection();
            connection.release();
            console.log('✅ Conexión a Base de Datos MySQL (POO) Exitosa');
            return true;
        } catch (error) {
            console.error('❌ Error de Base de Datos:', error.message);
            throw error;
        }
    }
}

module.exports = new Database();