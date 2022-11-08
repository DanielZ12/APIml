'use strict';
const { hashSync } = require('bcryptjs');
const {unlink, unlinkSync} = require('fs')
const {join} = require('path')
const {
  Model
} = require('sequelize');
const { ROL_USER } = require('../../constants');
const { objectValidate, defaultValidationsRequiredFields } = require('../resource');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    existEmail(value){
      return new Promise((resolve, reject) => {
        const user = User.findOne({where : {email:value}})
          resolve(user) 
      })
    }


    static associate(models) {
      // define association here
      this.hasMany(models.Address, {
        as: 'addresses',
        foreignKey: 'userId'
      })
      this.belongsTo(models.Rol, {
        as: 'rol',
        foreignKey: 'rolId'
      })
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
     // allowNull: false,
      validate: {
        //...defaultValidationsRequiredFields,
        is: objectValidate(/^[a-z]+$/i, "No puede tener numeros (name)")
         
      }
    },
    surname: {
      type: DataTypes.STRING,
      validate: {
        is: objectValidate(/^[a-z]+$/i, "No puede tener numeros (surname)")
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        ...defaultValidationsRequiredFields,
        isEmail: objectValidate(true, "Ingrese un email valido"),
        
        async email(value){
          const exist = await this.existEmail(value)
          if(exist){
            throw new Error('El email ya existe')
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        ...defaultValidationsRequiredFields,
        is: objectValidate(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/,"La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula"),
        // CUSTON
        hashPass(value){
          User.beforeCreate((user) => {
            user.password = hashSync(value)
          })
        }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isImage(value){
          if(!/.png|.jpg|.jpeg|.webp/i.test(value)){ /* value = avatar-123212322.png */
            unlinkSync(join(__dirname, `../../../public/images/avatars/${value}`))
            throw new Error("Archivo invalido")
          }
        }
      }
    },
    rolId: {
      type: DataTypes.STRING,
      valueDefault: ROL_USER,
    }
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true
  });
  return User;
};