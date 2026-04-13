const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const env = require('../config/env');
const AppError = require('../utils/AppError');

/**
 * AuthService — Maneja registro, login y generación de JWT.
 * Al registrarse, crea la clínica Y el usuario en una transacción.
 */
class AuthService {
    /**
     * Registra un nuevo usuario + clínica.
     * @param {Object} data - { name, email, password, clinicName, chairs }
     * @returns {Promise<{ user, token }>}
     */
    async register({ name, email, password, clinicName, chairs = 1 }) {
        // Validaciones
        if (!name || !email || !password || !clinicName) {
            throw AppError.validation('Todos los campos son requeridos: name, email, password, clinicName');
        }

        if (password.length < 6) {
            throw AppError.validation('La contraseña debe tener al menos 6 caracteres');
        }

        // Verificar email único
        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        if (existing.length > 0) {
            throw AppError.conflict('El email ya está registrado');
        }

        // Transacción: crear clínica + usuario
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Crear clínica
            const [clinicResult] = await connection.execute(
                'INSERT INTO clinics (name, chairs) VALUES (?, ?)',
                [clinicName, chairs]
            );
            const clinicId = clinicResult.insertId;

            // 2. Crear categorías de gastos por defecto
            const defaultCategories = [
                [clinicId, 'Nómina', '👥', true],
                [clinicId, 'Materiales dentales', '🦷', true],
                [clinicId, 'Renta/Alquiler', '🏢', true],
                [clinicId, 'Servicios (agua, luz, internet)', '💡', true],
                [clinicId, 'Marketing', '📢', true],
                [clinicId, 'Equipo y mantenimiento', '🔧', true],
                [clinicId, 'Seguros', '🛡️', true],
                [clinicId, 'Otros', '📦', true]
            ];
            for (const cat of defaultCategories) {
                await connection.execute(
                    'INSERT INTO expense_categories (clinic_id, name, icon, is_default) VALUES (?, ?, ?, ?)',
                    cat
                );
            }

            // 3. Crear usuario
            const passwordHash = await bcrypt.hash(password, 10);
            const [userResult] = await connection.execute(
                'INSERT INTO users (clinic_id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
                [clinicId, name, email, passwordHash, 'owner']
            );

            await connection.commit();

            const user = {
                id: userResult.insertId,
                clinicId,
                name,
                email,
                role: 'owner'
            };

            const token = this._generateToken(user);

            return { user, token };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Login con email y password.
     * @param {Object} data - { email, password }
     * @returns {Promise<{ user, token }>}
     */
    async login({ email, password }) {
        if (!email || !password) {
            throw AppError.validation('Email y contraseña son requeridos');
        }

        // Buscar usuario
        const [rows] = await pool.execute(
            'SELECT u.*, c.name as clinic_name FROM users u JOIN clinics c ON u.clinic_id = c.id WHERE u.email = ? AND u.is_active = TRUE',
            [email]
        );

        if (rows.length === 0) {
            throw AppError.unauthorized('Credenciales incorrectas');
        }

        const user = rows[0];

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            throw AppError.unauthorized('Credenciales incorrectas');
        }

        // Actualizar último login
        await pool.execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [user.id]
        );

        const userData = {
            id: user.id,
            clinicId: user.clinic_id,
            name: user.name,
            email: user.email,
            role: user.role,
            clinicName: user.clinic_name
        };

        const token = this._generateToken(userData);

        return { user: userData, token };
    }

    /**
     * Obtiene perfil del usuario actual.
     */
    async getProfile(userId) {
        const [rows] = await pool.execute(
            `SELECT u.id, u.name, u.email, u.role, u.last_login,
                    c.id as clinic_id, c.name as clinic_name, c.chairs, 
                    c.opening_time, c.closing_time, c.currency
             FROM users u 
             JOIN clinics c ON u.clinic_id = c.id 
             WHERE u.id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            throw AppError.notFound('Usuario');
        }

        return rows[0];
    }

    /**
     * Genera un JWT con datos del usuario.
     */
    _generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                clinicId: user.clinicId,
                email: user.email,
                role: user.role
            },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN }
        );
    }
}

module.exports = new AuthService();
