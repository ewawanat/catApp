'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Typography from '@mui/material/Typography';

import { Cat } from '@/app/page';
import styles from './CatCard.module.css';
import { error } from 'console';

type CatProps = {
    cat: Cat;
};

const CatCard = ({ cat }: CatProps) => {
    const [favourites, setFavourites] = useState<Cat[]>([]);
    const isFavourite = favourites.some((fav) => fav.id === cat.id); // Check if the cat is in favourites
    const [votes, setVotes] = useState(cat.votes || 0);
    const [addFavouriteError, setAddFavouriteError] = useState<string | null>(null);

    const addFavourite = async (cat: Cat) => {
        try {
            const requestBody = JSON.stringify({
                image_id: cat.id,
                sub_id: 'user-123',
            });

            const response = await fetch('https://api.thecatapi.com/v1/favourites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
                },
                body: requestBody,
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get the error text for more details
                throw new Error(`Failed to add favourite. Status: ${response.status}. ${errorText}`);
            }

            const data = await response.json();
            if (data.message === 'SUCCESS') {
                setFavourites((prev) => [...prev, cat]); // Add to favourites list
            }
        } catch (error) {
            // Log the error details
            console.error('Error adding favourite:', error);
            // Optionally, display a user-friendly error message
            setAddFavouriteError('There was an issue adding the cat to your favourites.');
        }
    };


    const removeFavourite = async (favouriteId: string) => {
        console.log('favouriteId to be removed', favouriteId)
        // try {
        //     const response = await fetch(
        //         `https://api.thecatapi.com/v1/favourites/${favouriteId}`,
        //         {
        //             method: 'DELETE',
        //             headers: {
        //                 'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
        //             },
        //         }
        //     );

        //     if (!response.ok) {
        //         throw new Error('Failed to remove favourite');
        //     }

        //     setFavourites((prev) => prev.filter((fav) => fav.id !== favouriteId)); // Remove from favourites list
        // } catch (error) {
        //     console.error('Error removing favourite:', error);
        // }
    };

    const toggleFavorite = () => {
        if (isFavourite) {
            removeFavourite(cat.id);
        } else {
            addFavourite(cat);
        }
    };

    const voteForCat = async (value: number) => {
        try {
            const response = await fetch('https://api.thecatapi.com/v1/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
                },
                body: JSON.stringify({
                    image_id: cat.id,
                    sub_id: 'user-123', // TODO: change in a real app - for now, just hardcoded user ID
                    value,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to vote for cat');
            }
        } catch (error) {
            console.error('Error voting for cat:', error);
        }
    };

    const handleVoteUp = async () => {
        setVotes((prevVotes) => prevVotes + 1);
        await voteForCat(1);
    };

    const handleVoteDown = async () => {
        setVotes((prevVotes) => prevVotes - 1);
        await voteForCat(-1);
    };

    if (addFavouriteError) return <Typography color="error">{addFavouriteError}</Typography>

    return (

        <div className={styles['cat-card-container']}>
            <Link
                href={{
                    pathname: `/breeds/${cat.id}`,
                    query: {
                        width: cat.width,
                        height: cat.height,
                        image: cat.url,
                    },
                }}
            >
                <Image
                    src={cat.url}
                    alt={`Cat ${cat.id}`}
                    width={cat.width}
                    height={cat.height}
                    className={styles['image-fit']}
                />
            </Link>
            <div className={styles['actions-container']}>
                <IconButton onClick={toggleFavorite} aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
                    {isFavourite ? <FavoriteIcon color='error' /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={handleVoteUp}>
                    <ThumbUpIcon />
                    <Typography variant='body2' ml={1}>Vote Up</Typography>
                </IconButton>
                <IconButton onClick={handleVoteDown}>
                    <ThumbDownIcon />
                    <Typography variant='body2' ml={1}>Vote Down</Typography>
                </IconButton>
            </div>
            <div className={styles['votes-container']}>
                <Typography variant='body2'>Votes: {votes}</Typography>
            </div>
        </div>
    );
};

export default CatCard;
