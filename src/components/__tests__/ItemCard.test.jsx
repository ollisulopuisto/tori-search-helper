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

    it.each(['https://www.tori.fi/recommerce/forsale/search?q=', 'javascript:alert(1)//'])(
        'safely opens item searches from %s with all filters', (searchBaseUrl) => {
            const open = vi.spyOn(window, 'open').mockImplementation(() => null);
            const item = {
                ...mockItem,
                searchTerms: [{ label: 'Special search', query: 'a&sort=EVIL + ä' }],
            };
            render(<ItemCard item={item} preset={{ ...mockPreset, searchBaseUrl }} onTrack={() => { }} />);
            fireEvent.click(screen.getByText('Special search'));
            const url = new URL(open.mock.calls[0][0]);
            expect(url.protocol).toBe('https:');
            expect(url.hostname).toMatch(/^(www\.)?tori\.fi$/);
            expect(url.searchParams.get('q')).toBe('a&sort=EVIL + ä');
            expect(url.searchParams.getAll('sort')).toEqual(['PRICE_ASC']);
            expect(url.searchParams.getAll('trade_type')).toEqual(['1', '2']);
            expect(url.searchParams.getAll('condition')).toEqual(['1', '2', '3', '4']);
            expect(open).toHaveBeenCalledWith(url.href, '_blank', 'noopener,noreferrer');
            open.mockRestore();
        }
    );

    it('renders search term buttons', () => {
        render(<ItemCard item={mockItem} preset={mockPreset} onTrack={() => { }} />);
        expect(screen.getByText('Search It')).toBeInTheDocument();
    });

    it('does not open a javascript: URL when searching by term', () => {
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => { });
        const maliciousPreset = { ...mockPreset, searchBaseUrl: 'javascript:alert(1)//' };
        render(<ItemCard item={mockItem} preset={maliciousPreset} onTrack={() => { }} />);
        fireEvent.click(screen.getByText('Search It'));

        expect(openSpy).toHaveBeenCalledTimes(1);
        const url = String(openSpy.mock.calls[0][0]);
        expect(url).not.toMatch(/^javascript:/i);
        expect(new URL(url).protocol).toBe('https:');

        openSpy.mockRestore();
    });
});
