# Hernando Pet Shop - Sistem Informasi & Kasir Berbasis Web

Aplikasi web manajemen inventaris dan transaksi kasir untuk toko hewan peliharaan (Pet Shop). Dibangun menggunakan Next.js App Router dengan arsitektur Server Components, Server Actions, dan terintegrasi langsung dengan database relsional MySQL.

---

 Identitas Proyek
- **Nama Aplikasi:** Hernando Pet Shop
- **Kelas / Program Keahlian:** Rekayasa Perangkat Lunak (RPL)
- **Tahun Ajaran:** 2026

---

 Tech Stack & Arsitektur
- **Framework:** Next.js (React 19 / App Router)
- **Styling:** CSS Native (Modular Per-Page CSS & Responsive Global CSS)
- **Backend / Data Mutation:** Next.js Server Actions (`'use server'`)
- **Database Engine:** MySQL
- **Database Driver:** `mysql2/promise` (Connection Pooling)


Struktur Direktori Proyek

sts-hernando-petshop/
├── actions/
│   ├── order.js                 # Server Action transaksi kasir & potong stok
│   └── product.js               # Server Action CRUD produk (Insert, Update, Delete)
├── app/
│   ├── dashboard/
│   │   └── page.js              # Laporan ringkasan & agregasi omzet (Cetak PDF)
│   ├── orders/
│   │   ├── create/
│   │   │   └── page.js          # Form pembuatan nota transaksi kasir
│   │   └── page.js              # Riwayat seluruh transaksi penjualan
│   ├── products/
│   │   ├── [id]/
│   │   │   └── edit/
│   │   │       ├── page.css     # Style form edit
│   │   │       └── page.js      # Form update produk
│   │   └── create/
│   │       ├── page.css         # Style form tambah
│   │       └── page.js          # Form tambah data produk baru
│   ├── globals.css              # Reset dasar, responsive navbar, drawer & tabel
│   ├── layout.js                # Root layout & navigasi global
│   └── page.js                  # Katalog utama produk + Pencarian & Filter
├── components/
│   ├── navbar.js                # Navbar responsif (Desktop & Mobile Drawer)
│   └── PrintButton.js           # Tombol print browser (window.print)
└── lib/
    └── db.js                    # Konfigurasi koneksi MySQL pool

 Panduan Instalasi & Menjalankan Proyek

 create database petshop_db;

 use petshop_db;

 npm install mysql2

 create table categories (
    -> id int auto_increment primary key,
    -> name varchar (50) not null,
    -> description TEXT
    -> );

CREATE TABLE products (
    ->     id INT AUTO_INCREMENT PRIMARY KEY,
    ->     category_id INT NOT NULL,
    ->     name VARCHAR(100) NOT NULL,
    ->     price INT NOT NULL,
    ->     stock INT NOT NULL DEFAULT 0,
    ->     FOREIGN KEY (category_id) REFERENCES categories(id)
    -> );

CREATE TABLE orders (
    ->     id INT AUTO_INCREMENT PRIMARY KEY,
    ->     customer_name VARCHAR(100) NOT NULL,
    ->     total_amount INT NOT NULL,
    ->     order_date DATE NOT NULL
    -> );

CREATE TABLE order_items (
    ->     id INT AUTO_INCREMENT PRIMARY KEY,
    ->     order_id INT NOT NULL,
    ->     product_id INT NOT NULL,
    ->     quantity INT NOT NULL,
    ->     price INT NOT NULL,
    ->     subtotal INT NOT NULL,
    ->     FOREIGN KEY (order_id) REFERENCES orders(id),
    ->     FOREIGN KEY (product_id) REFERENCES products(id)
    -> );

INSERT INTO categories (name, description) VALUES
    -> ('Makanan Kucing', 'Pakan nutrisi kucing'),
    -> ('Makanan Anjing', 'Pakan nutrisi anjing'),
    -> ('Aksesoris & Kandang', 'Perlengkapan dan mainan hewan'),
    -> ('Obat & Perawatan', 'Vitamin dan obat kutu/jamur'),
    -> ('Layanan Grooming', 'Jasa perawatan mandi dan bulu');

