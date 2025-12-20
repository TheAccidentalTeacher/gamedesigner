/**
 * YouTube API Module (Browser Version)
 * 
 * Handles video metadata extraction, URL parsing, and validation
 * Uses YouTube oEmbed API (no API key required, works in browser)
 * 
 * Phase 8: Video Intelligence
 */

// Note: Browser version uses oEmbed API instead of youtubei.js (Node.js only)

/**
 * Extract video ID from various YouTube URL formats
 * 
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - Just the VIDEO_ID itself
 * 
 * @param {string} url - YouTube URL or video ID
 * @returns {string|null} Video ID or null if invalid
 */
export function extractVideoId(url) {
  if (!url) return null;
  
  // Already a video ID (11 characters, alphanumeric + - and _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  // Try various URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Validate that a video ID is properly formatted
 * 
 * @param {string} videoId - Video ID to validate
 * @returns {boolean} True if valid format
 */
export function isValidVideoId(videoId) {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

/**
 * Fetch video metadata (title, duration, channel, views, etc.)
 * 
 * @param {string} videoIdOrUrl - YouTube video ID or URL
 * @returns {Promise<Object>} Video metadata object
 * @throws {Error} If video not found or access denied
 */
export async function getVideoMetadata(videoIdOrUrl) {
  const videoId = extractVideoId(videoIdOrUrl);
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL or video ID');
  }
  
  try {
    // Use YouTube oEmbed API (no auth required, CORS-friendly)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      throw new Error(`Video not found or unavailable (HTTP ${response.status})`);
    }
    
    const data = await response.json();
    
    // Extract relevant metadata
    const metadata = {
      videoId: videoId,
      title: data.title,
      author: data.author_name,
      channelId: null, // Not available in oEmbed
      duration: null, // Not available in oEmbed (would need API key)
      durationFormatted: 'Unknown',
      viewCount: null, // Not available in oEmbed
      uploadDate: null, // Not available in oEmbed
      description: '', // Not available in oEmbed
      thumbnails: {
        maxres: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
        default: data.thumbnail_url
      },
      isLiveContent: false,
      category: null,
      keywords: [],
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedHtml: data.html,
      width: data.width,
      height: data.height
    };
    
    return metadata;
    
  } catch (error) {
    console.error('Video metadata fetch error:', error);
    throw new Error(`Failed to fetch video metadata: ${error.message}`);
  }
}

/**
 * Format duration from seconds to HH:MM:SS or MM:SS
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  } else {
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }
}

/**
 * Format view count for display (e.g., 1.2M, 45K)
 * 
 * @param {number} count - View count
 * @returns {string} Formatted count
 */
export function formatViewCount(count) {
  if (!count) return '0';
  
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  } else {
    return count.toString();
  }
}

/**
 * Get video search results (for future feature)
 * 
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results to return
 * @returns {Promise<Array>} Array of video metadata objects
 */
export async function searchVideos(query, maxResults = 10) {
  // Browser version doesn't support search without API key
  throw new Error('Video search not available in browser version - requires YouTube Data API key');
}

/**
 * Check if a video has captions/transcripts available
 * 
 * @param {string} videoIdOrUrl - YouTube video ID or URL
 * @returns {Promise<Object>} Caption availability info
 */
export async function checkCaptionAvailability(videoIdOrUrl) {
  const videoId = extractVideoId(videoIdOrUrl);
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL or video ID');
  }
  
  // In browser version, we can't check captions without API key
  // transcript-fetcher.js will attempt to fetch and report availability
  return {
    available: true, // Assume available, transcript-fetcher will verify
    languages: [{ code: 'en', name: 'English', isAutoGenerated: true }],
    hasAutoGenerated: true,
    hasManual: false,
    note: 'Browser version - actual availability checked during transcript fetch'
  };
}

export default {
  extractVideoId,
  isValidVideoId,
  getVideoMetadata,
  formatDuration,
  formatViewCount,
  searchVideos,
  checkCaptionAvailability
};
