const sequelize = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');

User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId' });

Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId' });

module.exports = {
  sequelize,
  Role,
  User,
  Category,
  Product,
};
