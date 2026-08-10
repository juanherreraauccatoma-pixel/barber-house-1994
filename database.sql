CREATE DATABASE IF NOT EXISTS barberia_datos;
USE barberia_datos;

CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    servicio VARCHAR(50) NOT NULL,
    corte VARCHAR(50) NULL,
    barba VARCHAR(50) NULL,
    precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);