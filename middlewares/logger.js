const fs = require('fs');
const path = require('path');

const logger = (req, res, next) => {
    const date = new Date().toISOString();
    const logText = `Fecha/Hora: ${date} - Ruta accedida: ${req.url}\n`;
    const logPath = path.join(__dirname, '../logs/log.txt');

    fs.appendFile(logPath, logText, (err) => {
        if (err) console.error('Error al guardar el log', err);
    });
    
    next(); // permite que la peticion continue hacia las rutas
};

module.exports = logger;