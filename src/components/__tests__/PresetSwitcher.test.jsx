import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PresetSwitcher from '../PresetSwitcher';

const presets = [
    { id: 'a', name: 'Preset A' },
    { id: 'b', name: 'Preset B' },
];

describe('PresetSwitcher', () => {
    it('renders nothing when there is only one preset', () => {
        const { container } = render(
            <PresetSwitcher presets={[presets[0]]} activePresetId="a" onSwitch={() => { }} />
        );
        expect(container.innerHTML).toBe('');
    });

    it('renders a dropdown with all presets', () => {
        render(<PresetSwitcher presets={presets} activePresetId="a" onSwitch={() => { }} />);
        expect(screen.getByText('Preset A')).toBeInTheDocument();
        expect(screen.getByText('Preset B')).toBeInTheDocument();
    });

    it('calls onSwitch when selection changes', () => {
        const onSwitch = vi.fn();
        render(<PresetSwitcher presets={presets} activePresetId="a" onSwitch={onSwitch} />);
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b' } });
        expect(onSwitch).toHaveBeenCalledWith('b');
    });
});
