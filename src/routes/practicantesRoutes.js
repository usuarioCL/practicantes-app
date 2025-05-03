const express = require('express');
const router = express.Router();
const practicantesController = require('../controllers/practicantesController');

// Mostrar todos los practicantes
router.get('/', practicantesController.index);

// Mostrar formulario para crear practicante
router.get('/crear', practicantesController.mostrarFormularioCrear);

// Procesar formulario de creación
router.post('/crear', practicantesController.crear);

// Mostrar detalles de un practicante
router.get('/:id', practicantesController.mostrar);

// Mostrar formulario para editar practicante
router.get('/:id/editar', practicantesController.mostrarFormularioEditar);

// Procesar formulario de edición
router.put('/:id', practicantesController.actualizar);

// Eliminar practicante (opcionalmente usando POST)
router.post('/:id/eliminar', practicantesController.eliminar);

module.exports = router;
