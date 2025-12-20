import { Innertube } from 'youtubei.js';

async function test() {
  try {
    const yt = await Innertube.create();
    const info = await yt.getInfo('UvI-AMAtrvE');
    
    if (info.captions && info.captions.caption_tracks.length > 0) {
      const track = info.captions.caption_tracks[0];
      console.log('Track object methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(track)));
      console.log('\nTrack properties:', Object.keys(track));
      console.log('\ntrack.name:', track.name);
      console.log('track.language_code:', track.language_code);
      console.log('track.kind:', track.kind);
      console.log('track.is_translatable:', track.is_translatable);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
