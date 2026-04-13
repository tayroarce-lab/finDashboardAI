const { pool } = require('../config/db');

/**
 * BaseRepository — Clase base para todos los repositorios.
 * Proporciona operaciones CRUD genéricas con soporte multi-tenant (clinic_id).
 */
class BaseRepository {
    /**
     * @param {string} tableName - Nombre de la tabla en MySQL
     */
    constructor(tableName) {
        this.tableName = tableName;
        this.pool = pool;
    }

    /**
     * Ejecuta una query SQL con parámetros.
     * @param {string} sql - Query SQL con placeholders ?
     * @param {Array} params - Valores para los placeholders
     * @returns {Promise<Array>} Resultados de la query
     */
    async query(sql, params = []) {
        const [rows] = await this.pool.execute(sql, params);
        return rows;
    }

    /**
     * Obtiene todos los registros de una clínica.
     * @param {number} clinicId
     * @param {Object} options - { orderBy, limit, offset }
     * @returns {Promise<Array>}
     */
    async findAll(clinicId, options = {}) {
        const { orderBy = 'created_at DESC', limit = 100, offset = 0 } = options;
        const sql = `SELECT * FROM ${this.tableName} 
                      WHERE clinic_id = ? 
                      ORDER BY ${orderBy} 
                      LIMIT ? OFFSET ?`;
        return this.query(sql, [clinicId, limit, offset]);
    }

    /**
     * Busca un registro por ID dentro de una clínica.
     * @param {number} id
     * @param {number} clinicId
     * @returns {Promise<Object|null>}
     */
    async findById(id, clinicId) {
        const sql = `SELECT * FROM ${this.tableName} WHERE id = ? AND clinic_id = ?`;
        const rows = await this.query(sql, [id, clinicId]);
        return rows[0] || null;
    }

    /**
     * Crea un nuevo registro.
     * @param {Object} data - Datos a insertar
     * @returns {Promise<Object>} - Registro creado con su ID
     */
    async create(data) {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);

        const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
        const [result] = await this.pool.execute(sql, values);

        return { id: result.insertId, ...data };
    }

    /**
     * Actualiza un registro existente.
     * @param {number} id
     * @param {Object} data - Campos a actualizar
     * @param {number} clinicId - Para seguridad multi-tenant
     * @returns {Promise<boolean>} - true si se actualizó
     */
    async update(id, data, clinicId) {
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(data), id, clinicId];

        const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ? AND clinic_id = ?`;
        const [result] = await this.pool.execute(sql, values);

        return result.affectedRows > 0;
    }

    /**
     * Elimina un registro.
     * @param {number} id
     * @param {number} clinicId
     * @returns {Promise<boolean>}
     */
    async delete(id, clinicId) {
        const sql = `DELETE FROM ${this.tableName} WHERE id = ? AND clinic_id = ?`;
        const [result] = await this.pool.execute(sql, [id, clinicId]);
        return result.affectedRows > 0;
    }

    /**
     * Cuenta registros con filtros opcionales.
     * @param {number} clinicId
     * @param {Object} filters - { field: value }
     * @returns {Promise<number>}
     */
    async count(clinicId, filters = {}) {
        let sql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE clinic_id = ?`;
        const params = [clinicId];

        for (const [key, value] of Object.entries(filters)) {
            sql += ` AND ${key} = ?`;
            params.push(value);
        }

        const rows = await this.query(sql, params);
        return rows[0].total;
    }
}

module.exports = BaseRepository;
