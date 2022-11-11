'use strict';
const {
  Model
} = require('sequelize');
const { defaultValidationsRequiredFields, objectValidate } = require('../resource');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      // define association here
      this.hasMany(models.Image, {
        as: 'images',
        foreignKey: 'productId',
        onDelete: 'cascade'
      })
      this.belongsTo(models.Category, {
        as: 'category',
        foreignKey: "categoryId"
      })
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        ...defaultValidationsRequiredFields
      }
    },
    price: {
      type : DataTypes.INTEGER,
      allowNull: false,
      validate:{
        ...defaultValidationsRequiredFields,
        isInt: objectValidate(/[0-9]/g, "el precio tiene valor invalido")
      }
    },
    discount: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: objectValidate(true, "El descuento tiene valor invalido")
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate:{
        ...defaultValidationsRequiredFields,
        len: objectValidate([20], "Logitud minima 20 caracteres")
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        ...defaultValidationsRequiredFields,
        isInt: objectValidate(true, "la categoria es invalida")
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};