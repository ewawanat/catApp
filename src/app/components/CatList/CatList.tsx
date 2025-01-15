'use client';

import React from 'react';
import { Cat } from '@/app/page';
import CatCard from '../CatCard/CatCard';
import styles from './CatList.module.css'

type CatListProps = {
    catData: Cat[];
};

const CatList = ({ catData }: CatListProps) => {
    const catCards = catData.map((cat) => {
        return <CatCard key={cat.id} cat={cat} />
    })
    return (
        <div className={styles['cat-list-container']}>
            {catCards && catCards}
        </div>
    );
};

export default CatList;
