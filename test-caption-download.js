import { Innertube } from 'youtubei.js';

async function test() {
  try {
    const yt = await Innertube.create();
    const info = await yt.getInfo('UvI-AMAtrvE');
    
    console.log('Caption tracks available:', info.captions?.caption_tracks?.length || 0);
    
    if (info.captions && info.captions.caption_tracks.length > 0) {
      const track = info.captions.caption_tracks[0];
      console.log('\nUsing track:', track.name?.text, `(${track.language_code})`);
      
      // Try the download method
      console.log('\nAttempting to download caption...');
      const captionData = await track.download(yt.session.http);
      
      console.log('Downloaded! Type:', typeof captionData);
      console.log('Length:', captionData?.length || 0);
      
      if (captionData) {
        console.log('First 1000 chars:', captionData.substring(0, 1000));
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

test();
