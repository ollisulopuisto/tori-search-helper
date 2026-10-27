import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
// Mock lucide icons to avoid SVGSVGElement issues if necessary, but usually fine.
// Mock PresetEditor to simplify testing Manager logic
vi.mock('../PresetEditor', () => ({
    default: ({ onCancel, onSave }) => (
        <div data-testid="preset-editor">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={() => onSave({ id: 'new', name: 'New' })}>Save</button>
        </div>
    )
}));

vi.mock('../data/presetLoader', () => ({
    saveLocalPreset: vi.fn(),
    deleteLocalPreset: vi.fn(),
}));

import PresetManager from '../PresetManager';

const mockPresets = [
    { id: 'p1', name: 'Built-in 1', isLocal: false, description: 'Desc 1' },
    { id: 'p2', name: 'Custom 1', isLocal: true, description: 'Desc 2' },
];

describe('PresetManager', () => {
    it('renders presets separarting local and built-in', () => {
        render(<PresetManager presets={mockPresets} onClose={() => { }} />);

        expect(screen.getByText('Built-in 1')).toBeInTheDocument();
        expect(screen.getByText('Custom 1')).toBeInTheDocument();
        expect(screen.getByText('File')).toBeInTheDocument(); // Badge for file presets
    });

    it('allows creating a new preset', () => {
        const onRefresh = vi.fn();
        render(<PresetManager presets={mockPresets} onClose={() => { }} onRefresh={onRefresh} />);

        // Click New Preset
        fireEvent.click(screen.getByText('New Preset'));

        // Should show Editor
        expect(screen.getByTestId('preset-editor')).toBeInTheDocument();
    });

    it('allows editing a custom preset', () => {
        render(<PresetManager presets={mockPresets} onClose={() => { }} />);

        // Find edit button for Custom 1
        const editBtns = screen.getAllByTitle('Edit');
        fireEvent.click(editBtns[0]);

        expect(screen.getByTestId('preset-editor')).toBeInTheDocument();
    });

    it('calls onClose when closed', () => {
        const onClose = vi.fn();
        render(<PresetManager presets={mockPresets} onClose={onClose} />);

        fireEvent.click(screen.getAllByRole('button')[0]); // The X button is likely the first one
        expect(onClose).toHaveBeenCalled();
    });
});
