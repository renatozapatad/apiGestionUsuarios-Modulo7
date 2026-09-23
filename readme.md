# API RESTful - Gestion de Usuarios (Modulo 8)

Proyecto integrador del bootcamp de ISEG. API RESTful segura, conectada a PostgreSQL mediante Sequelize, con sistema de autenticacion JWT y subida de archivos vinculada a la base de datos.

## Instalacion

1. Clonar el repositorio e instalar dependencias:
npm install

2. Configurar las variables de entorno creando un archivo .env:
PORT=3000
DB_NAME=gestion_usuarios
DB_USER=postgres
DB_PASS=tu_clave_de_postgres
DB_HOST=localhost
JWT_SECRET=tu_clave_secreta

3. Iniciar el servidor:
npm run dev

## Estructura de Endpoints

* Rutas Publicas:
  * POST /usuarios : Registra un usuario nuevo (encripta la clave con bcrypt) y crea su Pedido inicial mediante una transaccion.
  * POST /usuarios/login : Autenticacion de usuario. Devuelve el token JWT.

* Rutas Privadas (Requieren JWT en el header Authorization: Bearer <token>):
  * GET /usuarios : Lista todos los usuarios y sus pedidos asociados.
  * PUT /usuarios/:id : Actualiza la informacion de un usuario.
  * DELETE /usuarios/:id : Elimina un usuario de la base de datos.
  * POST /usuarios/:id/foto : Sube una imagen de perfil usando Multer (form-data con la key "imagen").

## Justificaciones Tecnicas (Requerimientos Modulo 8)

¿Como decidiste separar tus rutas y controladores?
Opte por una arquitectura modular separando las responsabilidades. Las rutas solo definen los endpoints y los verbos HTTP, mientras que delegan toda la logica de negocio a los controladores. Esto mantiene el codigo limpio y mejora la escalabilidad de la API.

¿Que validaciones realizaste antes de insertar/modificar datos?
- En el registro, se implemento bcrypt para encriptar las claves y no guardarlas en texto plano.
- En los metodos PUT, DELETE y al subir la foto, se valida primero que el usuario realmente exista en la base de datos usando findByPk. Si no existe, devuelve un error 404.
- En la subida de archivos, Multer filtra la extension y el mimetype para aceptar unicamente imagenes (jpg, png, gif) y limita el peso del archivo a 2MB para evitar sobrecargar el servidor.

¿Por que decidiste proteger esas rutas?
Decidi proteger los metodos GET, PUT, DELETE y la subida de fotos porque son acciones que exponen o alteran informacion sensible de la base de datos. El registro y el login deben quedar publicos obligatoriamente para que los usuarios puedan ingresar al sistema por primera vez.

¿Donde y como almacenas el token?
El token se genera en el backend con jsonwebtoken y se configura con una expiracion de 1 hora por seguridad. Este token se envia como respuesta JSON al cliente. Queda bajo la responsabilidad del frontend almacenar este token (por ejemplo en el LocalStorage del navegador) y enviarlo de vuelta en los headers de las proximas peticiones.

Tarea PLUS: Asociacion de Archivos
La subida de archivos guarda la imagen fisicamente en la carpeta /public/uploads, pero ademas toma la ruta generada y actualiza dinamicamente el campo "foto" del usuario en la base de datos de PostgreSQL.