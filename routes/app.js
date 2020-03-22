var express = require('express');

var app = express();


//ruta
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});


//exportar fuera del archivo
module.exports = app;