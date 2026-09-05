const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
});

const Usuario = sequelize.define('usuario', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING }
});

const Pedido = sequelize.define('pedido', {
    producto: { type: DataTypes.STRING, allowNull: false },
    total: { type: DataTypes.FLOAT }
});

Usuario.hasMany(Pedido);
Pedido.belongsTo(Usuario);

sequelize.sync({ alter: true })
    .then(() => console.log('base de datos conectada y sincronizada'))
    .catch(err => console.error('error de conexión:', err));

module.exports = { sequelize, Usuario, Pedido };