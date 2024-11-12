const mongoose = require('mongoose');
const crypto = require('crypto');
const createError = require('http-errors');

// Nombre del modelo
const nobreModelo = 'Usuario';

// define schema
const schemaDef = {
    username: String,
    salt: String,   // genera password protegido
    hash: String    // password protegido
};

// opciones del schema
const schemaOps = {
    methods: {     // metodos de documento
        async generaSaltYHash(password) { // genera password protegido para este usuario
            const salt = crypto.randomBytes(32).toString('hex');
            const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
            this.salt = salt;
            this.hash = hash;
        },
        validarPassword(password) { // validar que password no protegido genera password protegido
            const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
            return this.hash === hash;
        }
    },
    statics: {     // metodos de coleccion
        async verify(username, password, done) { // verificacion para estrategia local de passport
            let usuarioAutenticado = false;
            let error = null;
            try {
                let usuario = await mongoose.model(nobreModelo).findOne({username});
                if (usuario && usuario.validarPassword(password)) {
                    usuarioAutenticado = usuario;
                }
            } catch(e) {
                error = e;
            } finally {
                return done(error, usuarioAutenticado);
            }
        },
        serializeUser(user, done) { // poner datos del usuario en la cookie
           done(null, user.id);
        },
        async deserializeUser(id, done) { // buscar al usuario referido en la cookie
            let usuario = undefined;
            let error = undefined;
            try {
                usuario = await mongoose.model(nobreModelo).findById(id);
                error = usuario ? null : createError(404);
            } catch (e) {
                error = e;
            } finally {
               done(error, usuario);
            }
        }
    }
};

// crear el schema
const schema = new mongoose.Schema(schemaDef, schemaOps);

// crear modelo
const Usuario = mongoose.model(nobreModelo, schema, 'usuarios');

module.exports = Usuario;
