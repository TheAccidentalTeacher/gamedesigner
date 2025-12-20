/**
 * Netlify Function: YouTube Transcript Fetcher
 * 
 * Fetches transcripts from YouTube videos using youtube-transcript-plus
 * This runs server-side to avoid CORS issues
 */

const { fetchTranscript } = require('youtube-transcript-plus');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { videoId, language = 'en' } = JSON.parse(event.body);

    if (!videoId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'videoId is required' })
      };
    }

    console.log(`Fetching transcript for video: ${videoId}, language: ${language}`);

    // Fetch transcript using youtube-transcript-plus
    const config = {
      lang: language,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    const rawSegments = await fetchTranscript(videoId, config);

    // Transform to our format
    const segments = rawSegments.map(segment => ({
      text: segment.text,
      start: parseFloat(segment.offset),
      duration: parseFloat(segment.duration),
      end: parseFloat(segment.offset) + parseFloat(segment.duration),
      timestamp: formatTimestamp(parseFloat(segment.offset))
    }));

    // Calculate full text
    const fullText = segments.map(s => s.text).join(' ');

    const response = {
      videoId,
      language,
      segments,
      fullText,
      totalDuration: segments.length > 0 
        ? segments[segments.length - 1].end 
        : 0,
      wordCount: segments.reduce((count, seg) => count + seg.text.split(/\s+/).length, 0),
      segmentCount: segments.length
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Transcript fetch error:', error);

    // Handle specific errors
    let errorMessage = error.message;
    let statusCode = 500;

    if (error.constructor.name === 'YoutubeTranscriptNotAvailableError') {
      errorMessage = 'No transcript available for this video. The video may not have captions.';
      statusCode = 404;
    } else if (error.constructor.name === 'YoutubeTranscriptDisabledError') {
      errorMessage = 'Transcripts are disabled for this video';
      statusCode = 403;
    } else if (error.constructor.name === 'YoutubeTranscriptVideoUnavailableError') {
      errorMessage = 'Video is unavailable or has been removed';
      statusCode = 404;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        videoId: JSON.parse(event.body).videoId
      })
    };
  }
};

/**
 * Format seconds to HH:MM:SS or MM:SS timestamp
 */
function formatTimestamp(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
