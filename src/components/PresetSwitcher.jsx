import React from 'react';

export default function PresetSwitcher({ presets, activePresetId, onSwitch }) {
    if (presets.length <= 1) return null;

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="preset-switcher" className="text-sm font-medium text-indigo-200">
                Preset:
            </label>
            <select
                id="preset-switcher"
                value={activePresetId}
                onChange={(e) => onSwitch(e.target.value)}
                className="bg-indigo-800 text-white text-sm rounded px-2 py-1 border border-indigo-600 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
            >
                {presets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                        {preset.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
