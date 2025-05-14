const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'todo_db',
    password: '545687',
    port: 5432,
});

module.exports = pool;

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Ошибка подключения к базе данных:', err.stack);
    }
    console.log('Подключение к базе данных успешно');
    release();
});
