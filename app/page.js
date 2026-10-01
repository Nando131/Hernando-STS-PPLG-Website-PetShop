import { getDb } from '@/lib/db';
import { deleteProduct } from '@/actions/product';
import Link from 'next/link';

export default async function HomePage({ searchParams }) {
  const db = getDb();
  const params = await searchParams;

  const search = params?.q || '';
  const categoryFilter = params?.cat || '';

  const [categories] = await db.query('SELECT * FROM categories ORDER BY name ASC');

  let query = `
    SELECT p.id, p.name, p.price, p.stock, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const queryParams = [];

  if (search) {
    query += ' AND p.name LIKE ?';
    queryParams.push(`%${search}%`);
  }

  if (categoryFilter) {
    query += ' AND p.category_id = ?';
    queryParams.push(categoryFilter);
  }

  query += ' ORDER BY p.category_id ASC, p.id ASC';

  const [products] = await db.query(query, queryParams);

  return (
    <div>
      <div className="home-header">
        <div>
          <h1 className="home-title">Katalog Data Produk</h1>
          <span className="home-badge">{products.length} Produk Ditemukan</span>
        </div>
        <Link href="/products/create" className="btn-add">
          + Tambah Produk
        </Link>
      </div>

      <div className="filter-card">
        <form method="GET" action="/" className="filter-form">
          <input
            type="text"
            name="q"
            defaultValue={search}
            placeholder="Cari nama produk / pakan / barang..."
            className="search-input"
          />

          <select name="cat" defaultValue={categoryFilter} className="category-select">
            <option value="">-- Semua Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button type="submit" className="btn-filter">
            Terapkan
          </button>

          {(search || categoryFilter) && (
            <Link href="/" className="btn-reset">
              Reset Filter
            </Link>
          )}
        </form>
      </div>

      <div className="home-card">
        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', padding: '20px 0' }}>
            Tidak ada produk yang cocok dengan pencarian.
          </p>
        ) : (
          <table className="home-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>No.</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.category_name}</td>
                  <td>Rp {item.price.toLocaleString('id-ID')}</td>
                  <td>{item.stock}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <Link href={`/products/${item.id}/edit`} className="btn-edit">
                        Ubah
                      </Link>

                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="btn-delete">
                          Hapus
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}