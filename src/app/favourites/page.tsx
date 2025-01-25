'use client';

import React, { useEffect, useState } from 'react';
import { Cat } from '../../app/page';
import CatCard from '../components/CatCard/CatCard';
import styles from './Favourites.module.css';

const FavouritesPage = () => {
    const [favourites, setFavourites] = useState<Cat[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavourites = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    'https://api.thecatapi.com/v1/favourites?limit=20&sub_id=user-123&order=DESC',
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch favourites');
                }

                const data = await response.json();
                console.log('Fetched favourites:', data);

                // Ensure that each cat has a valid URL
                const validFavourites = data.filter((cat: Cat) => cat.url);
                setFavourites(validFavourites);
            } catch (err) {
                setError('Error fetching favourites');
                console.error('Error fetching favourites:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavourites();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (favourites.length === 0) {
        return <p className={styles['no-favourites']}>No favourites yet!</p>;
    }

    return (
        <div className={styles['favourites-container']}>
            {favourites.map((cat) => (
                <CatCard key={cat.id} cat={cat} />
            ))}
        </div>
    );
};

export default FavouritesPage;
