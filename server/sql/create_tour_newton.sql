-- Crear la tabla tour_newton
CREATE TABLE IF NOT EXISTS tour_newton (
    id SERIAL PRIMARY KEY,
    newton_id VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);