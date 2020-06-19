//archivo de configuración global

//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Vencimiento del token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//SEED de autenticación
process.env.SEED = process.env.SEED || 'seed-develop';

//Base de datos
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URL_DB = urlDB;

//Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '385978997254-8cd0ig172i45eo3uekns64m23djecuh8.apps.googleusercontent.com';
//385978997254-8cd0ig172i45eo3uekns64m23djecuh8.apps.googleusercontent.com