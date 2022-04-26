const express = require('express');
const app = express.Router();
const ProductoModel = require('../../models/producto/producto.model');

app.get('/', async (req, res) => {
    try {
        const obtenerProductos = await ProductoModel.find();
        if (obtenerProductos.length == 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontrarón productos en la base de datos',
                cont: {
                    obtenerProductos
                }
            })
        }
        return res.status(200).json({
            ok: true,
            msg: 'Se obtuvierón los productos de manera exitosa',
            cont: {
                obtenerProductos
            }
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                error
            }
        })
    }
})
app.post('/', async (req, res) => {
    try {
        const body = req.body;
        const productoBody = new ProductoModel(body);
        const err = productoBody.validateSync();
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio uno o mas campos favor de validar',
                cont: {
                    err
                }
            })
        }
        const encontroProducto = await ProductoModel.findOne({ strNombre: body.strNombre }, { strNombre: 1 });
        if (encontroProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El producto ya se encuentra registrado en la base de datos',
                cont: {
                    encontroProducto
                }
            })
        }
        const productoRegistrado = await productoBody.save();
        return res.status(200).json({
            ok: true,
            msg: 'El producto se registro de manera exitosa',
            cont: {
                productoRegistrado
            }
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                error
            }
        })
    }


})
app.put('/', async (req, res) => {
    try {
        const _idProducto = req.query._idProducto;
        if (!_idProducto || _idProducto.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idProducto ? 'El identificador no es valido se requiere un id de 24 caractéres' : 'No se recibio el identificador',
                cont: {
                    _idProducto
                }
            })
        }
        const encontroProducto = await ProductoModel.findOne({ _id: _idProducto });
        if (!encontroProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El producto no se encuentra registrado',
                cont: {
                    _idProducto
                }
            })
        }
        // const actualizarProducto = await ProductoModel.updateOne({ _id: _idProducto }, { $set: { ...req.body } })
        const actualizarProducto = await ProductoModel.findByIdAndUpdate(_idProducto, { $set: { ...req.body } }, { new: true });
        if (!actualizarProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El producto no se logro actualizar',
                cont: {
                    ...req.body
                }
            })
        }
        return res.status(200).json({
            ok: true,
            msg: 'El producto se actualizo de manera exitosa',
            cont: {
                productoAnterior: encontroProducto,
                productoActual: actualizarProducto
            }
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                error
            }
        })
    }

})
app.delete('/', async (req, res) => {
    try {
        const _idProducto = req.query._idProducto;
        if (!_idProducto || _idProducto.length != 24) {
            return res.status(400).json({
                ok: false,
                msg: _idProducto ? 'El identificador de producto es invalido' : 'No se recibio un identificador de producto',
                cont: {
                    _idProducto
                }
            })
        }
        const encontrarProducto = await ProductoModel.findOne({ _id: _idProducto, blnEstado: true });
        if (!encontrarProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El identificador del producto no se encuentra en la base de datos',
                cont: {
                    _idProducto: _idProducto
                }
            })
        }
        // Esta funcion elimina de manera definitiva el producto
        // const eliminarProducto = await ProductoModel.findOneAndDelete({ _id: _idProducto });
        //Esta funcion solo cambia el estado del producto
        const desactivarProducto = await ProductoModel.findOneAndUpdate({ _id: _idProducto }, { $set: { blnEstado: false } }, { new: true })
        if (!desactivarProducto) {
            return res.status(400).json({
                ok: false,
                msg: 'El producto no se logro desactivar de la base de datos',
                cont: {
                    desactivarProducto
                }
            })
        }
        return res.status(200).json({
            ok: true,
            msg: 'El producto se desactivo exitosamente',
            cont: {
                desactivarProducto
            }
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor',
            cont: {
                error
            }
        })
    }
})


module.exports = app;