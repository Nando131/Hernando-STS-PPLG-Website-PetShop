'use server';

import { getDb } from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createOrder(formData) {
    const customerName = formData.get('customer_name')?.trim();
    const productId = parseInt(formData.get('product_id'), 10);
    const quantity = parseInt(formData.get('quantity'), 10);

    if (!customerName || isNaN(productId) || isNaN(quantity) || quantity <= 0) {
        throw new Error('Semua data wajib diisi dengan benar!');
    }

    const db = getDb();

    const [productRows] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    const product = productRows[0];

    if (!product) {
        throw new Error('Produk tidak ditemukan!');
    }

    if (product.stock < quantity) {
        throw new Error(`Stok tidak cukup! Sisa stok hanya: ${product.stock}`);
    }

    const subtotal = product.price * quantity;
    const orderDate = new Date().toISOString().split('T')[0];

    const [orderResult] = await db.query(
        'INSERT INTO orders (customer_name, total_amount, order_date) VALUES (?, ?, ?)',
        [customerName, subtotal, orderDate]
    );
    const orderId = orderResult.insertId;

    await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
        [orderId, productId, quantity, product.price, subtotal]
    );

    await db.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [quantity, productId]
    );

    revalidatePath('/');
    revalidatePath('/orders');
    redirect('/orders');
}