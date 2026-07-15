## Getting Started

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd nolimit-backend-test

   
3. Jalankan npm install untuk memasang semua dependensi.
4. Buat database kosong bernama nolimit_blog di MySQL local.
5. Salin file .env.example menjadi .env lalu sesuaikan kredensial database (host, user, pass, port) di lokal Anda.
6. Jalankan perintah "npm run dev" untuk menjalankan server (tabel database akan otomatis dibuat oleh Sequelize).
7. Jalankan perintah "npm test" untuk menjalankan seluruh rangkaian unit testing.
