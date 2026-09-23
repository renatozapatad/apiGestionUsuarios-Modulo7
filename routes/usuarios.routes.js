const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const { 
    crearUsuarioConPedido, loginUsuario, subirFotoPerfil,
    obtenerUsuarios, actualizarUsuario, eliminarUsuario 
} = require('../controllers/usuarioController');

router.post('/', crearUsuarioConPedido);
router.post('/login', loginUsuario);

router.get('/', verificarToken, obtenerUsuarios);
router.put('/:id', verificarToken, actualizarUsuario);
router.delete('/:id', verificarToken, eliminarUsuario);

router.post('/:id/foto', verificarToken, upload.single('imagen'), subirFotoPerfil);

module.exports = router;