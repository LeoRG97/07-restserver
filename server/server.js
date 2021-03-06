require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded (middleware)
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json (middleware)
app.use(bodyParser.json())

//habilitar la carpeta "public"
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URL_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}, (err, resp) => {
  if (err) throw err;
  console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
  console.log('Servidor escuchando en puerto', process.env.PORT);
});