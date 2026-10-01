import { getDb } from '@/lib/db';
import Link from 'next/link';

export default async function OrdersHistoryPage() {
    const db = getDb();

    const [orders] = await db.query(`
    SELECT 
      o.id AS order_id,
      o.customer_name,
      o.total_amount,
      DATE_FORMAT(o.order_date, '%d-%m-%Y') AS formatted_date,
      p.name AS product_name,
      oi.quantity,
      oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    ORDER BY o.id DESC
  `);

    return (
        <div>
            <div className="home-header">
                <div>
                    <h1 className="home-title">Riwayat Transaksi Penjualan</h1>
                    <span className="home-badge">{orders.length} Transaksi Selesai</span>
                </div>
                <Link href="/orders/create" className="btn-add">
                    + Transaksi Baru
                </Link>
            </div>

            <div className="home-card">
                {orders.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', padding: '24px 0' }}>
                        Belum ada transaksi penjualan yang tercatat.
                    </p>
                ) : (
                    <table className="home-table">
                        <thead>
                            <tr>
                                <th style={{ width: '70px' }}>Nota</th>
                                <th>Tanggal</th>
                                <th>Nama Pelanggan</th>
                                <th>Produk</th>
                                <th>Qty</th>
                                <th>Harga</th>
                                <th>Total Bayar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.order_id}>
                                    <td><strong>#{order.order_id}</strong></td>
                                    <td>{order.formatted_date}</td>
                                    <td>{order.customer_name}</td>
                                    <td>{order.product_name}</td>
                                    <td>{order.quantity}</td>
                                    <td>Rp {order.price.toLocaleString('id-ID')}</td>
                                    <td><strong>Rp {order.total_amount.toLocaleString('id-ID')}</strong></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}