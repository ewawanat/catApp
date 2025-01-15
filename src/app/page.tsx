"use client";
import React, { useState, useEffect, useCallback } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';

import CatBreedSelector from "./components/CatBreedSelector/CatBreedSelector";
import CatList from "./components/CatList/CatList";

import styles from "./HomePage.module.css";

export type Weight = {
  imperial: string;
  metric: string;
};
export type Breed = {
  id: string;
  weight: Weight;
  life_span: string;
};
export type Cat = {
  id: string;
  url: string;
  height: number;
  width: number;
  votes?: number;
  breeds?: Breed[];
};

type Image = {
  id: string;
  url: string;
}

type Vote = {
  id: string;
  image_id: string;
  sub_id: string;
  created_at: string;
  value: number;
  country_code: string;
  image: Image;
};

const HomePage = () => {
  const [catData, setCatData] = useState<Cat[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVotesForCats = useCallback(async () => {
    try {
      const response = await fetch(`https://api.thecatapi.com/v1/votes`, {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
        },
      });
      console.log('response', response)
      response.headers.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching votes:', errorText);
        return [];
      }
      const data = await response.json()
      return data || [];
    } catch (error) {
      console.error('Error fetching votes:', error);
      return [];
    }
  }, []);

  const fetchCats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=10&has_breeds=1', {
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY || '',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data: Cat[] = await response.json();
      const votesData = await fetchVotesForCats();
      const catsWithVotes = data.map((cat) => {
        const catVotes = votesData.filter((vote: Vote) => vote.image_id === cat.id);
        const totalVotes = catVotes.reduce((sum: number, vote: Vote) => sum + vote.value, 0);
        return { ...cat, votes: totalVotes };
      });
      setCatData(catsWithVotes);
    } catch (error) {
      console.error('Error fetching cats:', error);
      setError('Error fetching cats');
    } finally {
      setLoading(false);
    }
  }, [fetchVotesForCats]);

  useEffect(() => {
    fetchCats();
  }, [selectedBreed, fetchCats]);

  const handleBreedSelect = (breedId: string | null) => {
    setSelectedBreed(breedId);
  };

  return (
    <div className={styles.container}>
      <Typography variant="h4" gutterBottom>
        Cat Images
      </Typography>
      <CatBreedSelector onBreedSelect={handleBreedSelect} />
      {loading && (
        <div className={styles['spinner-container']}>
          <Typography variant="h6">Fetching your cats...</Typography>
          <CircularProgress />
        </div>
      )}
      {error && (
        <Typography color="error">{error}</Typography>
      )}
      {!loading && !error && <CatList catData={catData} />}
    </div>
  );
};

export default HomePage;
