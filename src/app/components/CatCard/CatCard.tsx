"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Typography from "@mui/material/Typography";

import { Cat } from "@/app/page";
import { useFavourites } from "../../../context/FavouritesContext";
import styles from "./CatCard.module.css";

type CatProps = {
    cat: Cat;
};

const CatCard = ({ cat }: CatProps) => {
    const { favourites, addFavourite, removeFavourite } = useFavourites();
    const isFavourite = favourites.some((fav) => fav.id === cat.id);
    const [votes, setVotes] = useState(cat.votes || 0);

    const toggleFavorite = () => {
        if (isFavourite) {
            removeFavourite(cat.id);
        } else {
            addFavourite(cat);
        }
    };

    const voteForCat = async (value: number) => {
        try {
            const response = await fetch("https://api.thecatapi.com/v1/votes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.NEXT_PUBLIC_CAT_API_KEY || "",
                },
                body: JSON.stringify({
                    image_id: cat.id,
                    sub_id: "user-123", // Hardcoded user ID
                    value,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to vote for cat");
            }
        } catch (error) {
            console.error("Error voting for cat:", error);
        }
    };

    const handleVoteUp = async () => {
        setVotes((prevVotes) => prevVotes + 1); // Optimistically update the state
        await voteForCat(1); // Send POST request for upvote
    };

    const handleVoteDown = async () => {
        setVotes((prevVotes) => prevVotes - 1); // Optimistically update the state
        await voteForCat(-1); // Send POST request for downvote
    };

    return (
        <div className={styles["cat-card-container"]}>
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
                    className={styles["image-fit"]}
                />
            </Link>
            <div className={styles["actions-container"]}>
                <IconButton onClick={toggleFavorite} aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}>
                    {isFavourite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={handleVoteUp}>
                    <ThumbUpIcon />
                    <Typography variant="body2" ml={1}>Vote Up</Typography>
                </IconButton>
                <IconButton onClick={handleVoteDown}>
                    <ThumbDownIcon />
                    <Typography variant="body2" ml={1}>Vote Down</Typography>
                </IconButton>
            </div>
            <div className={styles["votes-container"]}>
                <Typography variant="body2">Votes: {votes}</Typography>
            </div>
        </div>
    );
};

export default CatCard;
