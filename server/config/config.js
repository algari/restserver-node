
//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//MongoDB
//process.env.URL_DB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 'mongodb://cafe:Galcorp7@ds149700.mlab.com:49700/cafe';
process.env.URL_DB = 'mongodb://cafe:Galcorp7@ds149700.mlab.com:49700/cafe';
