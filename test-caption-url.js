import { Innertube } from 'youtubei.js';

async function test() {
  try {
    const yt = await Innertube.create();
    const info = await yt.getInfo('UvI-AMAtrvE');
    
    console.log('Caption tracks available:', info.captions?.caption_tracks?.length || 0);
    
    if (info.captions && info.captions.caption_tracks.length > 0) {
      const track = info.captions.caption_tracks[0];
      console.log('\nUsing track:', track.name?.text, `(${track.language_code})`);
      console.log('Is auto-generated:', track.kind === 'asr');
      console.log('Base URL:', track.base_url?.substring(0, 100) + '...');
      
      // Try to fetch the caption data directly
      console.log('\nAttempting to fetch caption data...');
      
      // Method 1: Try base_url
      if (track.base_url) {
        const response = await fetch(track.base_url);
        const xml = await response.text();
        console.log('Fetched XML length:', xml.length);
        console.log('First 500 chars:', xml.substring(0, 500));
        
        // Parse XML
        const textMatches = xml.match(/<text[^>]*>([^<]+)</g);
        if (textMatches) {
          console.log('\nFound', textMatches.length, 'text segments');
          console.log('First 3 segments:');
          for (let i = 0; i < Math.min(3, textMatches.length); i++) {
            console.log(textMatches[i]);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

test();
