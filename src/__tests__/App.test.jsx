import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import * as presetLoader from '../data/presetLoader';

// Mock the preset loader to return a predictable test preset
const mockPreset = {
    id: 'test-preset',
    name: 'Test Preset',
    description: 'Description',
    searchBaseUrl: 'http://test.com?q=',
    categories: ['All', 'Cat1'],
    categoryColors: { Cat1: 'blue' },
    items: [
        {
            id: 'item1',
            name: 'Item 1',
            category: 'Cat1',
            fields: { f: 'v' },
            searchTerms: [{ label: 'S', query: 's' }],
        }
    ],
    warningBanner: { title: 'Warn', rules: ['Rule'] },
    tips: { title: 'Tips', items: ['Tip'] },
};

vi.mock('../data/presetLoader', () => ({
    getAvailablePresets: vi.fn(),
    getPresetById: vi.fn(),
}));

describe('App', () => {
    it('renders the active preset title', () => {
        presetLoader.getAvailablePresets.mockReturnValue([mockPreset]);
        render(<App />);
        expect(screen.getByText(/Test Preset/)).toBeInTheDocument();
        expect(screen.getByText(/Description/)).toBeInTheDocument();
    });

    it('renders items from the preset', () => {
        presetLoader.getAvailablePresets.mockReturnValue([mockPreset]);
        render(<App />);
        expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('renders warning banner and tips', () => {
        presetLoader.getAvailablePresets.mockReturnValue([mockPreset]);
        render(<App />);
        expect(screen.getByText('Warn')).toBeInTheDocument();
        expect(screen.getByText('Tips')).toBeInTheDocument();
    });

    it('switches presets when changed', () => {
        const preset2 = { ...mockPreset, id: 'p2', name: 'Preset 2' };
        presetLoader.getAvailablePresets.mockReturnValue([mockPreset, preset2]);
        render(<App />);

        expect(screen.getByText('Test Preset')).toBeInTheDocument();

        // Switch to Preset 2
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'p2' } });

        expect(screen.getByText('Preset 2')).toBeInTheDocument();
    });
});
