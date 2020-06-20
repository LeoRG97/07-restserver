const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la categoría es requerido']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El ID del usuario es requerido'],
    }
});


module.exports = mongoose.model( 'Categoria', categoriaSchema );