# Proyecto API de Usuarios - Node y Express

Este es mi proyecto integrador para el bootcamp Full Stack. Empezo en el modulo 6 como un servidor basico y ahora en el modulo 7 le sume la conexion a una base de datos PostgreSQL para gestionar usuarios y pedidos.

Requisitos previos:
- Node.js (version 18 o mayor)
- PostgreSQL y pgAdmin 4 instalados
- Postman para probar las nuevas rutas

## Como instalar y correr el proyecto

1. Clona este repositorio y metete a la carpeta del proyecto en tu terminal.
2. Instala los paquetes necesarios corriendo: 
   `npm install`
3. Crea un archivo `.env` en la raiz. Aca tienes que configurar el puerto y tus credenciales de la base de datos asi:
   PORT=3000
   DB_NAME=gestion_usuarios
   DB_USER=postgres
   DB_PASS=tu_clave_de_postgres
   DB_HOST=localhost
4. Abre pgAdmin y crea una base de datos vacia que se llame exactamente `gestion_usuarios`.
5. Levanta el server en modo desarrollo (se actualiza solo al guardar cambios): 
   `npm run dev`
   (Sequelize va a crear las tablas por su cuenta al iniciar, no tienes que hacer nada extra).

## Rutas disponibles

Rutas basicas del modulo 6 (se pueden abrir en el navegador):
- `http://localhost:3000/` : Mensaje de bienvenida (servido desde la carpeta public).
- `http://localhost:3000/status` : Muestra que el servidor esta funcionando bien.

Rutas de base de datos del modulo 7 (para probar en Postman):
- `POST /usuarios` : Crea un usuario y le asigna un "Kit Inicial" al mismo tiempo usando una transaccion.
- `GET /usuarios` : Trae la lista de usuarios. Oculta las contraseñas por seguridad y trae los pedidos asociados.
- `PUT /usuarios/:id` : Sirve para modificar los datos de un usuario existente.
- `DELETE /usuarios/:id` : Elimina al usuario de la base de datos.

## Logs del sistema
Cada vez que visitas una pagina, el programa anota la fecha, hora y ruta en el archivo `logs/log.txt` gracias a un middleware personalizado.

## Decisiones y notas tecnicas

- app.js: elegi este nombre como archivo principal porque representa el inicio de la app express.
- Estructura: cree carpetas como /routes, /controllers, /models, /middlewares y /public para mantener el codigo ordenado y modular, lo que me facilito mucho integrar la base de datos despues.
- Archivos estaticos: use la carpeta public con express.static() para servir el html.
- ORM (Sequelize): decidi usarlo porque me parecio mucho mas comodo que escribir SQL a mano, sobre todo para manejar la relacion 1 a muchos entre usuarios y pedidos.
- Transacciones: use `sequelize.transaction()` en el POST. Asi me aseguro de que si falla la creacion del pedido o del usuario, se hace un rollback automatico y no queda informacion a medias.
- Validaciones: le agregue chequeos simples al PUT y DELETE para confirmar que el ID del usuario realmente exista antes de intentar hacerle cambios.