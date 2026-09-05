const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middlewares/logger');
const path = require('path');
const usuariosRoutes = require('./routes/usuarios.routes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger); 
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) => {
    res.send('<h1>bienvenido al servidor Node & Express</h1>');
});

app.get('/status', (req, res) => {
    res.json({ 
        estado: 'OK', 
        mensaje: 'el servidor esta funcionando correctamente' 
    });
});

app.use('/usuarios', usuariosRoutes);

app.listen(PORT, () => {
    console.log(`servidor iniciado en http://localhost:${PORT}`);
});