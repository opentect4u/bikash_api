// use = util.promisify for async/await "npm i util.promisify"
const util = require("util");
const mysql = require("mysql");

/*
 * CONNECTION TO THE DATABSE
 */

const db = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "ardb_loan",
});

db.getConnection((err, connection) => {
  if (err) console.log("Something Went Wrong To Connect Database..");
  if (connection) connection.release();
  return;
});

db.query = util.promisify(db.query);

module.exports = db;
