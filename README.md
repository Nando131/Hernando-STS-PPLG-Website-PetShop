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