const express = require('express')
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecto'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioBD
        }, process.env.KEY, { expiresIn: process.env.CADUCIDAD_TOKEN })
        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    });
});

//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log('name:', payload.name);
    console.log('email:', payload.email);
    console.log('picture:', payload.picture);

    return {
        name:payload.name,
        email:payload.email,
        picture:payload.picture,
        google:true
    }
}


app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    console.log('token:', token);
    
    let googleUser = await verify(token).catch(e=>{
        return res.status(403).json({
            ok:false,
            err:e
        });
    });

    Usuario.findOne({email:googleUser.email},(err,usuarioBD)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err : {
                    message:'Usuario no encontrado'
                }
            });
        };

        if (usuarioBD) {
            if (usuarioBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    err:{
                        message:'Debe usar la autenticacion de Google'
                    }
                });    
            } else {
                let token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.KEY, { expiresIn: process.env.CADUCIDAD_TOKEN });
                
                return res.json({
                    ok:true,
                    usuario:usuarioBD,
                    token
                });
            }
        } else {
            //Si el usuario es nuevo
            let usuario = new Usuario();
            usuario.nombre = googleUser.name;
            usuario.email = googleUser.email;
            usuario.img = googleUser.picture;
            usuario.google = true;
            usuario.password = ':)';//Se envia algo ya que el campo es requerido

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
        
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
});


module.exports = app;