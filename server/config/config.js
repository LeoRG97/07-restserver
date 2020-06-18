//archivo de configuración global

//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Base de datos
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://darth_vinci:dbcFtcGx512P6hy7@cluster0-5ltnm.mongodb.net/cafe';
}

process.env.URL_DB = urlDB;