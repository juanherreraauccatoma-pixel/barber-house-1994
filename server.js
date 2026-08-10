const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 1. Conexión inicial a MySQL (sin especificar la base de datos)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '' // Si pusiste contraseña a tu MySQL, escríbela aquí
});

// 2. Proceso automático de creación de BD y tabla
db.connect((err) => {
    if (err) {
        console.error('Error al conectar con el servidor MySQL:', err.message);
        return;
    }
    console.log('Conectado a MySQL.');

    // Crear la base de datos si no existe
    db.query("CREATE DATABASE IF NOT EXISTS barberia_datos", (err) => {
        if (err) {
            console.error('Error al crear la base de datos:', err.message);
            return;
        }

        // Seleccionar la base de datos
        db.query("USE barberia_datos", (err) => {
            if (err) {
                console.error('Error al seleccionar la base de datos:', err.message);
                return;
            }

            // Crear la tabla reservas
            const createTableSQL = `
                CREATE TABLE IF NOT EXISTS reservas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    telefono VARCHAR(20) NOT NULL,
                    servicio VARCHAR(100) NOT NULL,
                    corte VARCHAR(100),
                    barba VARCHAR(100),
                    precio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
                    fecha DATE NOT NULL,
                    hora VARCHAR(20) NOT NULL,
                    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `;

            db.query(createTableSQL, (err) => {
                if (err) {
                    console.error('Error al crear la tabla reservas:', err.message);
                } else {
                    console.log('Base de datos "barberia_datos" y tabla "reservas" listas para usar.');
                }
            });
        });
    });
});

// 3. Endpoint para guardar reservas
app.post('/api/reservar', (req, res) => {
    const { nombre, telefono, servicio, corte, barba, precio, fecha, hora } = req.body;

    if (!nombre || !servicio || !fecha || !hora) {
        return res.status(400).json({ 
            success: false, 
            message: 'Por favor completa los campos obligatorios.' 
        });
    }

    const telVal = telefono || 'Sin teléfono';
    const corteVal = corte || null;
    const barbaVal = barba || null;
    const precioVal = precio ? parseFloat(precio) : 0.00;

    const sql = `INSERT INTO reservas (nombre, telefono, servicio, corte, barba, precio, fecha, hora) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [nombre, telVal, servicio, corteVal, barbaVal, precioVal, fecha, hora];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al insertar la reserva:', err.message);
            return res.status(500).json({ success: false, message: 'Error en la base de datos.' });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Reserva registrada exitosamente.', 
            id: result.insertId 
        });
    });
});

// 4. Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});