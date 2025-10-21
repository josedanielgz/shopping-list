-- Verificar si la tabla existe y eliminarla si es necesario (para pruebas)
DROP TABLE IF EXISTS items_compra;

-- 1. CREACIÓN DE LA TABLA
-- Utiliza SERIAL para el ID autoincrementable y NOT NULL para campos obligatorios
CREATE TABLE items_compra (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL,
    precio NUMERIC(10, 2) DEFAULT 0.00,
    comprado BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. INSERCIÓN DE DATOS DE PRUEBA (10 Registros)
INSERT INTO items_compra (nombre, cantidad, precio, comprado) VALUES
('Leche entera (1L)', 2, 1.95, FALSE),
('Pan integral rebanado', 1, 3.50, FALSE),
('Huevos (docena)', 1, 4.20, FALSE),
('Arroz blanco (1kg)', 3, 1.10, FALSE),
('Manzanas Rojas (kg)', 1, 2.80, TRUE),      -- Ya comprado
('Jugo de Naranja Natural', 2, 3.15, FALSE),
('Pechuga de Pollo (kg)', 0.5, 7.99, FALSE),
('Pasta de dientes', 1, 5.00, TRUE),          -- Ya comprado
('Café molido (250g)', 1, 8.50, FALSE),
('Aguacates (unidad)', 4, 1.25, FALSE);

GRANT ALL PRIVILEGES ON TABLE items_compra TO shop_manager;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO shop_manager;