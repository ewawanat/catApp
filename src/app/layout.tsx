import '../styles/globals.css';
import Header from './components/Header/Header';
import { FavouritesProvider } from '../context/FavouritesContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <FavouritesProvider>
          <Header />
          {children}
        </FavouritesProvider>
      </body>
    </html>
  );
}
