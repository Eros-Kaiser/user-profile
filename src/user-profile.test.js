import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserProfile from './user-profile';

// Mock the fetch function
global.fetch = jest.fn();

const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
};

describe('UserProfile Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('renders loading state initially', () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUser,
        });

        render(<UserProfile userId="123" />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders user data when fetch is successful', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUser,
        });

        render(<UserProfile userId="123" />);
        await waitFor(() => expect(screen.getByText(mockUser.name)).toBeInTheDocument());
        expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument();
    });

    test('renders error message when fetch fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
        });

        render(<UserProfile userId="123" />);
        await waitFor(() => expect(screen.getByText('Error: Failed to fetch user data')).toBeInTheDocument());
    });

    test('renders error message when fetch throws an error', async () => {
        fetch.mockRejectedValueOnce(new Error('Network Error'));

        render(<UserProfile userId="123" />);
        await waitFor(() => expect(screen.getByText('Error: Network Error')).toBeInTheDocument());
    });
});
