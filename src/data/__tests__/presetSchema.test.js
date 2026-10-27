import { describe, it, expect } from 'vitest';
import { validatePreset } from '../presetSchema';

const validPreset = {
    id: 'test-preset',
    name: 'Test Preset',
    description: 'A test preset',
    icon: 'Search',
    searchBaseUrl: 'https://www.tori.fi/recommerce/forsale/search?q=',
    categories: ['All', 'Cat A'],
    categoryColors: { 'Cat A': 'blue' },
    items: [
        {
            id: 'item-1',
            name: 'Test Item',
            category: 'Cat A',
            fields: { brand: 'Acme' },
            searchTerms: [{ label: 'Test', query: 'test' }],
            notes: 'Some notes',
            warning: null,
        },
    ],
    warningBanner: null,
    tips: null,
};

describe('validatePreset', () => {
    it('accepts a valid preset', () => {
        expect(validatePreset(validPreset)).toEqual({ valid: true, errors: [] });
    });

    it('rejects a preset missing required top-level fields', () => {
        const incomplete = { ...validPreset };
        delete incomplete.id;
        delete incomplete.name;
        const result = validatePreset(incomplete);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing required field: id');
        expect(result.errors).toContain('Missing required field: name');
    });

    it('rejects a preset with empty items array', () => {
        const result = validatePreset({ ...validPreset, items: [] });
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Preset must have at least one item');
    });

    it('rejects items missing required fields', () => {
        const badItem = { id: 'x' }; // missing name, category, searchTerms
        const result = validatePreset({ ...validPreset, items: [badItem] });
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('name'))).toBe(true);
    });

    it('rejects non-array categories', () => {
        const result = validatePreset({ ...validPreset, categories: 'nope' });
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('categories must be an array');
    });

    it('accepts a preset with optional warningBanner and tips', () => {
        const withExtras = {
            ...validPreset,
            warningBanner: { title: 'Warning', rules: ['Rule 1'] },
            tips: { title: 'Tips', items: ['Tip 1'] },
        };
        expect(validatePreset(withExtras)).toEqual({ valid: true, errors: [] });
    });
});
