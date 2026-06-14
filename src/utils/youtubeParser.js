/**
 * YouTube URL parser utilities
 */

/**
 * Extract video ID from a YouTube URL
 */
export const extractVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&?\s#]+)/,
    /youtube\.com\/shorts\/([^&?\s#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

/**
 * Validate if a string is a valid YouTube URL
 */
export const isValidYouTubeUrl = (url) => {
  return extractVideoId(url) !== null;
};

/**
 * Get YouTube thumbnail URL
 */
export const getThumbnailUrl = (videoId) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};
