'use server';

import { getDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addProduct(formData) {
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
}

export async function updateProduct(formData) {
    const id = formData.get('id');
    const name = formData.get('name')?.trim();
    const category_id = formData.get('category_id');
    const price = parseInt(formData.get('price'), 10);
    const stock = parseInt(formData.get('stock'), 10);

    const db = getDb();
    await db.query(
        'UPDATE products SET category_id = ?, name = ?, price = ?, stock = ? WHERE id = ?',
        [category_id, name, price, stock, id]
    );

    revalidatePath('/');
    redirect('/');
}

export async function deleteProduct(formData) {
    const id = formData.get('id');
    const db = getDb();
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    revalidatePath('/');
}