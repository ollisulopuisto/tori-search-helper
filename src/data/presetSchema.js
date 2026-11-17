const REQUIRED_PRESET_FIELDS = ['id', 'name', 'description', 'icon', 'searchBaseUrl', 'categories', 'items'];
const REQUIRED_ITEM_FIELDS = ['id', 'name', 'category', 'searchTerms'];

// Only http(s) URLs are allowed as search base URLs. A local preset stored in
// localStorage can carry an unsafe scheme (e.g. javascript:), which would
// execute when a search link is opened (XSS through the DOM).
const SAFE_URL_PROTOCOLS = ['http:', 'https:'];

/**
 * Returns true when the URL uses an http or https scheme. Unsafe schemes such
 * as javascript:, data: and vbscript: are rejected so they cannot be used to
 * execute code through navigation sinks (window.open, location, <a href>).
 * @param {string} url
 * @returns {boolean}
 */
export const isSafeUrl = (url) => {
    try {
        return SAFE_URL_PROTOCOLS.includes(new URL(url).protocol);
    } catch {
        return false;
    }
};

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

    if (
        preset.searchBaseUrl !== undefined &&
        preset.searchBaseUrl !== null &&
        !isSafeUrl(preset.searchBaseUrl)
    ) {
        errors.push('searchBaseUrl must use http: or https: protocol');
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

            // Security: searchTerms are rendered as text and their `query` is
            // used to build navigation URLs. A malformed entry (e.g. from a
            // tampered local preset stored in localStorage) would crash the UI
            // (`.map` / `.query` on a non-object), so the shape is validated at
            // the gate before untrusted presets reach the renderer.
            if (!Array.isArray(item.searchTerms)) {
                errors.push(`Item ${i}: searchTerms must be an array`);
            } else {
                item.searchTerms.forEach((term, tIdx) => {
                    if (term === null || typeof term !== 'object' || Array.isArray(term)) {
                        errors.push(`Item ${i}: searchTerms[${tIdx}] must be an object`);
                    } else if (term.label === undefined || term.query === undefined) {
                        errors.push(`Item ${i}: searchTerms[${tIdx}] missing label or query`);
                    }
                });
            }
        });
    }

    return { valid: errors.length === 0, errors };
}
