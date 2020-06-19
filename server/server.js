require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded (middleware)
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json (middleware)
app.use(bodyParser.json())

//Configuración global de rutas
app.use( require('./routes/index') );
 
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