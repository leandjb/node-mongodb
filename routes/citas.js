const express = require('express');
const router = express.Router();
const { listar, crear, actualizar, eliminar, encontrar } = require('../middlewares/citas');
const {
  uuidParamValidator,
  crearCitaValidator
} = require('../middlewares/validators');

router.get('/', listar);

router.post('/', crearCitaValidator, crear);

router.patch('/:id', uuidParamValidator, actualizar);

router.delete('/:id', uuidParamValidator, eliminar);

router.get('/:id', uuidParamValidator, encontrar);

module.exports = router;
