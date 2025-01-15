import * as React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import CatCard from './CatCard';
import { useFavourites } from '../../../context/FavouritesContext';

jest.mock('../../../context/FavouritesContext', () => ({
    useFavourites: jest.fn(),
}));
expect.extend(toHaveNoViolations); // Extending jest to use axe matcher


describe('CatCard', () => {
    const cat = {
        id: '1',
        url: 'https://example.com/cat.jpg',
        width: 500,
        height: 500,
        votes: 10,
    };
    it('renders and allows voting', async () => {
        // Mock the return value of useFavourites
        useFavourites.mockReturnValue({
            favourites: [{ id: '1', url: 'https://example.com/cat.jpg', width: 500, height: 500, votes: 10 }],
            addFavourite: jest.fn(),
            removeFavourite: jest.fn(),
        });

        render(<CatCard cat={cat} />);
        // Check if the image is rendered
        const image = screen.getByRole('img', { name: /cat 1/i });
        expect(image).toBeInTheDocument();

        // Check if the votes are displayed correctly
        const votes = screen.getByText(/Votes:/);
        expect(votes).toHaveTextContent('Votes: 10');

        // Simulate clicking the vote up button
        const voteUpButton = screen.getByText('Vote Up');
        await userEvent.click(voteUpButton);

        // Check if the votes count increases
        expect(screen.getByText(/Votes:/)).toHaveTextContent('Votes: 11');
    });

    it('toggles the favourite status', async () => {
        const addFavouriteMock = jest.fn();
        const removeFavouriteMock = jest.fn();

        // Mock the return value for the favourites context
        useFavourites.mockReturnValue({
            favourites: [{ id: '1', url: 'https://example.com/cat.jpg', width: 500, height: 500, votes: 10 }],
            addFavourite: addFavouriteMock,
            removeFavourite: removeFavouriteMock,
        });



        render(<CatCard cat={cat} />);

        // Check if the favourite button is rendered correctly
        const favouriteButton = screen.getByRole('button', { name: /remove from favourites/i });
        await userEvent.click(favouriteButton);

        // Check if the removeFavourite function was called
        expect(removeFavouriteMock).toHaveBeenCalledWith(cat.id);

        // Update mock to simulate the cat not being a favourite anymore
        useFavourites.mockReturnValue({
            favourites: [],
            addFavourite: addFavouriteMock,
            removeFavourite: removeFavouriteMock,
        });

        // Re-render the component to reflect the updated favourites state
        render(<CatCard cat={cat} />);

        const addFavouriteButton = screen.getByRole('button', { name: /add to favourites/i });
        await userEvent.click(addFavouriteButton);

        // Check if the addFavourite function was called
        expect(addFavouriteMock).toHaveBeenCalledWith(cat);
    });
    it('matches the snapshot', () => {
        const addFavouriteMock = jest.fn();
        const removeFavouriteMock = jest.fn();

        // Mock the return value for the favourites context
        useFavourites.mockReturnValue({
            favourites: [{ id: '1', url: 'https://example.com/cat.jpg', width: 500, height: 500, votes: 10 }],
            addFavourite: addFavouriteMock,
            removeFavourite: removeFavouriteMock,
        });
        const { asFragment } = render(<CatCard cat={cat} />);

        // Take a snapshot of the component
        expect(asFragment()).toMatchSnapshot();
    });
    it('should have no accessibility violations', async () => {
        const { container } = render(<CatCard cat={cat} />);

        // Check for accessibility violations
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});