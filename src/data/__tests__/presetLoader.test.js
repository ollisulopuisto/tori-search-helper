import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
    getAvailablePresets,
    getPresetById,
    saveLocalPreset,
    deleteLocalPreset,
    getLocalPresets
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
});
