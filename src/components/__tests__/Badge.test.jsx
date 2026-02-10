import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
    it('renders children text', () => {
        render(<Badge>Test Label</Badge>);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('applies the correct color class', () => {
        render(<Badge color="red">Red Badge</Badge>);
        const badge = screen.getByText('Red Badge');
        expect(badge.className).toContain('bg-red-100');
    });

    it('falls back to gray for unknown colors', () => {
        render(<Badge color="neon">Unknown</Badge>);
        const badge = screen.getByText('Unknown');
        expect(badge.className).toContain('bg-gray-100');
    });

    it('defaults to blue when no color is provided', () => {
        render(<Badge>Default</Badge>);
        const badge = screen.getByText('Default');
        expect(badge.className).toContain('bg-blue-100');
    });
});
