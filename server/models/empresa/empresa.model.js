const mongoose = require('mongoose');

let schemaEmpresa = mongoose.Schema({
    blnEstado: {
        type: Boolean,
        default: true,
    },
    strNombre: {
        type: String,
        required: [true, 'No se recibio el strNombre favor de ingresarlo']
    },
    nmbTelefono: {
        type: Number,
        required: [true, 'No se recibio el nmbTelefono favor de ingresarlo']
    },
    nmbCodigoPostal: {
        type: Number,
        required: [true, 'No se recibio el nmbCodigoPostal favor de ingresarlo']
    },
    strCiudad: {
        type: String,
        required: [true, 'No se recibio el nmbPrecio favor de ingresarlo']
    }
})

module.exports = mongoose.model('empresa', schemaEmpresa);