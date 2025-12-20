import { Innertube } from 'youtubei.js';
import he from 'he';

async function test() {
  try {
    console.log('1. Creating YouTube client...');
    const yt = await Innertube.create();
    
    console.log('2. Getting video info...');
    const info = await yt.getInfo('UvI-AMAtrvE');
    
    console.log('3. Checking captions...');
    const track = info.captions.caption_tracks[0];
    console.log('   Track:', track.name?.text, track.language_code);
    console.log('   Base URL:', track.base_url.substring(0, 100) + '...');
    
    console.log('4. Fetching XML...');
    const response = await fetch(track.base_url);
    console.log('   Response status:', response.status);
    
    const xmlText = await response.text();
    console.log('   XML length:', xmlText.length);
    console.log('   First 500 chars:', xmlText.substring(0, 500));
    
    console.log('5. Parsing XML...');
    const regex = /<text start="([^"]+)" dur="([^"]+)"[^>]*>([^<]*)<\/text>/g;
    let match;
    let count = 0;
    
    while ((match = regex.exec(xmlText)) !== null && count < 5) {
      console.log(`   [${match[1]}s] ${he.decode(match[3])}`);
      count++;
    }
    
    console.log('\n✅ Success!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }
}

test();
