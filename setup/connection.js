const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'songLabel',
    password: 'postgres',
    port: 5432,
    idleTimeoutMillis: 1000
})

module.exports = {pool}