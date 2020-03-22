var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();


var Usuario = require('../models/usuario');

//  =============================================================================================   //
//  Obtener todos los usuarios
//  consulta para que busque todos en la tabal de usuario y solo muetrame nombre email img role
//  y luego ejecutalo (exec)
//  =============================================================================================   //
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                //si da un error el encotrar el usuario va a entrar este if 
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            });


});



//  =============================================================================================   //
//  crear un nuevo usuario 
//  =============================================================================================   //

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //verificar si existe usuario con ese id
    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: ' No existe un usuario con ese id' }
            });
        }


        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            //muetra una cara feliz porque esta mandndo una cara feliz
            usuarioGuardado.password = ':)';

            //recurso creado
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });


    });

});


//  =============================================================================================   //
//  crear un nuevo usuario 
//  =============================================================================================   //


app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    //creamos un objeto de tipo usuario y inicializar valores
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), //el bcrypt sirve para empricptar la contraseña
        img: body.img,
        role: body.role
    });

    //funcion para guardar 
    usuario.save((err, usuarioGuardado) => {

        //si da un error el encotrar el usuario va a entrar este if 
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        //recurso creado
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});


//  =============================================================================================   //
//                            Borar un usuario por el id
//  =============================================================================================   //

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        //recurso creado
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });


    });
});

//exportar fuera del archivo
module.exports = app;