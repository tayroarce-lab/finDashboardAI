-- =============================================
-- DentalFlow AI — Datos Seed para Demo
-- Ejecutar DESPUÉS del schema.sql
-- =============================================

USE finDashboardAI;

-- ─── Clínica Demo ───────────────────────────
INSERT INTO clinics (name, chairs, opening_time, closing_time, working_days, slot_duration_minutes, currency)
VALUES ('Clínica Dental Sonrisa', 3, '08:00', '17:00', '1,2,3,4,5', 60, 'USD');

-- ─── Usuario Demo (password: demo1234) ──────
INSERT INTO users (clinic_id, name, email, password_hash, role)
VALUES (1, 'Dr. Carlos Méndez', 'carlos@sonrisa.com', '$2b$10$8K1p/a0dR1xqM8K3hq3lqeKiLnDYxpM9s.m91vO3Q4w3E5pY8GWXO', 'owner');

-- ─── Doctors ──────────────────────────────────
INSERT INTO doctors (clinic_id, name, specialty, color) VALUES
(1, 'Dra. Elena Rivas', 'Odontopediatría', '#ec4899'),
(1, 'Dr. Roberto Soto', 'Endodoncia', '#8b5cf6'),
(1, 'Dra. Lucía Paz', 'General', '#10b981');

-- ─── Categorías de Gastos ───────────────────
INSERT INTO expense_categories (clinic_id, name, icon, is_default) VALUES
(1, 'Nómina', '👥', TRUE),
(1, 'Materiales dentales', '🦷', TRUE),
(1, 'Renta/Alquiler', '🏢', TRUE),
(1, 'Servicios (agua, luz, internet)', '💡', TRUE),
(1, 'Marketing', '📢', TRUE),
(1, 'Equipo y mantenimiento', '🔧', TRUE),
(1, 'Seguros', '🛡️', TRUE),
(1, 'Otros', '📦', TRUE);

-- ─── Tratamientos ───────────────────────────
INSERT INTO treatments (clinic_id, name, price, estimated_cost, duration_minutes, category) VALUES
(1, 'Limpieza dental', 45.00, 18.00, 30, 'preventive'),
(1, 'Limpieza profunda', 85.00, 46.00, 45, 'preventive'),
(1, 'Resina compuesta', 95.00, 38.00, 45, 'restorative'),
(1, 'Extracción simple', 65.00, 28.00, 30, 'surgical'),
(1, 'Extracción de muela del juicio', 180.00, 75.00, 60, 'surgical'),
(1, 'Endodoncia', 280.00, 125.00, 90, 'endodontic'),
(1, 'Corona dental', 380.00, 160.00, 90, 'restorative'),
(1, 'Implante dental', 850.00, 395.00, 120, 'surgical'),
(1, 'Blanqueamiento', 200.00, 55.00, 60, 'cosmetic'),
(1, 'Ortodoncia (mensualidad)', 120.00, 35.00, 30, 'orthodontic');

-- ─── Pacientes ──────────────────────────────
INSERT INTO patients (clinic_id, name, phone, email) VALUES
(1, 'María García', '+506 8888-1111', 'maria@email.com'),
(1, 'Juan Rodríguez', '+506 8888-2222', 'juan@email.com'),
(1, 'Ana López', '+506 8888-3333', 'ana@email.com'),
(1, 'Carlos Hernández', '+506 8888-4444', 'carlosh@email.com'),
(1, 'Laura Martínez', '+506 8888-5555', 'laura@email.com'),
(1, 'Pedro Sánchez', '+506 8888-6666', 'pedro@email.com'),
(1, 'Sofía Ramírez', '+506 8888-7777', 'sofia@email.com'),
(1, 'Diego Torres', '+506 8888-8888', 'diego@email.com');

-- ─── Treatment Records (últimos 30 días) ───
-- Semana 1
INSERT INTO treatment_records (clinic_id, treatment_id, patient_id, price_charged, discount, actual_cost, payment_method, performed_date) VALUES
(1, 1, 1, 45.00, 0, 18.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 28 DAY)),
(1, 3, 2, 95.00, 0, 40.00, 'card', DATE_SUB(CURDATE(), INTERVAL 28 DAY)),
(1, 7, 3, 380.00, 0, 165.00, 'card', DATE_SUB(CURDATE(), INTERVAL 27 DAY)),
(1, 6, 4, 280.00, 30, 130.00, 'transfer', DATE_SUB(CURDATE(), INTERVAL 27 DAY)),
(1, 1, 5, 45.00, 0, 18.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 26 DAY)),
(1, 9, 6, 200.00, 0, 55.00, 'card', DATE_SUB(CURDATE(), INTERVAL 26 DAY)),
(1, 3, 7, 95.00, 10, 38.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 25 DAY)),
(1, 10, 1, 120.00, 0, 35.00, 'transfer', DATE_SUB(CURDATE(), INTERVAL 25 DAY)),
(1, 4, 8, 65.00, 0, 28.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 24 DAY)),

-- Semana 2
(1, 7, 2, 380.00, 50, 155.00, 'card', DATE_SUB(CURDATE(), INTERVAL 21 DAY)),
(1, 1, 3, 45.00, 0, 18.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 21 DAY)),
(1, 3, 4, 95.00, 0, 42.00, 'card', DATE_SUB(CURDATE(), INTERVAL 20 DAY)),
(1, 8, 5, 850.00, 0, 400.00, 'card', DATE_SUB(CURDATE(), INTERVAL 20 DAY)),
(1, 1, 6, 45.00, 0, 18.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 19 DAY)),
(1, 5, 7, 180.00, 0, 78.00, 'card', DATE_SUB(CURDATE(), INTERVAL 19 DAY)),
(1, 3, 8, 95.00, 0, 38.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 18 DAY)),
(1, 6, 1, 280.00, 0, 125.00, 'transfer', DATE_SUB(CURDATE(), INTERVAL 18 DAY)),
(1, 10, 2, 120.00, 0, 35.00, 'transfer', DATE_SUB(CURDATE(), INTERVAL 17 DAY)),

