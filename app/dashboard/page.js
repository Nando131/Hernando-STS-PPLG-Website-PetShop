import { getDb } from '@/lib/db';
import Link from 'next/link';

export default async function DashboardPage() {
    const db = getDb();

    const [orderSummaryRows] = await db.query(`
    SELECT 
      COALESCE(SUM(total_amount), 0) AS total_revenue,
      COUNT(id) AS total_transactions
    FROM orders
  `);
    const orderSummary = orderSummaryRows[0];

    const [productCountRows] = await db.query(`
    SELECT COUNT(id) AS total_items FROM products
  `);
    const totalProducts = productCountRows[0].total_items;

    const [lowStockProducts] = await db.query(`
    SELECT id, name, stock
    FROM products
    WHERE stock <= 10
    ORDER BY stock ASC
    LIMIT 5
  `);

    const [topProducts] = await db.query(`
    SELECT 
      p.name,
      COALESCE(SUM(oi.quantity), 0) AS total_sold,
      COALESCE(SUM(oi.subtotal), 0) AS total_sales
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    GROUP BY p.id, p.name
    ORDER BY total_sold DESC
    LIMIT 5
  `);

    return (
        <div className="dash-container">
            <div className="dash-header">
                <div>
                    <h2 className="dash-title">Dashboard & Laporan Penjualan</h2>
                    <p className="dash-subtitle">Ringkasan aktivitas transaksi dan inventaris produk</p>
                </div>
                <Link href="/orders/create" className="btn-dash-primary">
                    + Input Transaksi Baru
                </Link>
            </div>

            <div className="dash-summary-row">
                <div className="dash-box box-blue">
                    <div className="box-title">Total Pendapatan</div>
                    <div className="box-number">Rp {Number(orderSummary.total_revenue).toLocaleString('id-ID')}</div>
                    <div className="box-desc">Akumulasi seluruh transaksi</div>
                </div>

                <div className="dash-box box-slate">
                    <div className="box-title">Total Transaksi</div>
                    <div className="box-number">{orderSummary.total_transactions}</div>
                    <div className="box-desc">Struk pesanan selesai</div>
                </div>

                <div className="dash-box box-slate">
                    <div className="box-title">Katalog Produk</div>
                    <div className="box-number">{totalProducts}</div>
                    <div className="box-desc">Jenis item aktif</div>
                </div>

                <div className="dash-box box-amber">
                    <div className="box-title">Perlu Restock</div>
                    <div className="box-number">{lowStockProducts.length} Item</div>
                    <div className="box-desc">Stok &le; 10 unit</div>
                </div>
            </div>

            <div className="dash-tables-grid">
                <div className="panel-card">
                    <div className="panel-heading">
                        <span>Produk Terlaris</span>
                    </div>
                    <div className="panel-body">
                        {topProducts.length === 0 ? (
                            <p className="empty-text">Belum ada penjualan tercatat.</p>
                        ) : (
                            <table className="compact-table">
                                <thead>
                                    <tr>
                                        <th>Nama Produk</th>
                                        <th style={{ textAlign: 'center', width: '80px' }}>Terjual</th>
                                        <th style={{ textAlign: 'right', width: '120px' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.name}</td>
                                            <td style={{ textAlign: 'center' }}><strong>{item.total_sold}</strong></td>
                                            <td style={{ textAlign: 'right' }}>Rp {Number(item.total_sales).toLocaleString('id-ID')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="panel-card">
                    <div className="panel-heading heading-alert">
                        <span>Peringatan Stok Menipis</span>
                    </div>
                    <div className="panel-body">
                        {lowStockProducts.length === 0 ? (
                            <p className="empty-text" style={{ color: '#16a34a' }}>Semua stok produk saat ini dalam batas aman.</p>
                        ) : (
                            <table className="compact-table">
                                <thead>
                                    <tr>
                                        <th>Nama Produk</th>
                                        <th style={{ textAlign: 'center', width: '90px' }}>Sisa Stok</th>
                                        <th style={{ textAlign: 'center', width: '90px' }}>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockProducts.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className="stock-alert-tag">{item.stock} unit</span>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <Link href={`/products/${item.id}/edit`} className="link-action">
                                                    Restock
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}