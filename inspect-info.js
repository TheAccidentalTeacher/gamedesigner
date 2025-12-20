import { Innertube } from 'youtubei.js';

async function test() {
  try {
    const yt = await Innertube.create();
    const info = await yt.getInfo('UvI-AMAtrvE');
    
    console.log('Info object methods:');
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(info));
    console.log(methods.filter(m => !m.startsWith('_') && m !== 'constructor'));
    
    console.log('\nInfo properties:');
    console.log(Object.keys(info).filter(k => !k.startsWith('_')));
    
    // Check if there's a getTranscript method
    if (typeof info.getTranscript === 'function') {
      console.log('\n✅ getTranscript method exists!');
      try {
        const transcript = await info.getTranscript();
        console.log('Transcript keys:', Object.keys(transcript));
      } catch (e) {
        console.log('getTranscript error:', e.message);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();
