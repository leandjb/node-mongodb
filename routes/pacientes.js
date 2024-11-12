const express = require('express');
const router = express.Router();
const { listar, crear, actualizar, eliminar, encontrar } = require('../middlewares/pacientes');
const {
  uuidParamValidator,
  crearPacienteValidator
} = require('../middlewares/validators');

router.get('/', listar);

router.post('/', crearPacienteValidator, crear);

router.patch('/:id', uuidParamValidator, actualizar);

router.delete('/:id', uuidParamValidator, eliminar);

router.get('/:id', uuidParamValidator, encontrar);

module.exports = router;
