/**
 * Test youtube-transcript-plus package
 * Docs: https://www.npmjs.com/package/youtube-transcript-plus
 */

import { fetchTranscript } from 'youtube-transcript-plus';

async function testTranscriptPlus() {
    console.log('=== Testing youtube-transcript-plus ===\n');

    try {
        // Test 1: Basic usage (Rick Astley)
        console.log('Test 1: Rick Astley - Never Gonna Give You Up');
        console.log('Video ID: dQw4w9WgXcQ\n');

        const transcript = await fetchTranscript('dQw4w9WgXcQ', {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        });

        if (transcript && transcript.length > 0) {
            console.log('✅ SUCCESS! Transcript fetched!');
            console.log(`Total segments: ${transcript.length}\n`);
            
            console.log('First 5 segments:');
            transcript.slice(0, 5).forEach((segment, idx) => {
                console.log(`  ${idx + 1}. [${segment.offset}s] ${segment.text} (duration: ${segment.duration}s)`);
            });

            // Test 2: Computerphile video
            console.log('\n\nTest 2: Computerphile Video');
            const transcript2 = await fetchTranscript('Xk1F3jpuchA');
            console.log(`✅ Segments: ${transcript2.length}`);

            // Test 3: Khan Academy
            console.log('\nTest 3: Khan Academy Video');
            const transcript3 = await fetchTranscript('https://www.youtube.com/watch?v=V_xMV96ud3M');
            console.log(`✅ Segments: ${transcript3.length}`);

            console.log('\n\n🎉 ALL TESTS PASSED! This library works!');
        }

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('Error type:', error.constructor.name);
        
        if (error.stack) {
            console.error('\nStack:', error.stack);
        }
    }
}

testTranscriptPlus();
