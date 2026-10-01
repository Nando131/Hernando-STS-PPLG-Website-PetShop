import './globals.css';
import Navbar from './components/navbar';

export const metadata = {
  title: 'Hernando Pet Shop',
  description: 'Sistem Informasi Pet Shop - STS RPL',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main className="main-container">
          {children}
        </main>
      </body>
    </html>
  );
}