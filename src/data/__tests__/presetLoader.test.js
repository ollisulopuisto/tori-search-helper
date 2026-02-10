import { describe, it, expect } from 'vitest';
import { getAvailablePresets, getPresetById } from '../presetLoader';

describe('presetLoader', () => {
    it('returns at least the example preset', () => {
        const presets = getAvailablePresets();
        expect(presets.length).toBeGreaterThanOrEqual(1);
        expect(presets.some(p => p.id === 'retro-gaming')).toBe(true);
    });

    it('every returned preset passes validation', () => {
        const presets = getAvailablePresets();
        for (const preset of presets) {
            expect(preset.id).toBeDefined();
            expect(preset.name).toBeDefined();
            expect(preset.items.length).toBeGreaterThan(0);
        }
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
