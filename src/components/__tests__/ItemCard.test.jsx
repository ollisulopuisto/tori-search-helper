import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ItemCard from '../ItemCard';

const mockPreset = {
    id: 'test',
    searchBaseUrl: 'https://www.tori.fi/recommerce/forsale/search?q=',
    categoryColors: { Budget: 'green', Premium: 'gold' },
};

const mockItem = {
    id: 'item-1',
    name: 'Test Item',
    category: 'Budget',
    fields: { chipset: 'Test Chip', specs: '256MB' },
    searchTerms: [{ label: 'Search It', query: 'test-query' }],
    notes: 'Test notes here.',
    warning: null,
};

describe('ItemCard', () => {
    it('renders item name and category', () => {
        render(<ItemCard item={mockItem} preset={mockPreset} onTrack={() => { }} />);
        expect(screen.getByText('Test Item')).toBeInTheDocument();
        expect(screen.getByText('Budget')).toBeInTheDocument();
    });

    it('renders item fields', () => {
        render(<ItemCard item={mockItem} preset={mockPreset} onTrack={() => { }} />);
        expect(screen.getByText('Test Chip')).toBeInTheDocument();
        expect(screen.getByText('256MB')).toBeInTheDocument();
    });

    it('renders notes', () => {
        render(<ItemCard item={mockItem} preset={mockPreset} onTrack={() => { }} />);
        expect(screen.getByText('Test notes here.')).toBeInTheDocument();
    });

    it('renders warning when present', () => {
        const withWarning = { ...mockItem, warning: 'Danger zone!' };
        render(<ItemCard item={withWarning} preset={mockPreset} onTrack={() => { }} />);
        expect(screen.getByText('Danger zone!')).toBeInTheDocument();
    });

    it('does not render warning when null', () => {
        render(<ItemCard item={mockItem} preset={mockPreset} onTrack={() => { }} />);
        expect(screen.queryByText('Danger zone!')).not.toBeInTheDocument();
    });

    it('calls onTrack when Add to Candidates is clicked', () => {
        const onTrack = vi.fn();
        render(<ItemCard item={mockItem} preset={mockPreset} onTrack={onTrack} />);
        fireEvent.click(screen.getByText('Add to Candidates'));
        expect(onTrack).toHaveBeenCalledWith(mockItem);
    });

    it('renders search term buttons', () => {
        render(<ItemCard item={mockItem} preset={mockPreset} onTrack={() => { }} />);
        expect(screen.getByText('Search It')).toBeInTheDocument();
    });
});
