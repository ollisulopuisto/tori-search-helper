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

        // Close button is the X icon, usually strictly inside a button
        // But helper text "Manage Search Presets" has a close button next to it
        const closeBtn = screen.getByRole('button', { name: '' }); // X icon button often has no text
        // Actually, looking at code: <button onClick={onClose}><X /></button>
        // Let's find by class or just first button?
        // Better: Render with specific close button test id or assume it's the one in header.

        // Let's try finding by role button and iterating or use aria-label if I added one.
        // I didn't add aria-label.
        // Let's rely on lucide-react X icon usually rendering an SVG.
        // Let's just use container query.

        fireEvent.click(screen.getAllByRole('button')[0]); // The X button is likely the first one
        expect(onClose).toHaveBeenCalled();
    });
});