INSERT INTO products (category_id, name, price, stock) VALUES
    -> (1, 'Whiskas Basah Rasa Tuna Saset 85g', 8500, 45),
    -> (1, 'Pakan Kucing 1kg', 24000, 30),
    -> (1, 'Snack Kucing Creamy Salmon', 18000, 25),
    -> (2, 'Kaleng Rasa Daging Sapi 400g', 27000, 15),
    -> (2, 'Sapi & Sayuran 100g', 12000, 20),
    -> (3, 'Kalung Kucing Lonceng Karakter', 15000, 15),
    -> (3, 'Pasir Wangi Apel 5 Liter', 32000, 10),
    -> (3, 'Kandang Lipat Besi Ukuran Sedang', 145000, 5),
    -> (4, 'Minyak Ikan Bulu 50 Butir', 20000, 25),
    -> (4, 'Obat Tetes Kutu 1ml', 22000, 35),
    -> (5, 'Jasa Mandi Bersih dan Potong Kuku', 60000, 999),
    -> (5, 'Paket Mandi Jamur dan Kutu Kucing', 85000, 999);

Jalankan server aplikasi:

-npm run dev
Buka website google di http://localhost:3000 atau http://localhost:3001.

Analisis & Penjelasan Teknis Tertulis
1. Penerapan Next.js Server Actions

Pada sistem ini, data (CREATE, UPDATE, DELETE) ditangani langsung menggunakan Server Actions ('use server'). 

pola ini mengeliminasi kebutuhan pembuatan API route manual (/api/...).

Form HTML mengirimkan data langsung ke fungsi server melalui atribut action={addProduct} atau action={createOrder}.
 
Setelah query dieksekusi, fungsi revalidatePath('/') membersihkan cache halaman secara otomatis sehingga perubahan data langsung tampak di layar tanpa reload manual.

2. Logika Integritas Data & Transaksi Kasir

Sistem kasir mengimplementasikan relasi master-detail (orders dan order_items) dengan konsistensi stok otomatis:

Validasi Ketersediaan: Sistem memverifikasi stok (stock >= quantity) sebelum mencatat pembelian. Jika stok tidak mencukupi, transaksi otomatis dibatalkan.

Pencatatan Multi-Tabel: Data transaksi induk disimpan ke tabel orders untuk mendapatkan insertId. Selanjutnya, detail barang disimpan ke tabel order_items.

Pengurangan Stok Otomatis: Perubahan stok produk langsung dieksekusi melalui query SQL UPDATE products SET stock = stock - ? WHERE id = ?.

3. Query Agregasi Dashboard

Halaman dashboard menggunakan fungsi SQL bawaan untuk pengolahan data yang efisien:

total transaksi : SELECT SUM(total_amount) AS total_revenue, COUNT(id) AS total_transactions FROM orders

Produk Terlaris (Top Selling): Menggabungkan tabel order_items dan products menggunakan GROUP BY p.id dengan pengurutan SUM(oi.quantity) DESC LIMIT 5.

Early Warning Stok: Menyaring produk dengan kondisi WHERE stock <= 10 untuk memberikan peringatan restock dini bagi pengelola toko.

TUGAS ANALISIS TEKNIS

Apa masalah yang dibantu oleh aplikasi dan siapa penggunanya?
Masalah yang Dibantu:
Pencatatan inventaris dan transaksi penjualan di toko hewan peliharaan (pet shop) yang masih bersifat manual sering kali memicu berbagai kendala operasional, antara lain:

Terjadinya selisih antara jumlah stok fisik barang di rak dengan catatan buku (human error).

Lambatnya proses pencarian barang di tengah variasi produk yang banyak (pakan kucing/anjing, obat, pasir, kandang).

Keterlambatan rekapitulasi data pendapatan harian dan sulitnya mendeteksi produk yang stoknya sudah kritis untuk segera dipesan ulang (restock).
Aplikasi ini mengintegrasikan katalog inventaris langsung dengan modul kasir, sehingga mutasi stok barang terpotong secara otomatis dan pendapatan terhitung secara real-time.

Target Pengguna Aplikasi:

Kasir Toko: Mengoperasikan modul transaksi penjualan harian, memeriksa harga serta sisa stok produk secara langsung saat melayani pembeli.

Admin / Pemilik Toko: Mengelola master data produk (tambah, perbarui harga/stok, hapus), memantau stok yang menipis, serta menganalisis laporan omzet dan produk terlaris melalui dashboard.

Apa tujuan utama aplikasi?
Mengembangkan sistem informasi manajemen inventaris (Point of Sale) terpadu untuk Hernando Pet Shop berbasis web modern.

Mengotomatisasi proses pemotongan stok barang di database MySQL saat transaksi penjualan diproses guna mencegah penjualan barang yang stoknya habis (overselling).

Menyediakan fitur pencarian dan penyaringan (filtering) produk berdasarkan nama dan kategori untuk efisiensi operasional.

Menyediakan dashboard ringkasan data penjualan dengan metrik agregasi omzet dan laporan yang siap dicetak (print/PDF-ready).

