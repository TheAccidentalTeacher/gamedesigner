import { YoutubeTranscript } from 'youtube-transcript';

async function test() {
  try {
    console.log('Fetching transcript...');
    const transcript = await YoutubeTranscript.fetchTranscript('UvI-AMAtrvE');
    console.log('Success! Got', transcript.length, 'segments');
    console.log('\nFirst 3 segments:');
    for (let i = 0; i < Math.min(3, transcript.length); i++) {
      console.log(transcript[i]);
    }
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error);
  }
}

test();
