const express = require('express');
const _ = require('underscore');
const Categoria = require('../models/categoria');

let { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

let app = express();

//Mostrar todas las categorías
app.get('/categoria', verifyToken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            Categoria.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo: count,
                });
            });
        });

});

//Mostrar una categoría por ID
app.get('/categoria/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada',
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });
});

//Crear nueva categoría (y retornar dicho objeto)
//agrega el ID del usuario al objeto creado (se requiere)
app.post('/categoria', verifyToken, (req, res) => {
    //req.usuario.id
    let body = req.body;
    let usuario = req.usuario; //viene del middleware "verifyToken"

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: usuario._id,
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            //error interno del servidor
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!categoriaDB) {
            //no se logró crear la categoría
            return res.status(400).json({
                ok: false,
                err,
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
        })
    })
});

//Actualizar la categoría (el nombre)
app.put('/categoria/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body; //únicamente se podrá modificar el nombre

    let descCategoria = {
        nombre: body.nombre,
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true },
        (err, newCategoria) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                });
            }

            if (!newCategoria) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoría no encontrada',
                    }
                });
            }

            res.json({
                ok: true,
                categoria: newCategoria,
                meesage: 'La categoría ha sido actualizada'
            });

        })


});

//eliminar físicamente un ID, sólo el Admin lo podrá hacer
app.delete('/categoria/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada',
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'Se ha eliminado la categoría',
        })
    })
});

module.exports = app;