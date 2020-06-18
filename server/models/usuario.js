const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido',
};

//obtener el cascarón para crear esquemas de mongoose
let Schema = mongoose.Schema;

//declaración de un nuevo esquema
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario'],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles,
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },

});

usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject(); //obtener las propiedades y métodos del objeto
    delete userObject.password;

    return userObject;

}

usuarioSchema.plugin( uniqueValidator, { 
    message: '{PATH} debe de ser único'
})

module.exports = mongoose.model( 'Usuario', usuarioSchema );

