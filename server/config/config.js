
//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//MongoDB
//process.env.URL_DB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : 'mongodb://cafe:Galcorp7@ds149700.mlab.com:49700/cafe';
process.env.URL_DB = 'mongodb://cafe:Galcorp7@ds149700.mlab.com:49700/cafe';

//Clave token
process.env.KEY = 'secret'

//Vencimiento token 60 segundos, 60 minutos, 24 horas, 30 dias
process.env.CADUCIDAD_TOKEN = '48h';

process.env.CLIENT_ID='813175885589-duc1ju4379n0v5smsi7boas1revjghms.apps.googleusercontent.com';