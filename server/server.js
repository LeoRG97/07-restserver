require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded (middleware)
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json (middleware)
app.use(bodyParser.json())
 
app.get('/usuario', function (req, res) {
  res.json('get Usuario');
});
 
app.post('/usuario', function (req, res) {

    let body = req.body;
    if(body.nombre === undefined){
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario',
        });
    } else {
        res.json(body);
    }
    
    
});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    res.json({
        id,
        message: 'put0 usuario',
    });

});

app.delete('/usuario', function (req, res) {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Servidor escuchando en puerto', process.env.PORT);
});