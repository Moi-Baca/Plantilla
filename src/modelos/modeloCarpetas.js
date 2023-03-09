const {DataTypes} = require('sequelize');
const db = require('../configuracion/db');

const Directorio = db.define('directorio', {
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ruta: {
    type: DataTypes.STRING,
    allowNull: false
  },
    },
    {
        timestamps: false,
        tableName: 'directorio'

    }
);
module.exports = Directorio;
