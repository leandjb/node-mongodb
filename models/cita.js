const mongoose = require('mongoose');
const createError = require('http-errors');
const { ObjectId } = mongoose.Schema.Types;
const usuarioIdPlugin = require('./usuarioIdPlugin');

// Nombre del modelo
const nobreModelo = 'Cita';

// define schema
const schemaDef = {
    fecha: { type: Date, required: true },
    nombrePaciente: { type: String, required: true },
    pacienteId: {
        type: ObjectId,
        required: true
    }
}

const schemaOps = {
    methods: {     // metodos de documento
    },
    statics: {     // metodos de coleccion
        async encuentraPorIdYUsuario(id, usuarioId) {
            return await mongoose.model(nobreModelo).findOne({ _id: id, usuarioId });
        },
        async listarPorUsuario(usuarioId) {
            return await mongoose.model(nobreModelo).find({ usuarioId }).sort({ nombrePaciente: 1 });
        },
        async eliminarPorUsuario(id, usuarioId) {
            borrado = await mongoose.model(nobreModelo).deleteOne({ _id: id, usuarioId });
            return borrado.deletedCount > 0;
        },
        async actualizarPorUsuario(id, usuarioId, updates) {
            delete updates.usuarioId; // impedir cambio de usuario relacionado
            console.log('updates sin usuarioId', updates);

            const cita = await mongoose.model(nobreModelo).findOne({ _id: id, usuarioId });
            if (cita === null) {
                console.log('falla cita');
                throw (createError(404));
            }
            const pacienteId = updates.pacienteId || cita.pacienteId;
            const paciente = await mongoose.model('Paciente').findOne({_id: pacienteId, usuarioId});
            if (paciente === null) {
                console.log('sin paciente');
                throw (createError(400, { error: new Error('pacienteId no es valido') }));
            }
            updates.nombrePaciente = paciente.nombre;
            // model.updateOne({_id: id, usuarioId}, {$set: updates})
            Object.assign(cita, updates);
            try {
                await cita.validate();
            } catch (error) {
                console.log('algo salio mal');
                throw (createError(400, error));
            }
            await cita.save();
        }
    }
}

// crear el schema
const schema = new mongoose.Schema(schemaDef, schemaOps);

// aplicar hooks !!! Siempre antes de crear el modelo !!!
schema.pre('save', async function(next) {
    try {
        const paciente = await mongoose.model("Paciente").findById(this.pacienteId);
        if (paciente !== null) {
            this.nombrePaciente = paciente.nombre;
        }
        next();
    } catch (error) {
        next(error);
    }
});

schema.post('save', async function (cita, next) {
    const { pacienteId, usuarioId, fecha } = cita;
    try {
        await mongoose.model('Paciente')
            .actualizarPorUsuario(pacienteId, usuarioId, { proximaCita: fecha });
    } catch (error) {
        next(error);
    }
    next();
})

// aplicar plugins !!! Siempre antes de crear el modelo !!!
schema.plugin(usuarioIdPlugin);

// crear modelo
const Cita = mongoose.model(nobreModelo, schema, 'citas');

module.exports = Cita
