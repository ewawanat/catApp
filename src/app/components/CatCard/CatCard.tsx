"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cat } from "@/app/page";
import styles from "./CatCard.module.css";
import { useFavourites } from "../../../context/FavouritesContext";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Typography from "@mui/material/Typography";

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

    const handleVoteUp = () => {
        setVotes((prevVotes) => prevVotes + 1);
    };

    const handleVoteDown = () => {
        setVotes((prevVotes) => prevVotes - 1);
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
                    layout="responsive"
                    className={styles["image-fit"]}
                />
            </Link>
            <div className={styles["actions-container"]}>
                <IconButton onClick={toggleFavorite}>
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
