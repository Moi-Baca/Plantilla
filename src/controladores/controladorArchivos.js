//controlador para subir archivos con multer y mysql
const multer = require('multer');
const modeloCarpetas = require('../modelos/modeloCarpetas');
const modeloArchivos = require('../modelos/modeloArchivos');
const path = require('path');
const fs = require('fs');

exports.Vista = async (req, res) => {

    const carpetas = await modeloCarpetas.findAll();
    const titulo = 'Home';
    const titulo2 = 'Ingreso de nuevos archivos';
    const titulo3 = 'Carpetas';
    res.render('archivosIndex',{
        titulo,
        titulo2,
        titulo3,
        carpetas
    }
    );


};