ata apa saja yang harus disimpan?
Data Kategori (categories): ID kategori (Primary Key) dan nama kategori produk.

Data Produk (products): ID produk (Primary Key), ID referensi kategori (category_id - Foreign Key), nama barang, harga satuan (integer/rupiah), dan jumlah stok fisik.

Data Transaksi Induk (orders): ID pesanan (Primary Key), nama pelanggan, total nominal bayar (total_amount), dan tanggal transaksi (order_date).

Data Rincian Transaksi (order_items): ID item (Primary Key), relasi ke nota (order_id - Foreign Key), relasi ke barang (product_id - Foreign Key), kuantitas pembelian (quantity), harga barang saat transaksi (price), dan subtotal biaya.

Tuliskan minimal 3-6 kebutuhan fungsional aplikasi.Manajemen Katalog Produk (CRUD): 

Sistem harus mampu menampilkan seluruh daftar barang, menerima input produk baru, memperbarui harga/stok barang, serta menghapus data produk dari sistem.

Pencarian dan Filtrasi Data: Sistem harus dapat menyaring daftar produk berdasarkan input teks nama barang dan pilihan kategori secara bersamaan.

Pemrosesan Transaksi Penjualan: Sistem harus menyediakan form transaksi kasir yang memungkinkan pemilihan produk yang tersedia dan input kuantitas pembelian.

Validasi dan Pemotongan Stok Otomatis: Sistem harus memvalidasi bahwa jumlah pembelian tidak melampaui sisa stok fisik, serta secara otomatis mengurangi jumlah stok produk pada database jika transaksi berhasil disimpan.

Pencatatan Riwayat Transaksi Multi-Tabel: Sistem harus menyimpan data pesanan induk ke tabel orders dan rincian barang yang dibeli ke tabel order_items dengan relasi integritas data yang tepat.

Dashboard Agregasi & Cetak Laporan: Sistem harus dapat menghitung total pendapatan (omzet), total pesanan, menampilkan 5 produk paling laris, menampilkan produk dengan stok kritis ($\le 10$), dan menyediakan fitur cetak halaman rekapitulasi.

Jelaskan alur utama aplikasi dari pengguna memasukkan data sampai hasil tersimpan atau ditampilkan.
Alur Transaksi Kasir dan Mutasi Stok:

Tahap Input: Kasir mengakses rute /orders/create, mengisi kolom nama pelanggan, memilih produk yang ingin dibeli dari menu dropdown, memasukkan kuantitas (qty), lalu menekan tombol "Proses & Bayar".

Tahap Pengiriman Data: Form HTML mengirimkan payload FormData langsung ke Server Action createOrder pada file actions/order.js memanfaatkan mekanisme Next.js Server Actions ('use server').

Tahap Validasi Server: Server membaca input, memvalidasi kelengkapan data, lalu melakukan query ke database (SELECT * FROM products WHERE id = ?) untuk memeriksa apakah sisa stok barang mencukupi kuantitas yang diminta. Jika stok tidak cukup, proses dibatalkan dan sistem melemparkan pesan error.

Tahap Penyimpanan Transaksional Database:

Query INSERT INTO orders dieksekusi untuk menyimpan nama pelanggan, total bayar, dan tanggal nota, menghasilkan orderId (insertId).

Query INSERT INTO order_items dieksekusi untuk merekam detail transaksi (ID order, ID produk, qty, harga satuan, dan subtotal).

Query UPDATE products SET stock = stock - ? WHERE id = ? dieksekusi untuk memotong sisa stok produk secara langsung.

Tahap Revalidasi & Tampilan: Server memanggil fungsi revalidatePath('/') dan revalidatePath('/orders') untuk membersihkan cache data lama, kemudian menjalankan redirect('/orders'). Halaman riwayat transaksi langsung menampilkan baris nota yang baru dibuat dengan data terkini.

Jelaskan alasan pemilihan tabel dan hubungan antartabel.
Struktur database dirancang menggunakan Prinsip Normalisasi Data (3NF) guna mencegah redundansi (duplikasi data yang berulang) dan menjaga integritas referensial:

Pemisahan Tabel categories dan products (Relasi 1:N):
Alasan: Jika nama kategori langsung ditulis di dalam tabel produk, kesalahan penulisan (typo) mudah terjadi dan perubahan nama kategori harus diubah di ribuan baris produk. Dengan memisahkan tabel, satu kategori dapat memiliki banyak produk melalui category_id.

Pemisahan Tabel orders dan order_items (Relasi Master-Detail 1:N):
Alasan: Satu transaksi nota penjualan bisa memuat banyak jenis barang (many-to-many antara pesanan dan produk). Tabel order_items berfungsi sebagai tabel perantara (junction/pivot table) yang mengaitkan satu nota pesanan ke rincian item produk yang dibeli.

