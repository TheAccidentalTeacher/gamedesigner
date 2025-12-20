/**
 * Debug transcript structure
 */

import { Innertube } from 'youtubei.js';

async function debug() {
  const yt = await Innertube.create();
  const info = await yt.getInfo('UvI-AMAtrvE');
  
  console.log('\n=== Caption Tracks ===');
  console.log('Available:', info.captions?.caption_tracks?.length || 0);
  
  if (info.captions && info.captions.caption_tracks.length > 0) {
    const track = info.captions.caption_tracks[0];
    console.log('\nFirst track:', {
      language: track.language_code,
      name: track.name?.text,
      kind: track.kind
    });
    
    try {
      console.log('\n=== Fetching Transcript ===');
      const transcript = await info.getTranscript();
      console.log('Transcript object keys:', Object.keys(transcript));
      console.log('Transcript.transcript keys:', Object.keys(transcript.transcript || {}));
      
      if (transcript.transcript) {
        console.log('Content keys:', Object.keys(transcript.transcript.content || {}));
        if (transcript.transcript.content?.body) {
          console.log('Body keys:', Object.keys(transcript.transcript.content.body || {}));
          console.log('Initial segments:', transcript.transcript.content.body.initial_segments?.length || 0);
          
          if (transcript.transcript.content.body.initial_segments) {
            const first = transcript.transcript.content.body.initial_segments[0];
            console.log('\nFirst segment:', JSON.stringify(first, null, 2));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching transcript:', error.message);
    }
  }
}

debug().catch(console.error);
