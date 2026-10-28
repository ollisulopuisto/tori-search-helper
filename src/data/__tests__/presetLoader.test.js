import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    getAvailablePresets,
    getPresetById,
    saveLocalPreset,
    deleteLocalPreset,
    getLocalPresets,
    getSafeSearchBaseUrl,
} from '../presetLoader';

describe('presetLoader', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    const mockLocalPreset = {
        id: 'local-preset',
        name: 'Local Preset',
        description: 'A local test preset',
        icon: 'Star',
        items: [{ id: 'i1', name: 'Item', category: 'C', searchTerms: [] }],
        searchBaseUrl: 'http://foo.com',
        categories: ['C'],
    };

    it('returns at least the example preset', () => {
        const presets = getAvailablePresets();
        expect(presets.length).toBeGreaterThanOrEqual(1);
        expect(presets.some(p => p.id === 'retro-gaming')).toBe(true);
    });

    it('saves and retrieves a local preset', () => {
        saveLocalPreset(mockLocalPreset);
        const local = getLocalPresets();
        expect(local).toHaveLength(1);
        expect(local[0].id).toBe('local-preset');

        // Also check merged list
        const all = getAvailablePresets();
        expect(all.some(p => p.id === 'local-preset')).toBe(true);
    });

    it('overwrites existing local preset with same ID', () => {
        saveLocalPreset(mockLocalPreset);
        saveLocalPreset({ ...mockLocalPreset, name: 'Updated Name' });

        const local = getLocalPresets();
        expect(local).toHaveLength(1);
        expect(local[0].name).toBe('Updated Name');
    });

    it('deletes a local preset', () => {
        saveLocalPreset(mockLocalPreset);
        deleteLocalPreset('local-preset');

        const local = getLocalPresets();
        expect(local).toHaveLength(0);

        const all = getAvailablePresets();
        expect(all.some(p => p.id === 'local-preset')).toBe(false);
    });

    it('finds a preset by ID', () => {
        const preset = getPresetById('retro-gaming');
        expect(preset).toBeDefined();
        expect(preset.name).toBe('Retro Gaming Consoles');
    });

    it('returns undefined for unknown preset ID', () => {
        expect(getPresetById('nonexistent')).toBeUndefined();
    });

    it('excludes a local preset with an unsafe searchBaseUrl scheme', () => {
        saveLocalPreset({ ...mockLocalPreset, searchBaseUrl: 'javascript:alert(1)//' });
        const all = getAvailablePresets();
        expect(all.some((p) => p.id === 'local-preset')).toBe(false);
    });
});

describe('getSafeSearchBaseUrl', () => {
    it('passes http and https URLs through unchanged', () => {
        expect(getSafeSearchBaseUrl('https://www.tori.fi/search?q=')).toBe(
            'https://www.tori.fi/search?q=',
        );
        expect(getSafeSearchBaseUrl('http://foo.com/q=')).toBe('http://foo.com/q=');
    });

    it('falls back to the default https URL for javascript: scheme', () => {
        expect(getSafeSearchBaseUrl('javascript:alert(1)//')).toBe('https://tori.fi?q=');
    });

    it('falls back for data: and vbscript: schemes', () => {
        expect(getSafeSearchBaseUrl('data:text/html,<script>alert(1)</script>')).toBe(
            'https://tori.fi?q=',
        );
        expect(getSafeSearchBaseUrl('vbscript:msgbox(1)')).toBe('https://tori.fi?q=');
    });

    it('falls back for invalid or missing URLs', () => {
        expect(getSafeSearchBaseUrl(undefined)).toBe('https://tori.fi?q=');
        expect(getSafeSearchBaseUrl('not-a-url')).toBe('https://tori.fi?q=');
        expect(getSafeSearchBaseUrl('', 'https://custom.fallback/q=')).toBe(
            'https://custom.fallback/q=',
        );
    });
});
