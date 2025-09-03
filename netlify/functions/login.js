const mysql = require('mysql2/promise');

// Titik masuk utama untuk Netlify Function
exports.handler = async (event) => {
    // Pastikan permintaan menggunakan metode POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Metode tidak diizinkan.' }),
        };
    }

    let connection;
    try {
        // Parse data dari body permintaan
        const { username, password } = JSON.parse(event.body);

        // Ambil variabel lingkungan yang sudah diatur di Netlify
        const db_config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        };

        // Buat koneksi ke database MySQL
        connection = await mysql.createConnection(db_config);

        // Contoh query: mencari pengguna berdasarkan username dan password
        // CATATAN PENTING: Untuk aplikasi nyata, jangan simpan password dalam bentuk plain text.
        // Gunakan hashing (misalnya bcrypt) untuk keamanan.
        const [rows] = await connection.execute(
            'SELECT username FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (rows.length > 0) {
            // Login berhasil
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: 'Login berhasil!',
                }),
            };
        } else {
            // Login gagal (username atau password salah)
            return {
                statusCode: 401,
                body: JSON.stringify({
                    success: false,
                    message: 'Username atau password salah.',
                }),
            };
        }
    } catch (error) {
        // Tangani kesalahan yang mungkin terjadi
        console.error('Terjadi kesalahan:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                message: 'Kesalahan server internal. Mohon coba lagi nanti.',
            }),
        };
    } finally {
        if (connection) {
            connection.end(); // Pastikan koneksi ditutup
        }
    }
};
