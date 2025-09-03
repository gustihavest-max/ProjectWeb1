const mysql = require('mysql2/promise');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Metode tidak diizinkan.' }),
    };
  }

  let connection;
  try {
    const { username, password } = JSON.parse(event.body);

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT // jangan lupa port publik
    });

    const [rows] = await connection.execute(
      'SELECT username FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length > 0) {
      return { statusCode: 200, body: JSON.stringify({ success: true, message: 'Login berhasil!' }) };
    } else {
      return { statusCode: 401, body: JSON.stringify({ success: false, message: 'Username atau password salah.' }) };
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Kesalahan server internal.', error: error.message }) };
  } finally {
    if (connection) await connection.end();
  }
};