Penerapan Foreign Key Constraints:

Kolom category_id pada products merujuk ke categories(id).

Kolom order_id pada order_items menggunakan ON DELETE CASCADE, sehingga jika nota transaksi dibatalkan/dihapus, rincian barang di dalamnya ikut terhapus secara rapi.

Kolom product_id pada order_items menggunakan ON DELETE RESTRICT untuk mencegah data produk terhapus jika barang tersebut sudah memiliki riwayat penjualan historis.

Uraikan satu bagian kode CRUD, satu transaksi/query, satu validasi, serta kendala dan perbaikan yang dilakukan.
A. Satu Bagian Kode CRUD (Operasi INSERT Produk pada actions/product.js):

"export async function addProduct(formData) {
  const name = formData.get('name')?.trim();
  const category_id = formData.get('category_id');
  const price = parseInt(formData.get('price'), 10);
  const stock = parseInt(formData.get('stock'), 10);

  const db = getDb();
  await db.query(
    'INSERT INTO products (category_id, name, price, stock) VALUES (?, ?, ?, ?)',
    [category_id, name, price, stock]
  );

  revalidatePath('/');
  redirect('/');
}"

B. Satu Transaksi / Query (Query Agregasi Dashboard pada app/dashboard/page.js):

SELECT 
  SUM(total_amount) AS total_revenue,
  COUNT(id) AS total_transactions
FROM orders;

C. Satu Validasi (Pengecekan Stok Kritis pada actions/order.js):

if (product.stock < quantity) {
  throw new Error(`Stok tidak cukup! Sisa stok hanya: ${product.stock}`);
}

D. Kendala yang Dihadapi & Solusi Perbaikan:

Kendala Build Error Module Export: Terjadi kesalahan “Export createOrder was not found in module” saat halaman transaksi dijalankan.
Perbaikan: Mengidentifikasi isi berkas actions/order.js yang sebelumnya tidak sengaja tertukar dengan fungsi produk, lalu menyusun fungsi createOrder yang sesuai standar Server Actions.

Kendala Case Sensitivity Nama Berkas: Terjadi error “Module not found: Can't resolve './components/Navbar'” pada app/layout.js.
Perbaikan: Menyelaraskan kapitalisasi nama file pada direktori fisik menjadi Navbar.js agar dikenali bundler Next.js secara konsisten di semua sistem operasi.

Kendala Tampilan Mobile yang Tumpang Tindih: Tampilan navbar horizontal dan tabel inventaris mengalami kerusakan tata letak saat dibuka melalui layar sempit (smartphone).
Perbaikan: Mengimplementasikan tombol navigasi hamburger dengan menu samping (drawer sidebar) dan menambahkan pembungkus tabel dengan aturan CSS.

Jika menggunakan AI/referensi, bagian apa yang dibantu dan bagaimana cara memastikan hasilnya benar?
Bagian yang Dibantu:

Perancangan skema relasi basis data (DDL) serta penataan normalisasi antara master produk dan transaksi kasir.

Penyusunan struktur kode Server Actions Next.js ('use server') yang terhubung dengan connection pool MySQL (mysql2/promise).

Penulisan media queries CSS native untuk tampilan responsif mobile (drawer sidebar) dan konfigurasi cetak dokumen (@media print).

Analisis penelusuran akar masalah (debugging) pada saat muncul pesan error build di konsol peramban.

Cara Memastikan Hasilnya Benar (Verifikasi & Validasi):

Uji Fungsional Manual (Blackbox Testing): Menguji langsung seluruh tombol, link, dan form pada peramban (localhost:3001), mulai dari penambahan barang, pengeditan harga, hingga transaksi kasir.

Verifikasi Database Langsung: Membuka database MySQL/phpMyAdmin untuk memastikan baris data benar-benar bertambah di tabel orders dan order_items, serta memastikan nilai kolom stock di tabel products berkurang sesuai jumlah yang dibeli.

Uji Kasus Negatif (Negative Testing): Memasukkan data uji yang melampaui batas (misal: memesan kuantitas yang lebih besar dari sisa stok) untuk memastikan sistem proteksi error berjalan dan database tidak mengalami inkonsistensi data.

Pengujian Responsivitas Antarmuka: Menggunakan fitur Device Mode pada DevTools peramban (Inspect Element) untuk memverifikasi bahwa antarmuka tidak mengalami overflow pada berbagai resolusi layar (iPhone, Tablet, dan Desktop).