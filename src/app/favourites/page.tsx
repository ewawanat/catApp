'use client';

import React from 'react';
import { useFavourites } from '../../context/FavouritesContext';
import CatCard from '../components/CatCard/CatCard';
import styles from './Favourites.module.css';

const FavouritesPage = () => {
    const { favourites } = useFavourites();
    //TODO: make sure the previous favourites are fetched and displayed 

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
