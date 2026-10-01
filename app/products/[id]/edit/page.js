import { getDb } from '@/lib/db';
import { updateProduct } from '@/actions/product';
import Link from 'next/link';

export default async function EditProductPage({ params }) {
    const { id } = await params;
    const db = getDb();

    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    const product = rows[0];

    if (!product) {
        return <p>Produk tidak ditemukan!</p>;
    }

    const [categories] = await db.query('SELECT * FROM categories ORDER BY name ASC');

    return (
        <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h2 style={{ marginTop: 0 }}>✏️ Ubah Data Produk</h2>

            <form action={updateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="hidden" name="id" value={product.id} />

                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Nama Produk:</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={product.name}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Kategori:</label>
                    <select
                        name="category_id"
                        defaultValue={product.category_id}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                    >
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Harga (Rp):</label>
                        <input
                            type="number"
                            name="price"
                            min="1"
                            defaultValue={product.price}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Stok:</label>
                        <input
                            type="number"
                            name="stock"
                            min="0"
                            defaultValue={product.stock}
                            required
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button
                        type="submit"
                        style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Simpan Perubahan
                    </button>
                    <Link
                        href="/"
                        style={{ padding: '10px 20px', textDecoration: 'none', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}