/**
 * SEO Guard Script
 * Enforces strict canonicalization and noindex logic for search queries.
 */
(function () {
    try {
        const HOST = 'https://ilovpdf.in';
        // No trailing slash except root
        const path = window.location.pathname === '/' ? '' : window.location.pathname.replace(/\/$/, '');

        // 1. Construct Clean Canonical URL
        const cleanUrl = HOST + path;

        // 2. Manage Canonical Tag
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'canonical';
            document.head.appendChild(link);
        }

        // Ensure strict canonical (no params, correct host)
        if (link.href !== cleanUrl) {
            link.href = cleanUrl;
        }

        // 3. Handle Search Parameters (?q=)
        const params = new URLSearchParams(window.location.search);
        if (params.has('q')) {
            // Add noindex meta tag
            let meta = document.querySelector('meta[name="robots"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'robots';
                document.head.appendChild(meta);
            }
            meta.content = 'noindex, follow';
        }
    } catch (e) {
        console.warn('SEO Guard Error:', e);
    }
})();
