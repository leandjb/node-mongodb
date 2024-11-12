/**
 * Plugin para agregar el campo usuarioId y su validacion
 * a los modelos protegidos por autenticacion
 * 
 */
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

module.exports = function (schema, options) {
    schema.add({
        usuarioId: {
            type: ObjectId,
            required: true,
            validate: async function validator(value) {
                let usuario = null;
                try {
                    usuario = await mongoose.model('Usuario').findById(value, { _id: 1 });
                } catch (error) {
                    console.log(error);
                }
                return usuario === null ? false : true;
            }
        }
    })
};
