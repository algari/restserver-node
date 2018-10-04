const express = require('express')
const app = express();
const bcrypt = require('bcryptjs');
const _ = require('underscore');

const Usuario = require('../models/usuario');

app.get('/usuario', function (req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5
    limite = Number(limite);
    //El segundo parametro defino cuales campos retornar
    Usuario.find({estado:true},'nombre email role estado img')
    .skip(desde)
    .limit(limite)
    .exec((err,usuariosDB)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Usuario.count({estado:true},(err,conteo)=>{

            res.json({
                ok:true,
                usuarios:usuariosDB,
                cuantos:conteo
            })
        });
    });
})

app.post('/usuario', function (req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.roleno
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pic(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBD
        })
    });
})

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        estado:false
    }
    
    //Elimina BD
    //Usuario.findByIdAndDelete(id, (err, usuarioBD)=>{
    Usuario.findByIdAndUpdate(id,cambiaEstado,{ new: true},(err,usuarioBD)=>{        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (usuarioBD === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message:'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok:true,
            usuario:usuarioBD
        })

    });
})

module.exports = app;
