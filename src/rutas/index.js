const {Router} = require('express')
const {body, query} = require('express-validator')
const rutas = Router()

const controladorInicio = require('../controladores/controladorInicio')

rutas.get('/', controladorInicio.Inicio)

module.exports = rutas