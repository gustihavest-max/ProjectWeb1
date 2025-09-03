const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Metode tidak diizinkan.' }),
    };
  }

  let connection;
  try {
    const { username, password, email } = JSON.parse(event.body);

    if (!username || !password || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Semua field wajib diisi.' }),
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // sekarang urutan kolomnya sama persis seperti tabel: username, password, email
    await connection.execute(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Registrasi berhasil!' }),
    };

  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Kesalahan server internal.',
        error: error.message
      }),
    };
  } finally {
    if (connection) await connection.end();
  }
};
