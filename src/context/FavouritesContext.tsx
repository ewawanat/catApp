// 'use client';

// import React, { createContext, useContext, useState, useCallback } from 'react';
// import { Cat } from '@/app/page';

// type FavouritesContextType = {
//     favourites: Cat[];
//     addFavourite: (cat: Cat) => void;
//     removeFavourite: (catId: string) => void;
//     fetchFavourites: () => void;
//     loading: boolean;
//     error: string | null;
// };

// const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

// export const FavouritesProvider = ({ children }: { children: React.ReactNode }) => {
//     const [favourites, setFavourites] = useState<Cat[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const fetchFavourites = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await fetch(
//                 'https://api.thecatapi.com/v1/favourites?limit=20&sub_id=user-123&order=DESC',
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
//                     },
//                 }
//             );

//             if (!response.ok) {
//                 throw new Error('Failed to fetch favourites');
//             }

//             const data = await response.json();
//             console.log('AAAdata', data)
//             setFavourites(data);
//         } catch (err) {
//             setError('Error fetching favourites');
//             console.error('Error fetching favourites:', err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     const addFavourite = async (cat: Cat) => {
//         try {
//             const response = await fetch('https://api.thecatapi.com/v1/favourites', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
//                 },
//                 body: JSON.stringify({
//                     image_id: cat.id,
//                     sub_id: 'user-123',
//                 }),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to add favourite');
//             }

//             const data = await response.json();
//             setFavourites((prev) => [...prev, data]);
//         } catch (error) {
//             console.error('Error adding favourite:', error);
//         }
//     };

//     const removeFavourite = async (favouriteId: string) => {
//         try {
//             const response = await fetch(
//                 `https://api.thecatapi.com/v1/favourites/${favouriteId}`,
//                 {
//                     method: 'DELETE',
//                     headers: {
//                         'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
//                     },
//                 }
//             );

//             if (!response.ok) {
//                 throw new Error('Failed to remove favourite');
//             }

//             setFavourites((prev) => prev.filter((fav) => fav.id !== favouriteId));
//         } catch (error) {
//             console.error('Error removing favourite:', error);
//         }
//     };

//     return (
//         <FavouritesContext.Provider
//             value={{
//                 favourites,
//                 addFavourite,
//                 removeFavourite,
//                 fetchFavourites,
//                 // loading,
//                 error,
//             }}
//         >
//             {children}
//         </FavouritesContext.Provider>
//     );
// };

// export const useFavourites = () => {
//     const context = useContext(FavouritesContext);
//     if (!context) {
//         throw new Error('useFavourites must be used within a FavouritesProvider');
//     }
//     return context;
// };
