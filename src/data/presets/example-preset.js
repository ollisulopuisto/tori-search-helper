/**
 * Retro Gaming Consoles — Example Preset
 *
 * Demonstrates the preset format for Tori Scout.
 * Search for classic gaming consoles on tori.fi.
 */
const retroGaming = {
    id: 'retro-gaming',
    name: 'Retro Gaming Consoles',
    description: 'Hunt for classic gaming consoles on tori.fi',
    icon: 'Gamepad2',
    searchBaseUrl: 'https://www.tori.fi/recommerce/forsale/search?q=',
    warningBanner: {
        title: 'Buying Tips:',
        rules: [
            'Always ask for photos of the connectors — corroded pins are a common issue.',
            'Test before paying if picking up in person.',
            'Original controllers add significant value — check if included.',
        ],
    },
    tips: {
        title: 'Pricing Guide (Finland)',
        items: [
            'Toridiili: Use it for shipped items — protects your money until delivery.',
            'Complete-in-box (CIB) items command 2–3x the price of loose consoles.',
            'Japanese imports (NTSC-J) are cheaper but need a voltage converter.',
        ],
    },
    categories: ['All', 'Nintendo', 'Sony', 'Sega'],
    categoryColors: {
        Nintendo: 'red',
        Sony: 'blue',
        Sega: 'purple',
    },
    items: [
        {
            id: 'nes',
            name: 'Nintendo NES (8-bit)',
            category: 'Nintendo',
            fields: {
                generation: '3rd (8-bit)',
                year: '1986 (EU)',
                connectors: 'RF / Composite',
            },
            searchTerms: [
                { label: 'NES', query: 'NES' },
                { label: 'Nintendo 8-bit', query: 'Nintendo 8-bit' },
            ],
            notes: 'The OG. Look for the "toaster" model. Blinking light issue is fixable by replacing the 72-pin connector (~5€ part).',
            warning: 'Many listings are just the console with no cables or controllers. Verify what is included.',
        },
        {
            id: 'snes',
            name: 'Super Nintendo (SNES)',
            category: 'Nintendo',
            fields: {
                generation: '4th (16-bit)',
                year: '1992 (EU)',
                connectors: 'SCART / Composite',
            },
            searchTerms: [
                { label: 'Super Nintendo', query: 'Super Nintendo' },
                { label: 'SNES', query: 'SNES' },
            ],
            notes: 'The PAL version runs at 50Hz. For 60Hz, look for a US/JP import or mod it.',
            warning: null,
        },
        {
            id: 'n64',
            name: 'Nintendo 64',
            category: 'Nintendo',
            fields: {
                generation: '5th (64-bit)',
                year: '1997 (EU)',
                connectors: 'Composite / S-Video',
            },
            searchTerms: [
                { label: 'Nintendo 64', query: 'Nintendo 64' },
                { label: 'N64', query: 'N64' },
            ],
            notes: 'Check the analog stick — worn sticks are loose and floppy. Replacement sticks are cheap (~8€).',
            warning: null,
        },
        {
            id: 'ps1',
            name: 'PlayStation 1 (PS1)',
            category: 'Sony',
            fields: {
                generation: '5th (32-bit)',
                year: '1995 (EU)',
                connectors: 'Composite / SCART',
            },
            searchTerms: [
                { label: 'PlayStation 1', query: 'PlayStation 1' },
                { label: 'PS1', query: 'PS1' },
                { label: 'PSX', query: 'PSX' },
            ],
            notes: 'The slim "PSone" model (SCPH-10x) is more reliable and compact. Both models are common on tori.fi.',
            warning: null,
        },
        {
            id: 'ps2',
            name: 'PlayStation 2 (PS2)',
            category: 'Sony',
            fields: {
                generation: '6th (128-bit)',
                year: '2000 (EU)',
                connectors: 'Composite / Component / SCART',
            },
            searchTerms: [
                { label: 'PlayStation 2', query: 'PlayStation 2' },
                { label: 'PS2', query: 'PS2' },
            ],
            notes: 'The slim model runs cooler and quieter. Fat models (SCPH-3xxxx) have a hard drive bay for modding.',
            warning: 'Disc read errors are very common on fat models — the laser wears out. Ask if it reads DVDs and CDs.',
        },
        {
            id: 'megadrive',
            name: 'Sega Mega Drive (Genesis)',
            category: 'Sega',
            fields: {
                generation: '4th (16-bit)',
                year: '1990 (EU)',
                connectors: 'RF / SCART',
            },
            searchTerms: [
                { label: 'Mega Drive', query: 'Mega Drive' },
                { label: 'Sega Genesis', query: 'Genesis Sega' },
            ],
            notes: 'Model 1 (HD Graphics) has better audio output. The Mega Drive II is more common in Finland.',
            warning: null,
        },
    ],
};

export default retroGaming;
