<<<<<<< HEAD
// Mendapatkan elemen tombol login berdasarkan ID
const loginButton = document.getElementById('loginButton');

// Menambahkan event listener saat tombol diklik
loginButton.addEventListener('click', function(event) {
    // Mencegah formulir submit secara default jika tombol berada dalam <form>
    event.preventDefault(); 
    
    // Tampilkan notifikasi pop-up
    alert('Fungsi JavaScript berhasil dijalankan!');
    
    // Opsional: Setelah notifikasi muncul, Anda bisa mengarahkan pengguna
    // ke halaman dashboard dengan kode di bawah ini:
    window.location.href = 'dashboard.html';
=======
// Mendapatkan elemen tombol login berdasarkan ID
const loginButton = document.getElementById('loginButton');

// Menambahkan event listener saat tombol diklik
loginButton.addEventListener('click', function(event) {
    // Mencegah formulir submit secara default jika tombol berada dalam <form>
    event.preventDefault(); 
    
    // Tampilkan notifikasi pop-up
    alert('Fungsi JavaScript berhasil dijalankan!');
    
    // Opsional: Setelah notifikasi muncul, Anda bisa mengarahkan pengguna
    // ke halaman dashboard dengan kode di bawah ini:
    window.location.href = 'dashboard.html';
>>>>>>> ba8dc14 (first commit)
});