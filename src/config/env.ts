// Environment configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
export const SESSION_SECRET =
  import.meta.env.VITE_SESSION_SECRET ||
  'aksdnkjdsnansdmlskadmamsd;msad;m;sadm;nnrekerrelmerlmlmmdsl'

// Helper to get full image URL (handles relative paths from backend)
export const getImageUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;
  // If already absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Otherwise, prepend API base URL
  return `${API_BASE_URL}${url}`;
}