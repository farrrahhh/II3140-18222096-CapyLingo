import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const db = new Sequelize(process.env.MYSQLDATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  dialect: "mysql",
  dialectModule: require("mysql2"),
  logging: false,
});

export default db;
