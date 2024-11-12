const createError = require('http-errors');
const Paciente = require('../models/paciente')

// listado de pacientes
async function listar(req, res, next) {
    try {
        const pacientes = await Paciente.listarPorUsuario(req.user.id);
        res.json(pacientes);
    } catch (error) {
        next(error);
    }
}

// encuentra paciente por su id
async function encontrar(req, res, next) {
    try {
        const id = req.params.id;
        const usuarioId = req.user.id;
        const paciente = await Paciente.encuentraPorIdYUsuario(id, usuarioId);
        if (paciente === null) {
            return next(createError(404));
        }
        res.json(paciente);
    } catch (error) {
        next(error);
    }
}

// crear paciente
async function crear(req, res, next) {
    const paciente = new Paciente(req.body);
    try {
        paciente.save();
    } catch (error) {
        next(error);
    }
    res.json(paciente);
}

// actualizar paciente
async function actualizar(req, res, next) {
    try {
        const id = req.params.id;
        const usuarioId = req.user._id;
        const updates = req.body;
        await Paciente.actualizarPorUsuario(id, usuarioId, updates);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

// eliminar una paciente
async function eliminar(req, res, next) {
    try {
        const resultado = await Paciente.eliminarPorUsuario(req.params.id, req.user.id);
        return resultado ? res.sendStatus(200) : next(createError(404));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listar,
    crear,
    actualizar,
    eliminar,
    encontrar
};
