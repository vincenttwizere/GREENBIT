const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: DB_HOST || '127.0.0.1',
    user: DB_USER,
    password: DB_PASSWORD || undefined,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.end();
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD || undefined, {
  host: DB_HOST || '127.0.0.1',
  dialect: 'mysql',
  logging: false,
});

module.exports = {
  sequelize,
  ensureDatabaseExists,
};

