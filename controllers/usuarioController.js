const { sequelize, Usuario, Pedido } = require('../models/db');

const crearUsuarioConPedido = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const nuevoUsuario = await Usuario.create({
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password
        }, { transaction: t });

        await nuevoUsuario.createPedido({
            producto: 'Kit Inicial',
            total: 0.00
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ mensaje: 'transaccion exitosa', usuario: nuevoUsuario.nombre });
    } catch (error) {
        await t.rollback(); 
        res.status(500).json({ error: 'fallo la transaccion, cambios revertidos' });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] }, 
            include: Pedido 
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'error al obtener usuarios' });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        
        if (!usuario) {
            return res.status(404).json({ error: 'usuario no encontrado' });
        }

        await usuario.update(req.body);
        res.json({ mensaje: 'usuario actualizado correctamente', usuario });
    } catch (error) {
        res.status(500).json({ error: 'error al actualizar usuario' });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ error: 'usuario no encontrado' });
        }

        await usuario.destroy();
        res.json({ mensaje: 'usuario eliminado exitosamente' }); 
    } catch (error) {
        res.status(500).json({ error: 'error al eliminar usuario' });
    }
};

module.exports = { 
    crearUsuarioConPedido, 
    obtenerUsuarios, 
    actualizarUsuario, 
    eliminarUsuario 
};