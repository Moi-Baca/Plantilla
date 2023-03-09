const {DataTypes} = require('sequelize');
const db = require('../configuracion/db');
const directorio = require('./modeloCarpetas');
//modelo es donde se genera o crea la tabla de la bdd para que la api conozca los campos que lleva
//con el const pedidos_elaborados le indicamos los campos de la tabla

const Archivo = db.define('Archivo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ruta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tamaño: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    directorioId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
    {   
        timestamps: false,
        tableName: 'archivos'
    }
  );

  Archivo.belongsTo(directorio, { foreignKey: 'directorioId' }); // Agregar la relación con la tabla Directorio

  Archivo.sync(); // Sincronizar la tabla con la base de datos
  
  module.exports = Archivo;
  