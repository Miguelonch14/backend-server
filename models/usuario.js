var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

//Roles que solo va a permitir
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};


//objeto para llenar la colleccion usuarios
var usuarioSchema = new Schema({

    //definimos los campos que va a tener usuario y el tipo de dato y si es obligatorio
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contrseña es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: "USER_ROLE", enum: rolesValidos }

});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });


//sirve para usar el esquema afuera y lleva dos campos nombre y objeto que va a relacionar 
module.exports = mongoose.model('Usuario', usuarioSchema);