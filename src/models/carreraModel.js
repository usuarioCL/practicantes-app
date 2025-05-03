// models/carreraModel.js
const db = require('../models/db');

const Carrera = {
  obtenerTodos: () => {  // Cambio de "obtenerTodas" a "obtenerTodos"
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM carreras'; // Ajusta la consulta según tu base de datos
      db.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result); // Devuelve las carreras
        }
      });
    });
  }
};

module.exports = Carrera;

