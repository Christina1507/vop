const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "vop",
  password: "Sharon07",
  port: 5432,
});

module.exports = pool;