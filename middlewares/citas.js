const createError = require('http-errors');
const Cita = require('../models/cita')

// listado de citas
async function listar(req, res, next) {
    try {
        const citas = await Cita.listarPorUsuario(req.user.id);
        res.json(citas);
    } catch (error) {
        next(error);
    }
}

// encuentra cita por su id
async function encontrar(req, res, next) {
    try {
        const id = req.params.id;
        const usuarioId = req.user.id;
        const cita = await Cita.encuentraPorIdYUsuario(id, usuarioId);
        if (cita === null) {
            return next(createError(404));
        }
        res.json(cita);
    } catch (error) {
        next(error);
    }
}

// crear cita
async function crear(req, res, next) {
    const cita = new Cita(req.body);
    try {
        cita.save();
    } catch (error) {
        next(error);
    }
    res.json(cita);
}

// actualizar cita
async function actualizar(req, res, next) {
    try {
        const id = req.params.id;
        const usuarioId = req.user.id;
        const updates = req.body;
        await Cita.actualizarPorUsuario(id, usuarioId, updates);
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

// eliminar una cita
async function eliminar(req, res, next) {
    try {
        const resultado = await Cita.eliminarPorUsuario(req.params.id, req.user.id);
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
