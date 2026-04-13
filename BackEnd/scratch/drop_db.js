const mysql = require('mysql2/promise');
async function run() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '1234',
        });
        await connection.query('DROP DATABASE IF EXISTS finDashboardAI');
        console.log('Database dropped successfully');
        await connection.end();
    } catch (e) {
        console.error(e);
    }
}
run();
