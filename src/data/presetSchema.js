const REQUIRED_PRESET_FIELDS = ['id', 'name', 'description', 'icon', 'searchBaseUrl', 'categories', 'items'];
const REQUIRED_ITEM_FIELDS = ['id', 'name', 'category', 'searchTerms'];

/**
 * Validates a preset object has all required fields and correct types.
 * @param {object} preset
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePreset(preset) {
    const errors = [];

    for (const field of REQUIRED_PRESET_FIELDS) {
        if (preset[field] === undefined || preset[field] === null) {
            errors.push(`Missing required field: ${field}`);
        }
    }

    if (preset.categories !== undefined && !Array.isArray(preset.categories)) {
        errors.push('categories must be an array');
    }

    if (Array.isArray(preset.items)) {
        if (preset.items.length === 0) {
            errors.push('Preset must have at least one item');
        }

        preset.items.forEach((item, i) => {
            for (const field of REQUIRED_ITEM_FIELDS) {
                if (item[field] === undefined || item[field] === null) {
                    errors.push(`Item ${i}: missing required field: ${field}`);
                }
            }
        });
    }

    return { valid: errors.length === 0, errors };
}
