'use strict';
const {
  Model
} = require('sequelize');
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
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    discount: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};