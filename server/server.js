//Carga el archivo conf.js con las propiedades
require('./config/config');
const express = require('express')
const app = express();

const bodyParser = require('body-parser');
//Parser application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
//Parser application/json
app.use(bodyParser.json());

//Obtiene la rutas globales
app.use(require('./routes/index'));

const mongoose = require('mongoose');
mongoose.connect(process.env.URL_DB,(err)=>{
  if (err) {
    throw err;
  }
  console.log('Conectado a MongoBD', );
});

app.listen(process.env.PORT,()=>{
  console.log('Escuchando..: ', process.env.PORT);
})

