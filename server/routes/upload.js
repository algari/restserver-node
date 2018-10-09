const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const path = require('path');
const fs = require('fs');

app.put('/upload/:tipo/:id', function (req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    let tiposValidos = ['productos','usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err:{
                message:'Tipos permitidos son: ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreArchivoSplit = archivo.name.split('.');
    let extension = nombreArchivoSplit[nombreArchivoSplit.length -1];
    //Extensiones permitidas
    let extensionesValidas = ['png','jpg','git','jpeg'];

    if (extensionesValidas.indexOf(extension)< 0 ) {
        return res.status(400).json({
            ok: false,
            err:{
                message:'Extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext:extension
            }
        });
    }

    //cambiar nombre archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, function (err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
       /*  res.json({
            ok: true,
            message: 'Archivo subido!'
        }); */
        if (tipo === 'usuarios') {
            imagenUsuario(id,res,nombreArchivo)    
        } else if (tipo === 'productos') {
            imagenProducto(id,res,nombreArchivo)  
        }
        
    });
});

function imagenProducto(id,res,nombreArchivo){
    Producto.findById(id,(err,productoBD)=>{
        if (err) {
            borraArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            borraArchivo(nombreArchivo,'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message:'Producto no encontrado'
                }
            });
        }

        borraArchivo(productoBD.img,'productos');

        productoBD.img = nombreArchivo;

        productoBD.save( (err,productoActualizado)=>{
            res.json({
                ok: true,
                producto:productoActualizado,
                img: nombreArchivo
            });
        });

    });
   
}

function imagenUsuario(id,res,nombreArchivo){
    Usuario.findById(id,(err,usuarioBD)=>{
        if (err) {
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            borraArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message:'Usuario no encontrado'
                }
            });
        }

        borraArchivo(usuarioBD.img,'usuarios');

        usuarioBD.img = nombreArchivo;

        usuarioBD.save( (err,usuarioActualizado)=>{
            res.json({
                ok: true,
                usuario:usuarioActualizado,
                img: nombreArchivo
            });
        });

    });
}

function borraArchivo(nombreArchivo,tipo){
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${nombreArchivo}`);

    //Elimina el archivo del FS
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;