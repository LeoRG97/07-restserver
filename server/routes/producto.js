const express = require('express');
const { verifyToken } = require('../middlewares/authentication');
const _ = require('underscore');
let Producto = require('../models/producto');

let app = express();

// Obtener lista de productos
app.get('/productos', verifyToken, (req, res) => {
    //populate (usuario y categoria)
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo,
                });
            });
        });
});

//Obtener un producto por ID
app.get('/productos/:id', verifyToken, (req, res) => {
    //populate (usuario y categoría)
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!productoDB) {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err,
                    });
                }
            }

            res.json({
                ok: true,
                producto: productoDB,
            });
        });
});

//Buscar productos
app.get('/productos/buscar/:termino', verifyToken, (req, res) => {

    let termino = req.params.termino;

    let regExp = new RegExp(termino, 'i');

    Producto.find({nombre: regExp})
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            res.json({
                ok: true,
                productos,
            });
        });

});

// Crear un producto
app.post('/productos', verifyToken, (req, res) => {

    let body = req.body;
    let usuario = req.usuario;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuario._id,
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        //estatus para confirmar registro
        res.status(201).json({
            ok: true,
            producto: productoDB,
        });
    });

});

//Actualizar un producto
app.put('/productos/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'categoria', 'disponible', 'descripcion']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, newProd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!newProd) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado',
                }
            });
        }

        res.json({
            ok: true,
            producto: newProd,
            message: 'El producto ha sido actualizado'
        })
    })
});

//Eliminar un producto
app.delete('/productos/:id', verifyToken, (req, res) => {
    //baja lógica con la propiedad "disponible"

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado',
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            message: 'Se ha eliminado este producto',
        });

    });

});


module.exports = app;