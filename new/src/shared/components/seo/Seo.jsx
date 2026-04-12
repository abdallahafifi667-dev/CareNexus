import { useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_PUBLIC_URL || 'https://care-nexus-front-9hn1.vercel.app';
const formatUrl = (path) => `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

const ensureMeta = ({ selector, attr, value, createTag, attributes }) => {
    const existing = document.head.querySelector(selector);
    if (existing) {
        existing.setAttribute(attr, value);
        return existing;
    }

    const el = document.createElement(createTag);
    Object.entries(attributes).forEach(([key, val]) => el.setAttribute(key, val));
    el.setAttribute(attr, value);
    document.head.appendChild(el);
    return el;
};

const Seo = ({ title, description, keywords, image = '/logo1.png', path = '/', noIndex = false }) => {
    useEffect(() => {
        const pageUrl = formatUrl(path);
        const imageUrl = formatUrl(image);
        const robotsValue = noIndex ? 'noindex, nofollow' : 'index, follow';

        document.title = title;
        ensureMeta({
            selector: 'meta[name="description"]',
            attr: 'content',
            value: description,
            createTag: 'meta',
            attributes: { name: 'description' },
        });
        ensureMeta({
            selector: 'meta[name="keywords"]',
            attr: 'content',
            value: keywords,
            createTag: 'meta',
            attributes: { name: 'keywords' },
        });
        ensureMeta({
            selector: 'meta[name="robots"]',
            attr: 'content',
            value: robotsValue,
            createTag: 'meta',
            attributes: { name: 'robots' },
        });
        ensureMeta({
            selector: 'link[rel="canonical"]',
            attr: 'href',
            value: pageUrl,
            createTag: 'link',
            attributes: { rel: 'canonical' },
        });

        ensureMeta({
            selector: 'meta[property="og:type"]',
            attr: 'content',
            value: 'website',
            createTag: 'meta',
            attributes: { property: 'og:type' },
        });
        ensureMeta({
            selector: 'meta[property="og:url"]',
            attr: 'content',
            value: pageUrl,
            createTag: 'meta',
            attributes: { property: 'og:url' },
        });
        ensureMeta({
            selector: 'meta[property="og:title"]',
            attr: 'content',
            value: title,
            createTag: 'meta',
            attributes: { property: 'og:title' },
        });
        ensureMeta({
            selector: 'meta[property="og:description"]',
            attr: 'content',
            value: description,
            createTag: 'meta',
            attributes: { property: 'og:description' },
        });
        ensureMeta({
            selector: 'meta[property="og:image"]',
            attr: 'content',
            value: imageUrl,
            createTag: 'meta',
            attributes: { property: 'og:image' },
        });
        ensureMeta({
            selector: 'meta[property="og:site_name"]',
            attr: 'content',
            value: 'CareNexus',
            createTag: 'meta',
            attributes: { property: 'og:site_name' },
        });
        ensureMeta({
            selector: 'meta[property="og:locale"]',
            attr: 'content',
            value: 'en_US',
            createTag: 'meta',
            attributes: { property: 'og:locale' },
        });

        ensureMeta({
            selector: 'meta[name="twitter:card"]',
            attr: 'content',
            value: 'summary_large_image',
            createTag: 'meta',
            attributes: { name: 'twitter:card' },
        });
        ensureMeta({
            selector: 'meta[name="twitter:url"]',
            attr: 'content',
            value: pageUrl,
            createTag: 'meta',
            attributes: { name: 'twitter:url' },
        });
        ensureMeta({
            selector: 'meta[name="twitter:title"]',
            attr: 'content',
            value: title,
            createTag: 'meta',
            attributes: { name: 'twitter:title' },
        });
        ensureMeta({
            selector: 'meta[name="twitter:description"]',
            attr: 'content',
            value: description,
            createTag: 'meta',
            attributes: { name: 'twitter:description' },
        });
        ensureMeta({
            selector: 'meta[name="twitter:image"]',
            attr: 'content',
            value: imageUrl,
            createTag: 'meta',
            attributes: { name: 'twitter:image' },
        });
        ensureMeta({
            selector: 'meta[name="twitter:site"]',
            attr: 'content',
            value: '@CareNexus',
            createTag: 'meta',
            attributes: { name: 'twitter:site' },
        });
    }, [title, description, keywords, image, path, noIndex]);

    return null;
};

export default Seo;
