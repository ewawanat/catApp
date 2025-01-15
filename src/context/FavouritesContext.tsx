"use client";
import React, { createContext, useContext, useState } from "react";
import { Cat } from "@/app/page";

type FavouritesContextType = {
    favourites: Cat[];
    addFavourite: (cat: Cat) => void;
    removeFavourite: (catId: string) => void;
};

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export const FavouritesProvider = ({ children }: { children: React.ReactNode }) => {
    const [favourites, setFavourites] = useState<Cat[]>([]);

    const addFavourite = (cat: Cat) => {
        setFavourites((prev) => [...prev, cat]);
        //add logic for making the POST request to update the favourites on backend
    };

    const removeFavourite = (catId: string) => {
        setFavourites((prev) => prev.filter((cat) => cat.id !== catId));
        //add logic for making the POST request to update the favourites on backend

    };

    return (
        <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite }}>
            {children}
        </FavouritesContext.Provider>
    );
};

export const useFavourites = () => {
    const context = useContext(FavouritesContext);
    if (!context) {
        throw new Error("useFavourites must be used within a FavouritesProvider");
    }
    return context;
};