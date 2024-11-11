const mongoose = require('mongoose');

// Nombre del modelo
const nobreModelo = 'Gatito';

// define schema
const schemaDef = {
    bigotes: Number,

    _idHumano: mongoose.Schema.Types.ObjectId,

    nombre: { type: String, default: '' },

    ternurometro: { type: Number, min: 0, max: 10 },

    juguetesFavoritos: [String],

    pelaje: {
        color: String,
        largo: String
    },

    lugaresFavoritos: [{
        nombre: String,
        momentoDelDia: String
    }],
};

// opciones del schema
const schemaOps = {
    methods: {
        saluda() {
            return `Hola. Me llamo ${this.nombre}`
        }
    },

    statics: {
        encuentraPorNombre(nombre) {
            return mongoose.model(nobreModelo).find({ nombre: new RegExp(nombre, 'i') })
        }
    }
};

// crear el schema
const schema = new mongoose.Schema(schemaDef, schemaOps);

// crear modelo
const Gatito = mongoose.model(nobreModelo, schema, 'gatitos');

module.exports = Gatito;
