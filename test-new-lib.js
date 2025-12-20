import YoutubeTranscriptApi from 'youtube-transcript-api';

async function test() {
  try {
    console.log('Creating client...');
    const api = new YoutubeTranscriptApi();
    
    console.log('Waiting for ready...');
    await api.ready;
    
    console.log('✅ Client ready!\n');
    console.log('Fetching transcript...\n');
    
    const transcript = await api.getTranscript('https://www.youtube.com/watch?v=UvI-AMAtrvE');
    
    console.log('✅ Success! Got', transcript.length, 'segments\n');
    console.log('First 5 segments:');
    for (let i = 0; i < Math.min(5, transcript.length); i++) {
      const seg = transcript[i];
      console.log(`[${seg.start.toFixed(2)}s] ${seg.text}`);
    }
    
    console.log('\n✅ This library works!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
