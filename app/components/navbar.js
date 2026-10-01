'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <header className="navbar">
            <div className="nav-container">
                <Link href="/" className="nav-brand" onClick={closeSidebar}>
                    Hernando Pet Shop
                </Link>

                {/* Tombol Hamburger (Khusus Layar HP) */}
                <button
                    type="button"
                    className="hamburger-btn"
                    onClick={toggleSidebar}
                    aria-label="Buka Menu"
                >
                    {isOpen ? '✕' : '☰'}
                </button>

                {/* Menu Mendatar (Desktop) */}
                <nav className="desktop-menu">
                    <Link href="/dashboard" className="nav-link"> Dashboard</Link>
                    <Link href="/" className="nav-link">Katalog Produk</Link>
                    <Link href="/products/create" className="nav-link">+ Tambah Produk</Link>
                    <Link href="/orders/create" className="nav-link">Transaksi Baru</Link>
                    <Link href="/orders" className="nav-link">Riwayat Transaksi</Link>
                </nav>
            </div>

            {/* Latar Belakang Gelap */}
            {isOpen && <div className="sidebar-backdrop" onClick={closeSidebar}></div>}

            {/* Sidebar (Mobile) */}
            <aside className={`mobile-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="sidebar-title">Menu Pet Shop</span>
                    <button type="button" className="sidebar-close-btn" onClick={closeSidebar}>✕</button>
                </div>
                <nav className="sidebar-links">
                    <Link href="/dashboard" className="sidebar-link" onClick={closeSidebar}>
                        Dashboard Ringkasan
                    </Link>
                    <Link href="/" className="sidebar-link" onClick={closeSidebar}>
                        Katalog Produk
                    </Link>
                    <Link href="/products/create" className="sidebar-link" onClick={closeSidebar}>
                        Tambah Produk
                    </Link>
                    <Link href="/orders/create" className="sidebar-link" onClick={closeSidebar}>
                        Transaksi Baru
                    </Link>
                    <Link href="/orders" className="sidebar-link" onClick={closeSidebar}>
                        Riwayat Transaksi
                    </Link>
                </nav>
            </aside>
        </header>
    );
}