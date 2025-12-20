/**
 * Test the 0x6a69616e/youtube-transcript-api package
 * Based on official docs: https://github.com/0x6a69616e/youtube-transcript-api
 */

import TranscriptClient from 'youtube-transcript-api';

async function testTranscriptAPI() {
    console.log('=== Testing 0x6a69616e/youtube-transcript-api ===\n');

    try {
        // Create client with custom headers (recommended by docs)
        const client = new TranscriptClient({
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
            }
        });

        console.log('Client created, waiting for initialization...');
        
        // CRITICAL: Must await client.ready
        await client.ready;
        console.log('✓ Client initialized successfully\n');

        // Test 1: Rick Astley video
        console.log('Test 1: Rick Astley - Never Gonna Give You Up');
        console.log('Video ID: dQw4w9WgXcQ\n');

        const result = await client.getTranscript('dQw4w9WgXcQ');
        
        console.log('Response structure:');
        console.log('- Video ID:', result.id);
        console.log('- Title:', result.title);
        console.log('- Author:', result.author || 'N/A');
        console.log('- Channel ID:', result.channelId || 'N/A');
        console.log('- Is Live:', result.isLive);
        console.log('- Available Languages:', result.languages?.length || 0);
        
        if (result.languages && result.languages.length > 0) {
            result.languages.forEach(lang => {
                console.log(`  - ${lang.label} (${lang.languageCode})`);
            });
        }

        console.log('- Playability Status:', result.playabilityStatus?.status);
        console.log('- Tracks:', result.tracks?.length || 0);

        if (result.tracks && result.tracks.length > 0) {
            const track = result.tracks[0];
            console.log('\nFirst Track:');
            console.log('- Language:', track.language);
            console.log('- Segments:', track.transcript?.length || 0);

            if (track.transcript && track.transcript.length > 0) {
                console.log('\nFirst 5 segments:');
                track.transcript.slice(0, 5).forEach((segment, idx) => {
                    console.log(`  ${idx + 1}. [${segment.start}s] ${segment.text} (duration: ${segment.dur}s)`);
                });

                console.log('\n✅ SUCCESS! Transcript fetched successfully!');
                console.log(`Total segments: ${track.transcript.length}`);
            }
        } else {
            console.log('\n❌ No transcript tracks available');
            console.log('Reason:', result.playabilityStatus?.reason);
        }

        // Test 2: Another video
        console.log('\n\n=== Test 2: Computerphile Video ===');
        const result2 = await client.getTranscript('Xk1F3jpuchA');
        
        if (result2.tracks && result2.tracks.length > 0) {
            console.log('✅ Title:', result2.title);
            console.log('✅ Transcript segments:', result2.tracks[0].transcript?.length || 0);
        }

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('Stack:', error.stack);
    }
}

testTranscriptAPI();
