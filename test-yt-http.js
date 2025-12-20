import { Innertube } from 'youtubei.js';
import he from 'he';

async function test() {
  try {
    console.log('Creating YouTube client...');
    const yt = await Innertube.create();
    
    console.log('Getting video info...');
    const info = await yt.getInfo('UvI-AMAtrvE');
    
    const track = info.captions.caption_tracks[0];
    console.log('Caption track:', track.name?.text, track.language_code);
    
    // Try using yt.actions to fetch
    console.log('\nTrying yt.actions.execute...');
    try {
      const captionData = await yt.actions.execute('/api/timedtext', {
        params: new URL(track.base_url).searchParams
      });
      console.log('Got data:', captionData);
    } catch (e) {
      console.log('execute failed:', e.message);
    }
    
    // Try direct session.http.fetch_function
    console.log('\nTrying yt.session.http.fetch_function...');
    try {
      const response = await yt.session.http.fetch_function(track.base_url);
      const text = await response.text();
      console.log('Response length:', text.length);
      console.log('First 500 chars:', text.substring(0, 500));
    } catch (e) {
      console.log('fetch_function failed:', e.message);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

test();
