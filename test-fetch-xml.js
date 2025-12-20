import { Innertube } from 'youtubei.js';

async function test() {
  try {
    const yt = await Innertube.create();
    const info = await yt.getInfo('UvI-AMAtrvE');
    
    if (info.captions && info.captions.caption_tracks.length > 0) {
      const track = info.captions.caption_tracks[0];
      console.log('Fetching from base_url...\n');
      
      // Use youtubei.js's HTTP client to fetch
      const response = await yt.session.http.fetch(track.base_url);
      const xmlText = await response.text();
      
      console.log('Success! XML length:', xmlText.length);
      console.log('\nFirst 1500 chars:');
      console.log(xmlText.substring(0, 1500));
      
      // Parse with simple regex (will improve later)
      const segments = [];
      const regex = /<text start="([^"]+)" dur="([^"]+)"[^>]*>([^<]+)</g;
      let match;
      
      while ((match = regex.exec(xmlText)) !== null) {
        segments.push({
          start: parseFloat(match[1]),
          duration: parseFloat(match[2]),
          text: he.decode(match[3]) // Need to HTML decode
        });
      }
      
      console.log(`\n\nParsed ${segments.length} segments`);
      console.log('\nFirst 5 segments:');
      for (let i = 0; i < Math.min(5, segments.length); i++) {
        const s = segments[i];
        console.log(`[${s.start}s] ${s.text}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

// Quick HTML entity decoder
const he = {
  decode: (text) => {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }
};

test();
