const express = require('express');
const router = express.Router();

const { 
    crearUsuarioConPedido, 
    obtenerUsuarios, 
    actualizarUsuario, 
    eliminarUsuario 
} = require('../controllers/usuarioController');

router.post('/', crearUsuarioConPedido); 
router.get('/', obtenerUsuarios);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;