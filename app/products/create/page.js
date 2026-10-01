import './page.css';
import { getDb } from '@/lib/db';
import { addProduct } from '@/actions/product';
import Link from 'next/link';

export default async function CreateProductPage() {
    const db = getDb();
    const [categories] = await db.query('SELECT * FROM categories ORDER BY name ASC');

    return (
        <div className="form-card">
            <h2 className="form-title">+ Tambah Produk Baru</h2>

            <form action={addProduct} className="create-form">
                <div className="field-group">
                    <label className="field-label">Nama Produk</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Contoh: Pasir Kucing Wangi Apel 5L"
                        className="field-input"
                    />
                </div>

                <div className="field-group">
                    <label className="field-label">Kategori</label>
                    <select name="category_id" required className="field-select">
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field-row">
                    <div className="field-group">
                        <label className="field-label">Harga Satuan (Rp)</label>
                        <input
                            type="number"
                            name="price"
                            min="1"
                            required
                            placeholder="35000"
                            className="field-input"
                        />
                    </div>

                    <div className="field-group">
                        <label className="field-label">Stok Awal</label>
                        <input
                            type="number"
                            name="stock"
                            min="0"
                            required
                            placeholder="20"
                            className="field-input"
                        />
                    </div>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="btn-submit">Simpan Produk</button>
                    <Link href="/" className="btn-cancel">Batal</Link>
                </div>
            </form>
        </div>
    );
}