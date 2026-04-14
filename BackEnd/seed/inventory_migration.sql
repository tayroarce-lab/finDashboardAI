-- =============================================
-- Migration: Inventory Management System
-- =============================================

USE finDashboardAI;

-- ─── Inventory Items (Insumos) ────────────────
CREATE TABLE IF NOT EXISTS inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clinic_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) NULL,
    category ENUM('supplies', 'equipment', 'medicine', 'office', 'other') NOT NULL DEFAULT 'supplies',
    stock_current DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock_min DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    unit VARCHAR(20) NOT NULL DEFAULT 'units', -- e.g., units, boxes, ml
    average_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    last_purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
);

-- ─── Inventory Transactions (Movimientos) ─────
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clinic_id INT NOT NULL,
    item_id INT NOT NULL,
    user_id INT NULL,
    type ENUM('in', 'out', 'adjustment', 'return') NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    transaction_date DATE NOT NULL,
    provider VARCHAR(150) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ─── Treatment Supplies (Relación Insumo-Tratamiento) ───
-- Esto permite automatizar la bajada de stock cuando se registra un tratamiento.
CREATE TABLE IF NOT EXISTS treatment_supplies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    treatment_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity_used DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    FOREIGN KEY (treatment_id) REFERENCES treatments(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
);

-- ─── Índices ─────────────────────────────────
CREATE INDEX idx_inventory_items_clinic ON inventory_items(clinic_id, category);
CREATE INDEX idx_inventory_transactions_item ON inventory_transactions(item_id, transaction_date);
