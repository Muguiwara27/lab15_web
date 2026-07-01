const { Sequelize } = require('sequelize');
require('dotenv').config();

const sslConfig = {
  require: true,
  rejectUnauthorized: false, // Railway usa certificados autofirmados
};

let sequelize;

if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
  const url = process.env.DATABASE_URL || process.env.MYSQL_URL;
  sequelize = new Sequelize(url, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: sslConfig,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'marketplace_pro',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

module.exports = sequelize;