-- Semana 3
(1, 1, 3, 45.00, 0, 18.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 14 DAY)),
(1, 7, 4, 380.00, 0, 158.00, 'card', DATE_SUB(CURDATE(), INTERVAL 14 DAY)),
(1, 9, 5, 200.00, 20, 55.00, 'card', DATE_SUB(CURDATE(), INTERVAL 13 DAY)),
(1, 3, 6, 95.00, 0, 38.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 13 DAY)),
(1, 1, 7, 45.00, 0, 18.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 12 DAY)),
(1, 4, 8, 65.00, 0, 30.00, 'card', DATE_SUB(CURDATE(), INTERVAL 12 DAY)),
(1, 6, 1, 280.00, 0, 128.00, 'card', DATE_SUB(CURDATE(), INTERVAL 11 DAY)),
(1, 3, 2, 95.00, 15, 38.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 10 DAY)),

-- Semana 4
(1, 1, 3, 45.00, 0, 18.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
(1, 8, 4, 850.00, 100, 410.00, 'card', DATE_SUB(CURDATE(), INTERVAL 7 DAY)),
(1, 7, 5, 380.00, 0, 162.00, 'card', DATE_SUB(CURDATE(), INTERVAL 6 DAY)),
(1, 3, 6, 95.00, 0, 38.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 6 DAY)),
(1, 1, 7, 45.00, 0, 18.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(1, 10, 8, 120.00, 0, 35.00, 'transfer', DATE_SUB(CURDATE(), INTERVAL 5 DAY)),
(1, 5, 1, 180.00, 0, 75.00, 'card', DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(1, 1, 3, 45.00, 0, 18.00, 'cash', DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(1, 7, 4, 380.00, 0, 160.00, 'card', DATE_SUB(CURDATE(), INTERVAL 1 DAY));

-- ─── Appointments (Agenda) ──────────────────
INSERT INTO appointments (clinic_id, doctor_id, patient_id, treatment_id, start_time, end_time, status) VALUES
(1, 1, 1, 1, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL 9 HOUR), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 2 DAY), INTERVAL 10 HOUR), 'completed'),
(1, 2, 2, 6, DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL 10 HOUR), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL 1 DAY), INTERVAL 12 HOUR), 'completed'),
(1, 3, 3, 3, DATE_ADD(CURDATE(), INTERVAL 9 HOUR), DATE_ADD(CURDATE(), INTERVAL 10 HOUR), 'confirmed'),
(1, 1, 4, 7, DATE_ADD(CURDATE(), INTERVAL 11 HOUR), DATE_ADD(CURDATE(), INTERVAL 13 HOUR), 'scheduled'),
(1, 2, 5, 6, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 14 HOUR), DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 15 HOUR), 'scheduled');

-- ─── Gastos del Mes ─────────────────────────
INSERT INTO expenses (clinic_id, category_id, amount, vendor, expense_date, is_recurring, recurrence_frequency) VALUES
(1, 1, 1600.00, 'Asistente dental', DATE_SUB(CURDATE(), INTERVAL 28 DAY), TRUE, 'biweekly'),
(1, 1, 1600.00, 'Asistente dental', DATE_SUB(CURDATE(), INTERVAL 14 DAY), TRUE, 'biweekly'),
(1, 2, 450.00, 'Dental Supply Co', DATE_SUB(CURDATE(), INTERVAL 25 DAY), FALSE, NULL),
(1, 2, 380.00, 'Dental Express', DATE_SUB(CURDATE(), INTERVAL 18 DAY), FALSE, NULL),
(1, 2, 520.00, 'Dental Supply Co', DATE_SUB(CURDATE(), INTERVAL 7 DAY), FALSE, NULL),
(1, 3, 1200.00, 'Propietario local', DATE_SUB(CURDATE(), INTERVAL 28 DAY), TRUE, 'monthly'),
(1, 4, 85.00, 'ICE Electricidad', DATE_SUB(CURDATE(), INTERVAL 20 DAY), TRUE, 'monthly'),
(1, 4, 45.00, 'AyA Agua', DATE_SUB(CURDATE(), INTERVAL 20 DAY), TRUE, 'monthly'),
(1, 4, 55.00, 'Kolbi Internet', DATE_SUB(CURDATE(), INTERVAL 20 DAY), TRUE, 'monthly'),
(1, 5, 150.00, 'Facebook Ads', DATE_SUB(CURDATE(), INTERVAL 15 DAY), TRUE, 'monthly'),
(1, 5, 75.00, 'Diseño redes sociales', DATE_SUB(CURDATE(), INTERVAL 15 DAY), FALSE, NULL),
(1, 6, 280.00, 'Mantenimiento compresor', DATE_SUB(CURDATE(), INTERVAL 10 DAY), FALSE, NULL);

-- ─── Verificación ───────────────────────────
SELECT 'Schema y datos seed cargados exitosamente ✅' AS status;
SELECT COUNT(*) AS total_treatments FROM treatments;
SELECT COUNT(*) AS total_records FROM treatment_records;
SELECT COUNT(*) AS total_expenses FROM expenses;
SELECT COUNT(*) AS total_patients FROM patients;
