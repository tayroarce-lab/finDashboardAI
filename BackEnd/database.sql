-- SQL Base para DentalFlow AI
CREATE TABLE IF NOT EXISTS treatments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    provider_cost DECIMAL(10,2) NOT NULL,
    estimated_duration_minutes INT NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    treatment_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    real_duration_minutes INT NOT NULL,
    revenue DECIMAL(10,2) NOT NULL,
    doctor_commission DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (treatment_id) REFERENCES treatments(id)
);

CREATE TABLE IF NOT EXISTS fixed_expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    monthly_amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS ai_insights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    insight_type VARCHAR(50) NOT NULL, -- e.g., 'PROFITABILITY_ALERT', 'EFFICIENCY_TIP'
    summary TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'HIGH', 'MEDIUM', 'LOW'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
