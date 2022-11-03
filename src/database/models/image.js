'use strict';
const {
  Model
} = require('sequelize');
const { image } = require('../../controllers/productsController');
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
    file: DataTypes.STRING,
    productId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};