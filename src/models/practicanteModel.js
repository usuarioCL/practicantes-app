const db = require('../models/db');  // Conexión a la base de datos

const Practicante = {};

// Obtener todos los practicantes
Practicante.obtenerTodos = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM practicantes', (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Obtener un practicante por ID
// En tu controlador para editar el practicante
Practicante.obtenerPorId = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM practicantes WHERE id = ?', [id], (err, result) => {
      if (err) reject(err);
      else {
        const practicante = result[0];  // Devuelve solo el primer resultado
        db.query('SELECT nombre FROM carreras WHERE id = ?', [practicante.carrera_id], (err, carreraResult) => {
          if (err) reject(err);
          else {
            practicante.carrera = carreraResult[0] ? carreraResult[0].nombre : 'No disponible';
            resolve(practicante);
          }
        });
      }
    });
  });
};




// Crear un nuevo practicante
Practicante.crear = (datos) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO practicantes (nombre_completo, correo, carrera_id, fecha_inicio, telefono) VALUES (?, ?, ?, ?, ?)';
    const valores = [
      datos.nombre_completo,
      datos.correo,
      datos.carrera_id,
      datos.fecha_inicio,
      datos.telefono || null,
    ];

    db.query(sql, valores, (err, result) => {
      if (err) {
        reject(err); // Si hay error, lo rechazamos
      } else {
        resolve(result); // Si todo va bien, resolvemos la promesa
      }
    });
  });
};

// Actualizar un practicante
Practicante.actualizar = (id, datos) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE practicantes SET ? WHERE id = ?', [datos, id], (err, result) => {
      if (err) {
        console.error('Error en la consulta:', err);
        reject(err);
      } else {
        
        resolve(result);
      }
    });
  });
};

// Eliminar un practicante
Practicante.eliminar = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM practicantes WHERE id = ?', [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports = Practicante;
