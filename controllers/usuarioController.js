const { sequelize, Usuario, Pedido } = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const crearUsuarioConPedido = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(req.body.password, salt);

        const nuevoUsuario = await Usuario.create({
            nombre: req.body.nombre,
            email: req.body.email,
            password: passwordEncriptada
        }, { transaction: t });

        await nuevoUsuario.createPedido({
            producto: 'Kit Inicial',
            total: 0.00
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ status: 'success', mensaje: 'transaccion exitosa', data: nuevoUsuario });
    } catch (error) {
        await t.rollback(); 
        res.status(500).json({ status: 'error', error: 'fallo la transaccion.' });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        const passValida = await bcrypt.compare(password, usuario.password);
        if (!passValida) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ status: 'success', mensaje: 'login exitoso', token });
    } catch (error) {
        res.status(500).json({ error: 'error en el servidor' });
    }
};

const subirFotoPerfil = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'por favor, sube una imagen' });

        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        
        if (!usuario) return res.status(404).json({ error: 'usuario no encontrado' });

        usuario.foto = `/uploads/${req.file.filename}`;
        await usuario.save();

        res.json({ status: 'success', mensaje: 'foto subida y vinculada exitosamente', data: usuario.foto });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] }, 
            include: Pedido 
        });
        res.json({ status: 'success', data: usuarios });
    } catch (error) {
        res.status(500).json({ error: 'error al obtener usuarios' });
    }
};

const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: 'usuario no encontrado' });
        await usuario.update(req.body);
        res.json({ status: 'success', mensaje: 'usuario actualizado correctamente', data: usuario });
    } catch (error) { res.status(500).json({ error: 'error al actualizar usuario' }); }
};

const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) return res.status(404).json({ error: 'usuario no encontrado' });
        await usuario.destroy();
        res.json({ status: 'success', mensaje: 'usuario eliminado exitosamente' }); 
    } catch (error) { res.status(500).json({ error: 'error al eliminar usuario' }); }
};


module.exports = { 
    crearUsuarioConPedido, loginUsuario, subirFotoPerfil, obtenerUsuarios, actualizarUsuario, eliminarUsuario 
};