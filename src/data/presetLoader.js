import { validatePreset } from './presetSchema.js';

// Auto-load all presets from the ./presets directory.
// This includes both public examples (git tracked) and private data (gitignored).
// 'eager: true' loads them synchronously at build/test time.
const modules = import.meta.glob('./presets/*.js', { eager: true });

const allPresets = Object.values(modules)
    .map(mod => mod.default)
    .filter(Boolean); // Filter out any modules without a default export

// Validate all presets at load time
for (const preset of allPresets) {
    const result = validatePreset(preset);
    if (!result.valid) {
        console.warn(`Preset "${preset.id || 'unknown'}" has validation errors:`, result.errors);
    }
}

/**
 * Returns all available (valid) presets.
 */
export function getAvailablePresets() {
    return allPresets.filter(p => validatePreset(p).valid);
}

/**
 * Returns a preset by its ID, or undefined if not found.
 */
export function getPresetById(id) {
    return allPresets.find(p => p.id === id);
}
