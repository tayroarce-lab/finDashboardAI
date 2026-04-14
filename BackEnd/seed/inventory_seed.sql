-- =============================================
-- Seed: Inventory & Supplies Demo Data
-- =============================================

USE finDashboardAI;

-- ─── Inventory Items ──────────────────────────
INSERT INTO inventory_items (clinic_id, name, sku, category, stock_current, stock_min, unit, average_cost) VALUES
(1, 'Anestesia Tópica (Bote 30g)', 'ANS-001', 'supplies', 15.00, 5.00, 'unidades', 12.50),
(1, 'Resina Compuesta A2 (Jeringa)', 'RES-A2', 'supplies', 24.00, 10.00, 'unidades', 45.00),
(1, 'Guantes de Nitrilo (Caja 100)', 'GLV-M', 'supplies', 8.00, 15.00, 'cajas', 18.00), -- Stock Bajo Intencional
(1, 'Amoxicilina 500mg', 'MED-AMX', 'medicine', 50.00, 20.00, 'tabletas', 0.85),
(1, 'Puntas de Succión (Paquete 50)', 'SUC-01', 'supplies', 12.00, 10.00, 'paquetes', 8.50);

-- ─── Treatment Supplies ───────────────────────
-- Asociamos insumos a tratamientos específicos para el consumo automático.

-- 1. Resina (Tratamiento ID 1 en seed estándar)
-- Usa 1 jeringa de resina y 1 par de guantes (simulado como 0.5 caja o 1 unidad dependiendo de la escala)
INSERT INTO treatment_supplies (treatment_id, item_id, quantity_used) VALUES
(1, 2, 0.10), -- Usa el 10% de una jeringa de resina
(1, 3, 0.02); -- Usa el 2% de una caja de guantes (puedes ajustar esta lógica a unidades reales)

-- 2. Limpieza (Tratamiento ID 2)
INSERT INTO treatment_supplies (treatment_id, item_id, quantity_used) VALUES
(2, 5, 1.00); -- Usa 1 paquete de puntas de succión (o 0.1 si fuera por unidad)

-- 3. Exodoncia
INSERT INTO treatment_supplies (treatment_id, item_id, quantity_used) VALUES
(1, 1, 0.50), -- Media unidad de anestesia
(1, 3, 0.02);
