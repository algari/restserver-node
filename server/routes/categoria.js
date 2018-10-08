const express = require('express')
const app = express();
const _ = require('underscore');

const Categoria = require('../models/categoria');

const {verificaToken,verificaAdminRol} = require('../middelwares/authentication');

app.get('/categoria', verificaToken, (req, res)=> {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5
    limite = Number(limite);
    //El segundo parametro defino cuales campos retornar
    Categoria.find({},'descripcion')
    .skip(desde)
    .limit(limite)
    //El segundo parametro defino cuales campos retornar
    .populate('usuario','nombre email')
    .sort('descripcion')
    .exec((err,categoriaBD)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Categoria.count({},(err,conteo)=>{

            res.json({
                ok:true,
                categoria:categoriaBD,
                cuantos:conteo
            })
        });
    });
})

app.get('/categoria/:id', verificaToken, (req, res)=> {
    let id = req.params.id;
    Categoria.findById(id,(err,categoriaBD)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok:true,
            categoria:categoriaBD,
        })
        
    });
})

app.post('/categoria', verificaToken, (req,res)=>{

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

});

app.put('/categoria/:id', verificaToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    console.log('body:', body);

    Categoria.findByIdAndUpdate(id, body, {context: 'query' , new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        })
    });
})

app.delete('/categoria/:id', [verificaToken,verificaAdminRol], function (req, res) {
    let id = req.params.id;
    
    //Elimina BD
    Categoria.findByIdAndDelete(id, (err, categoriaBD)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (categoriaBD === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message:'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok:true,
            categoria:categoriaBD
        })

    });
})


module.exports = app;