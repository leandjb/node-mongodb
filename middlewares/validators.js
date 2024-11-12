const createError = require('http-errors');
const { param, body, validationResult } = require('express-validator');
const Paciente = require('../models/paciente');
const Cita = require("../models/cita");

function crearErrorOContinuar(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(createError(400, errors));
    }
    return next();
}

module.exports = {
    uuidParamValidator: [
        param('id').trim().escape().isMongoId(),
        crearErrorOContinuar
    ],
    registraUsuarioValidator: [
        body('username').trim().escape().notEmpty().isEmail(),
        body('password').trim().escape().notEmpty().isString(),
        crearErrorOContinuar
    ],
    crearPacienteValidator: [
        body().custom(async (requestBody, { req }) => {
            try {
                requestBody.usuarioId = req.user.id;
                const paciente = await new Paciente(requestBody);
                await paciente.validate();
                req.body.usuarioId = req.user.id;
                return Promise.resolve(true);
            } catch (error) {
                return Promise.reject(error);
            }
        }),
        crearErrorOContinuar
    ],
    crearCitaValidator: [
        body().custom(async (requestBody, { req }) => {
            try {
                const usuarioId = req.user.id;
                const pacienteId = requestBody.pacienteId;
                const paciente = await Paciente.findOne({ _id: pacienteId, usuarioId });
                if (paciente === null) {
                    return Promise.reject(createError(400, new Error("pacienteId no es valido")));
                }
                requestBody.usuarioId = usuarioId;
                requestBody.nombrePaciente = paciente.nombre;
                const cita = await new Cita(requestBody);
                console.log("llego aqui");
                await cita.validate();
                req.body.nombrePaciente = paciente.nombre;
                req.body.usuarioId = usuarioId;
                return Promise.resolve(true);
            } catch (error) {
                return Promise.reject(error);
            }
        }),
        crearErrorOContinuar
    ]
}
