const mysql = require('mysql2/promise');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Metode tidak diizinkan.' }),
    };
  }

  let connection;
  try {
    // ambil body
    const { nip, username, password, email, phone } = JSON.parse(event.body);

    if (!nip || !username || !password || !email || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Semua field wajib diisi.' }),
      };
    }

    // konek database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // cek apakah NIP sudah ada
    const [rows] = await connection.execute(
      'SELECT nip FROM daftaruser WHERE nip = ?',
      [nip]
    );

    if (rows.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'NIP sudah terdaftar. Gunakan NIP lain.'
        }),
      };
    }

    // insert data baru
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
