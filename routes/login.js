var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');


//metodo del login
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        //si da un error el encotrar el usuario va a entrar este if 
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }

        //validar si el email es incorrecto
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Datos incorrectos -email', //quitar el -email para no dar pista del error
                errors: err
            });
        }

        //validar si el password es incorrecto
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Datos incorrectos -password', //quitar el -password para no dar pista del error
                errors: err
            });
        }

        //crear un token
        usuarioDB.password = ':)';
        // se pone un usuario luego lo hacemos unico nustro token (SEED) y la fecha de expiracion
        var token = jwt.sign({ Usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas

        res.status(200).json({
            ok: true,
            usuarioDB: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });

});



module.exports = app;