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
    // Ambil data dari body permintaan frontend
    const { username, password, email } = JSON.parse(event.body);

    // Buka koneksi ke MySQL Railway
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // Simpan data user baru
    // ⚠️ Untuk keamanan, hash password dulu sebelum simpan (bcrypt)
    await connection.execute(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, password, email]
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