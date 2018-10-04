const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'
};

let usuarioShema = new Schema({
    nombre:{
        type:String,
        required:[true, 'Nombre requerido']
    },
    email:{
        type:String,
        required:[true,'Email requerido'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Contraseña requerida'],
        select:false
    },
    img:{type:String},
    role:{
        type:String,
        default:'USER_ROLE',
        enum:rolesValidos
    },
    estado:{
        type:Boolean,
        default:true
    },
        google:{type:Boolean,
        default:false
    }
});

usuarioShema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioShema.plugin(uniqueValidator,{
    message:'{PATH} debe ser unico'
})

module.exports = mongoose.model('Usuario',usuarioShema);