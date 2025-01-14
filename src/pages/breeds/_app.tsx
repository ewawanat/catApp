import "../../styles/globals.css"; // Global styles
import { AppProps } from 'next/app'; // Import AppProps from next/app

import { FavouritesProvider } from "../../context/FavouritesContext"; // Context provider
import Header from "../../app/components/Header/Header"; // Header component

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <FavouritesProvider>
            <Header />
            <Component {...pageProps} />
        </FavouritesProvider>
    );
}

export default MyApp;
