// API Configuration
// Prefer explicit env; otherwise, use the current host to support localhost and LAN
const inferredHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

function sanitizeBaseUrl(value) {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.replace(/\s+/g, '');
  try {
    // Validate URL; if missing protocol, prepend http:// and revalidate
    const hasProtocol = /^https?:\/\//i.test(trimmed);
    const candidate = hasProtocol ? trimmed : `http://${trimmed}`;
    // eslint-disable-next-line no-new
    new URL(candidate);
    return candidate.replace(/\/$/, '');
  } catch {
    return null;
  }
}

const envUrl = sanitizeBaseUrl(process.env.REACT_APP_BACKEND_URL);
export const API_CONFIG = {
  BACKEND_URL: envUrl || `http://${inferredHost}:8001`
};

export default API_CONFIG;