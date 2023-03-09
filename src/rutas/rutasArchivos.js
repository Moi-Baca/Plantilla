const {Router} = require('express')
const rutas = Router()
const path= require('path')
const multer = require('multer')
const fs = require('fs');
const modeloArchivos = require('../modelos/modeloArchivos')
const modeloCarpetas = require('../modelos/modeloCarpetas')
const controladorArchivos = require('../controladores/controladorArchivos')
rutas.get('/', controladorArchivos.Vista)


// Define la configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  const upload = multer({ storage: storage });  

  rutas.post('/subir', upload.single('file'), async (req, res) => {
    try {
      const { originalname, mimetype, filename, path, size } = req.file;
      const archivo = await modeloArchivos.create({
        nombre: originalname,
        tipo: mimetype,
        filename: filename,
        ruta: path,
        tamaño: size
      });
     res.redirect('/app/archivos');
    } catch (error) {
      console.log(error);
      res.status(500).send('Ocurrió un error al subir el archivo');
    }
  });

  rutas.post('/directorio', async (req, res) => {
    const { nombre } = req.body;
    const ruta = `src/directorios/${nombre}`;
    const directorio = await modeloCarpetas.create({ nombre, ruta });
    // Ruta donde se creará el nuevo directorio
    fs.mkdir(ruta, (error) => {
      if (error) {
        console.error('Error al crear el directorio:', error);
        res.status(500).send('Error al crear el directorio');
      } else {
        console.log('Directorio creado con éxito:', ruta);
        res.redirect('/app/archivos');
      }
    });
  });

  rutas.post('/subir/:directorio', upload.single('file'), async (req, res) => {
    const { originalname, mimetype, filename, path, size } = req.file;
    const { directorio } = req.params; // Nombre del directorio donde se subirá el archivo
  
    // Buscar el directorio en la base de datos
    const directorioDB = await modeloCarpetas.findOne({ where: { nombre: directorio } });
  
    if (directorioDB) {
      // Crear una instancia de Archivo en la base de datos
      const archivo = await modeloArchivos.create({
        nombre: originalname,
        tipo: mimetype,
        filename,
        ruta: path,
        tamaño: size,
        directorioId: directorioDB.id // Asociar el archivo con el directorio correspondiente en la base de datos
      });
  
      res.send('Archivo subido con éxito');
     console.log(directorioDB.id);
    } else {
      res.status(500).send('El directorio especificado no existe');
    }
  });

  //abrir directorio
  rutas.get('/abrir/:directorio', async (req, res) => {
    const { directorio } = req.params;
    const titulo = 'Ingreso de archivos';
    const directorioDB = await modeloCarpetas.findOne({ where: { nombre: directorio } });
    if (directorioDB) {
      const archivos = await modeloArchivos.findAll({ where: { directorioId: directorioDB.id } });
      res.render('openfolder', { archivos, directorio: directorioDB.nombre, titulo });
    } else {
      res.status(500).send('El directorio especificado no existe');
    }
  });

  //abrir archivo
//visualizar archivo en el navegador
rutas.get('/abrirarchivo/:id', async (req, res) => {
  const archivoId = req.params.id;
  const archivo = await modeloArchivos.findByPk(archivoId, { include: [modeloCarpetas] });

  if (!archivo) {
    return res.status(404).send('El archivo no existe');
  }

  const ruta = path.join(__dirname, '..', 'uploads', archivo.directorio.nombre, archivo.nombre);

  fs.readFile(ruta, (err, data) => {
    if (err) {
      return res.status(err).send('Error al leer el archivo');
    }

    const extension = path.extname(ruta).toLowerCase();
    let tipo;

    switch (extension) {
      case '.pdf':
        tipo = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        tipo = 'image/jpeg';
        break;
      case '.png':
        tipo = 'image/png';
        break;
      case '.txt':
        tipo = 'text/plain';
        break;
      case '.doc':
      case '.docx':
        tipo = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      default:
        tipo = 'application/octet-stream';
    }

    res.set('Content-Type', tipo);
    res.send(data);
  });
});




module.exports = rutas