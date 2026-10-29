const DEFAULT_SEARCH_URL = 'https://tori.fi?q=';

// Presets can come from localStorage or imported JSON. Never return their raw
// URL: construct a new URL with a literal HTTP(S) prefix at the output boundary.
export function buildSearchUrl(searchBaseUrl, query, extraParams) {
    let url;
    try {
        if (typeof searchBaseUrl !== 'string') throw new TypeError('Missing URL');
        url = new URL(searchBaseUrl);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
            throw new TypeError('Unsafe URL protocol');
        }
    } catch {
        url = new URL(DEFAULT_SEARCH_URL);
    }

    url.searchParams.set('q', query || '');
    for (const [key, value] of extraParams || []) {
        if (key !== 'q') url.searchParams.append(key, value);
    }

    // A validated protocol is not enough if the original string is returned.
    // Only the host/path/query/fragment can be influenced by preset data here.
    return url.protocol === 'https:'
        ? `https://${url.host}${url.pathname}${url.search}${url.hash}`
        : `http://${url.host}${url.pathname}${url.search}${url.hash}`;
}
