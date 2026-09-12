import { validatePreset } from './presetSchema.js';

// Auto-load all presets from the ./presets directory.
// This includes both public examples (git tracked) and private data (gitignored).
// 'eager: true' loads them synchronously at build/test time.
const modules = import.meta.glob('./presets/*.js', { eager: true });

const filePresets = Object.values(modules)
    .map(mod => mod.default)
    .filter(Boolean);

// Validate file presets at load time
for (const preset of filePresets) {
    const result = validatePreset(preset);
    if (!result.valid) {
        console.warn(`File Preset "${preset.id || 'unknown'}" has validation errors:`, result.errors);
    }
}

const LOCAL_STORAGE_KEY = 'toriwrt_custom_presets';

export function getLocalPresets() {
    try {
        const json = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!json) return [];
        const presets = JSON.parse(json);
        return Array.isArray(presets) ? presets.map(p => ({ ...p, isLocal: true })) : [];
    } catch (e) {
        console.warn('Failed to load local presets', e);
        return [];
    }
}

export function saveLocalPreset(preset) {
    const presets = getLocalPresets();
    const index = presets.findIndex(p => p.id === preset.id);

    if (index >= 0) {
        presets[index] = preset;
    } else {
        presets.push(preset);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(presets));
    return presets;
}

export function deleteLocalPreset(id) {
    const presets = getLocalPresets().filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(presets));
    return presets;
}

/**
 * Returns all available (valid) presets (File + Local).
 */
export function getAvailablePresets() {
    const local = getLocalPresets();
    // Filter out invalid local presets to be safe
    const validLocal = local.filter(p => validatePreset(p).valid);

    // Local presets with same ID as file presets will override file presets?
    // Or should file presets be immutable?
    // Let's say local presets override file presets if IDs clash, allowing users to "edit" built-ins locally.
    // Actually, easiest is just merge.

    const combined = [...filePresets];

    validLocal.forEach(p => {
        const idx = combined.findIndex(existing => existing.id === p.id);
        if (idx >= 0) {
            combined[idx] = p; // Override
        } else {
            combined.push(p);
        }
    });

    return combined;
}

/**
 * Returns a preset by its ID.
 */
export function getPresetById(id) {
    return getAvailablePresets().find(p => p.id === id);
}
