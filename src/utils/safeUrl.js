// Vain http(s)-perustaiset URL:it sallitaan hakupohjana. Paikallinen
// (käyttäjän luoma) preset tallennetaan localStorageen, joten sen
// searchBaseUrl voi olla epäturvallinen skeemi (esim. javascript:), joka
// suorittaessa tuloslinkkiä aiheuttaa XSS:n DOMin kautta.
export const SAFE_URL_PROTOCOLS = ['http:', 'https:'];

export const isSafeUrl = (url) => {
    try {
        return SAFE_URL_PROTOCOLS.includes(new URL(url).protocol);
    } catch {
        return false;
    }
};

export const buildSearchUrl = (searchBaseUrl, query) => {
    const base = isSafeUrl(searchBaseUrl) ? searchBaseUrl : 'https://tori.fi?q=';
    return `${base}${encodeURIComponent(query || '')}`;
};
