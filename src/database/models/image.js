'use strict';
const {
  Model
} = require('sequelize');
const { image } = require('../../controllers/productsController');
const { defaultValidationsRequiredFields, objectValidate } = require('../resource');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate(models) {
      // define association here
      Image.belongsTo(models.Product, {
        as: 'product',
        foreignKey: 'productId',
        onDelete: 'cascade'
      })
    }
  }
  Image.init({
    file: {
      type: DataTypes.STRING,
      defaultValue:"default.png",
      validate: {
        isImage(value){
          if(!/.png|.jpg|.jpeg|.webp/i.test(value)){ /* value = avatar-123212322.png */
            unlinkSync(join(__dirname, `../../../public/images/products/${value}`))
            throw new Error("Archivo invalido")
          }
        }
      }
    },
    productId: {
      type:DataTypes.INTEGER,
      allowNull: false,
      validate:{
        ...defaultValidationsRequiredFields,
        is: objectValidate(/[0-9]/, "valor invalido")
      }
    }
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};