const Practicante = require('../models/practicanteModel');
const Carrera = require('../models/carreraModel'); // Ajusta la ruta al archivo de tu modelo
const db = require('../models/db');

const practicantesController = {};

// Mostrar lista de practicantes (index.ejs)
practicantesController.index = (req, res) => {
  // Obtener los practicantes y las carreras en paralelo
  Promise.all([
    Practicante.obtenerTodos(), // Obtener todos los practicantes
    Carrera.obtenerTodos() // Obtener todas las carreras
  ])
  .then(([practicantes, carreras]) => {
    const carrerasMap = carreras.reduce((acc, carrera) => {
      acc[carrera.id] = carrera.nombre; // Suponiendo que "id" y "nombre" son los campos de carrera
      return acc;
    }, {});

    // Asociar el nombre de la carrera a cada practicante usando el carrera_id
    practicantes.forEach(practicante => {
      practicante.carrera_nombre = carrerasMap[practicante.carrera_id];
    });

    // Pasar los practicantes con el nombre de la carrera a la vista
    res.render('practicantes/index', { practicantes });
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Error al obtener practicantes o carreras');
  });
};

// Mostrar detalles de un practicante (show.ejs)
practicantesController.mostrar = (req, res) => {
  const id = req.params.id;
  Practicante.obtenerPorId(id)
    .then(practicante => {
      if (practicante) {
        res.render('practicantes/show', { practicante });
      } else {
        res.status(404).send('Practicante no encontrado');
      }
    })
    .catch(err => {
      res.status(500).send('Error al obtener el practicante');
    });
};

// Mostrar formulario para crear (create.ejs)
practicantesController.mostrarFormularioCrear = (req, res) => {
  // Suponiendo que tienes una función para obtener todas las carreras
  Carrera.obtenerTodos()
    .then(carreras => {
      res.render('practicantes/create', { carreras }); // Asegúrate de pasar la variable 'carreras'
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error al obtener las carreras');
    });
};

practicantesController.crear = (req, res) => {
  const datos = req.body;  // Datos del formulario

  // Asegurémonos de que 'datos.carrera_id' es un valor válido
  if (!datos.nombre_completo || !datos.correo || !datos.carrera_id || !datos.fecha_inicio) {
    return res.status(400).send('Faltan campos obligatorios');
  }

  // Validar si el correo ya existe
  db.query('SELECT * FROM practicantes WHERE correo = ?', [datos.correo], (err, result) => {
    if (err) {
      return res.status(500).send('Error al verificar correo');
    }
    if (result.length > 0) {
      return res.status(400).send('El correo ya está registrado');
    }

    // Si el correo es válido, continuar con la creación
    Practicante.crear(datos)
      .then(() => {
        res.redirect('/practicantes');
      })
      .catch(err => {
        console.error(err);  // Log para depuración
        res.status(500).send('Error al crear el practicante');
      });
  });
};

// Mostrar formulario para editar (edit.ejs)
practicantesController.mostrarFormularioEditar = (req, res) => {
  const id = req.params.id;

  // Obtener el practicante por ID
  Practicante.obtenerPorId(id)
    .then(practicante => {
      if (practicante) {
        // Obtener todas las carreras
        Carrera.obtenerTodos()
          .then(carreras => {
            // Renderizar la vista de edición, pasando tanto el practicante como las carreras
            res.render('practicantes/edit', { practicante, carreras });
          })
          .catch(err => {
            res.status(500).send('Error al obtener las carreras');
          });
      } else {
        res.status(404).send('Practicante no encontrado');
      }
    })
    .catch(err => {
      res.status(500).send('Error al obtener practicante para editar');
    });
};


// Procesar actualización de practicante
practicantesController.actualizar = (req, res) => {
  const id = req.params.id;
  const datos = req.body;
  Practicante.actualizar(id, datos)
    .then(() => {
      res.redirect('/practicantes');
    })
    .catch(err => {
      res.status(500).send('Error al actualizar practicante');
    });
};

// Eliminar practicante
practicantesController.eliminar = (req, res) => {
  const id = req.params.id;
  Practicante.eliminar(id)
    .then(() => {
      res.redirect('/practicantes');
    })
    .catch(err => {
      res.status(500).send('Error al eliminar practicante');
    });
};

module.exports = practicantesController;
