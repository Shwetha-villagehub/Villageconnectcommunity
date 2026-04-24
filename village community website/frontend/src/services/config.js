const browserOrigin = typeof window !== 'undefined' ? window.location.origin : '';
const configuredApiUrl = (import.meta.env.VITE_API_URL || '').trim();

export const API_URL = configuredApiUrl || browserOrigin || 'http://localhost:5000';
export const API_BASE_URL = `${API_URL}/api`;

const fallbackSvg = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#d8ead1" />
        <stop offset="100%" stop-color="#eef8e8" />
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g)" />
    <circle cx="220" cy="180" r="90" fill="#c0d6b5" />
    <circle cx="960" cy="160" r="110" fill="#bfdcae" />
    <rect x="170" y="420" width="860" height="170" rx="32" fill="#ffffff" opacity="0.72" />
    <text x="600" y="500" text-anchor="middle" font-size="48" font-family="Arial, sans-serif" fill="#365137">Village Community</text>
    <text x="600" y="560" text-anchor="middle" font-size="28" font-family="Arial, sans-serif" fill="#5c7650">Image unavailable</text>
  </svg>
`);

export const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${fallbackSvg}`;

export const resolveMediaUrl = (url) => {
  if (!url) return FALLBACK_IMAGE;
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  return `${API_URL}${url.startsWith('/') ? url : `/${url}`}`;
};
