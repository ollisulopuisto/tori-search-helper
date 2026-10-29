import { describe, it, expect } from 'vitest';
import { buildSearchUrl } from '../searchUrl';

describe('buildSearchUrl', () => {
    it.each([
        'javascript:alert(1)//', 'JaVaScRiPt:alert(1)',
        '\tjava\nscript:alert(1)', 'data:text/html,<script>alert(1)</script>',
        'vbscript:msgbox(1)', 'file:///etc/passwd', '//evil.example/search?q=',
        '/relative?q=', 'not a URL', '', undefined, null, {},
    ])('falls back for an unsafe or malformed base: %s', (base) => {
        const url = new URL(buildSearchUrl(base, 'phone & tablet#<x>'));
        expect(url.origin).toBe('https://tori.fi');
        expect(url.searchParams.get('q')).toBe('phone & tablet#<x>');
    });

    it.each(['http:', 'https:'])('keeps valid %s presets and existing filters', (protocol) => {
        const url = new URL(buildSearchUrl(`${protocol}//example.com/search?category=1&q=old#results`, 'a&b + ä'));
        expect(url.protocol).toBe(protocol);
        expect(url.host).toBe('example.com');
        expect(url.pathname).toBe('/search');
        expect(url.searchParams.get('category')).toBe('1');
        expect(url.searchParams.getAll('q')).toEqual(['a&b + ä']);
        expect(url.hash).toBe('#results');
    });

    it('retains repeated search filters and cannot override the query', () => {
        const params = new URLSearchParams([
            ['sort', 'PRICE_ASC'], ['trade_type', '1'], ['trade_type', '2'], ['q', 'override'],
        ]);
        const url = new URL(buildSearchUrl('https://tori.fi?q=', 'a&sort=EVIL', params));
        expect(url.searchParams.get('q')).toBe('a&sort=EVIL');
        expect(url.searchParams.getAll('sort')).toEqual(['PRICE_ASC']);
        expect(url.searchParams.getAll('trade_type')).toEqual(['1', '2']);
    });
});
