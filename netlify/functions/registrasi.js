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
    const { npm, username, password, email, phone } = JSON.parse(event.body);

    if (!npm || !username || !password || !email || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Semua field wajib diisi.' }),
      };
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    await connection.execute(
      'INSERT INTO daftaruser (nip, username, password, email, phone) VALUES (?, ?, ?, ?, ?)',
      [nip, username, password, email, phone]
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
