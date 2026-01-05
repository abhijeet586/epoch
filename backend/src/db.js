const { Pool } = require("pg");

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password:"Akanksha@2k10",
    database: "backtest_db",
    port:5432,
});

module.exports = pool;