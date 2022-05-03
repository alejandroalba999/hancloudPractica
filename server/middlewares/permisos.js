const jwt = require('jsonwebtoken');
require('../config/config');


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
        jwt.verify(token, process.env.SEED, (err, decoded) => {
            if (err) {
                return console.log(err.name)
            }
            console.log(req.originalUrl);
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