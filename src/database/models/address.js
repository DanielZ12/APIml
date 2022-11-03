'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'cascade'
      })
    }
  }
  Address.init({
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Address',
  });
  return Address;
};