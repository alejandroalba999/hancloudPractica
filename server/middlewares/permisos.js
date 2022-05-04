const jwt = require('jsonwebtoken');
require('../config/config');
const UsuarioModel = require('../models/usuario/usuario.model');
const RolModel = require('../models/permisos/rol.model')
const ApiModel = require('../models/permisos/api.model')

const verificarAcceso = async (req, res, next) => {
    try {
        const token = req.get('token')
        if (!token) {
            return res.status(400).json({
                ok: false,
                msg: 'No se recibio un token valido',
                cont: {
                    token
                }
            })
        }
        jwt.verify(token, process.env.SEED, async (err, decoded) => {
            if (err) {
                return console.log(err.name)
            }
            const obtenerUsuarios = await UsuarioModel.aggregate(
                [
                    {
                        $lookup: {
                            from: RolModel.collection.name,
                            let: { idObjRol: '$_idObjRol' },
                            pipeline: [
                                // { $match: { blnEstado: true } }
                                { $match: { $expr: { $eq: ['$$idObjRol', '$_id'] } } },
                                {
                                    $lookup: {
                                        from: ApiModel.collection.name,
                                        let: { arrApis: '$arrObjIdApis' },
                                        pipeline: [
                                            { $match: { $expr: { $in: ['$_id', '$$arrApis'] } } },
                                        ],
                                        as: 'apis'
                                    }
                                },
                                {
                                    $project: {
                                        strNombre: 1,
                                        strDescripcion: 1,
                                        blnRolDefault: 1,
                                        blnEstado: 1,
                                        apis: 1
                                    }
                                }
                            ],
                            as: 'rol'
                        }
                    },
                    {
                        $project: {
                            strNombre: 1,
                            strApellido: 1,
                            strEmail: 1,
                            strNombreUsuario: 1,
                            strDireccion: '$strDireccion',
                            empresa: {
                                $arrayElemAt: ['$empresa', 0]
                            },
                            rol: {
                                $arrayElemAt: ['$rol', 0]
                            },
                        }
                    }
                ]
            );
            console.log(obtenerUsuarios);
            next();
        })

    } catch (error) {
        return res.status(500).json(
            {
                ok: false,
                msg: 'Error en el servidor',
                cont:
                {
                    error
                }
            })
    }
}

module.exports = { verificarAcceso }