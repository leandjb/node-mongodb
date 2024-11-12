const mongoose = require('mongoose');
const createError = require('http-errors');
const { ObjectId } = mongoose.Schema.Types;
const usuarioIdPlugin = require('./usuarioIdPlugin');

// Nombre del modelo
const nobreModelo = 'Paciente';

// sub schemas
const vacuna = mongoose.Schema(
    {
        nombre: { type: String, lowercase: true, required: true },
        fechaDeAplicacion: { type: Date, required: true }
    },
    { _id: false }
);

// define schema
const schemaDef = {
    nombre: {
        index: true,
        type: String,
        required: true,
        lowercase: true
    },
    sexo: {
        type: String,
        lowercase: true,
        enum: ['macho', 'hembra'],
        default: 'hembra'
    },
    fechaDeNacimiento: { type: Date, required: true },
    vacunas: [vacuna], //default []
    especie: {
        type: String,
        lowercase: true,
        required: true
    },
    raza: { //sin default -> undefined
        type: String,
        lowercase: true
    },
    proximaCita: Date, //sin default -> undefined
};

// opciones del schema
const schemaOps = {
    methods: {     // metodos de documento
    },
    statics: {     // metodos de coleccion
        async encuentraPorIdYUsuario(id, usuarioId) {
            return await mongoose.model(nobreModelo).findOne({ _id: id, usuarioId });
        },
        async listarPorUsuario(usuarioId) {
            return await mongoose.model(nobreModelo).find({ usuarioId }).sort({ nombre: 1 });
        },
        async eliminarPorUsuario(id, usuarioId) {
            borrado = await mongoose.model(nobreModelo).deleteOne({ _id: id, usuarioId });
            return borrado.deletedCount > 0;
        },
        async actualizarPorUsuario(id, usuarioId, updates) {
            delete updates.usuarioId; // impedir cambio de usuario relacionado

            const paciente = await mongoose.model(nobreModelo).findOne({ _id: id, usuarioId });
            if (paciente === null) {
                throw (createError(404));
            }
            // model.updateOne({_id: id, usuarioId}, {$set: updates})
            Object.assign(paciente, updates);
            try {
                await paciente.validate();
            } catch (error) {
                throw (createError(400, error));
            }
            await paciente.save();
        }
    }
};

// crear el schema
const schema = new mongoose.Schema(schemaDef, schemaOps);

// aplicar plugins !!! Siempre antes de crear el modelo !!!
schema.plugin(usuarioIdPlugin);

// crear modelo
const Paciente = mongoose.model(nobreModelo, schema, 'pacientes');

module.exports = Paciente;
