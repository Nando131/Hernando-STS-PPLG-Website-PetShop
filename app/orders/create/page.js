import { getDb } from '@/lib/db';
import { createOrder } from '@/actions/order';
import Link from 'next/link';

export default async function CreateOrderPage() {
    const db = getDb();

    const [products] = await db.query(
        'SELECT * FROM products WHERE stock > 0 ORDER BY name ASC'
    );

    return (
        <div className="home-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="home-header" style={{ marginBottom: '20px' }}>
                <h2 className="home-title">🧾 Transaksi Kasir Baru</h2>
            </div>

            <form action={createOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        Nama Pelanggan:
                    </label>
                    <input
                        type="text"
                        name="customer_name"
                        required
                        placeholder="Contoh: Budi Santoso"
                        className="search-input"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        Pilih Produk:
                    </label>
                    <select
                        name="product_id"
                        required
                        className="category-select"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                    >
                        <option value="">-- Pilih Produk --</option>
                        {products.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name} — Rp {item.price.toLocaleString('id-ID')} (Sisa Stok: {item.stock})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        Jumlah Beli (Qty):
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        defaultValue="1"
                        required
                        className="search-input"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button
                        type="submit"
                        className="btn-add"
                        style={{ border: 'none', cursor: 'pointer' }}
                    >
                        Proses & Bayar
                    </button>
                    <Link
                        href="/"
                        className="btn-reset"
                        style={{ border: '1px solid #cbd5e1', borderRadius: '6px', display: 'inline-flex', alignItems: 'center' }}
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </div>
    );
}