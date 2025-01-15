// CatCard.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import CatCard from './CatCard'; // Adjust path as necessary
import { useFavourites } from '../../../context/FavouritesContext'; // Adjust path as necessary

// Mock the useFavourites hook
jest.mock('../../../context/FavouritesContext', () => ({
    useFavourites: jest.fn(),
}));

describe('CatCard', () => {
    it('renders and allows voting', () => {
        // Mock the return value of useFavourites
        useFavourites.mockReturnValue({
            favourites: [{ id: '1', url: 'https://example.com/cat.jpg', width: 500, height: 500, votes: 10 }],
            addFavourite: jest.fn(),
            removeFavourite: jest.fn(),
        });

        const cat = {
            id: '1',
            url: 'https://example.com/cat.jpg',
            width: 500,
            height: 500,
            votes: 10,
        };

        render(<CatCard cat={cat} />);

        // Check if the image is rendered
        const image = screen.getByAltText(`Cat ${cat.id}`);
        expect(image).toBeInTheDocument();

        // Check if the votes are displayed correctly
        const votes = screen.getByText(/Votes:/);
        expect(votes).toHaveTextContent('Votes: 10');

        // Simulate clicking the vote up button
        const voteUpButton = screen.getByText('Vote Up');
        fireEvent.click(voteUpButton);

        // Check if the votes count increases
        expect(screen.getByText(/Votes:/)).toHaveTextContent('Votes: 11');
    });

    it('toggles the favourite status', () => {
        // Mock the return value for the favourites context
        useFavourites.mockReturnValue({
            favourites: [{ id: '1', url: 'https://example.com/cat.jpg', width: 500, height: 500, votes: 10 }],
            addFavourite: jest.fn(),
            removeFavourite: jest.fn(),
        });

        const cat = {
            id: '1',
            url: 'https://example.com/cat.jpg',
            width: 500,
            height: 500,
            votes: 10,
        };

        render(<CatCard cat={cat} />);

        // Check if the favourite button is rendered correctly
        const favouriteButton = screen.getByRole('button', { name: /favorite/i });
        fireEvent.click(favouriteButton);

        // Check if the favourite status changes
        expect(useFavourites().addFavourite).toHaveBeenCalledWith(cat);
    });
});
