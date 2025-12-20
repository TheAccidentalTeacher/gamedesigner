/**
 * Netlify Function: video-weekly-summary
 * Generates a comprehensive weekly summary from 5-10 videos
 */

const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
    // CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { videos } = JSON.parse(event.body);

        if (!videos || !Array.isArray(videos) || videos.length < 2) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Need at least 2 videos' })
            };
        }

        console.log(`[Weekly Summary] Processing ${videos.length} videos`);

        // Initialize Anthropic client
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });

        // Build combined transcript
        const combinedContent = videos.map((video, index) => {
            const transcript = Array.isArray(video.transcript) 
                ? video.transcript.map(seg => seg.text).join(' ')
                : (typeof video.transcript === 'string' ? video.transcript : JSON.stringify(video.transcript));
            
            return `
## VIDEO ${index + 1}: ${video.title}
**Channel:** ${video.channelName || video.channel_name || 'Unknown'}
**Duration:** ${Math.floor((video.duration || 0) / 60)} minutes

${transcript}

---
`;
        }).join('\n\n');

        const prompt = `You are an expert educational content synthesizer. Create a comprehensive weekly summary from these ${videos.length} YouTube videos.

**Videos to Synthesize:**
${combinedContent}

**Task:** Generate a cohesive weekly summary that:

1. **Overview Section**
   - Provide a 2-3 paragraph overview of the main themes across all videos
   - Highlight key connections between videos

2. **Main Topics** (Organize by theme, not by video)
   - Group related content from multiple videos
   - Use headers like "Political Structure", "Daily Life", "Economics" etc.
   - For each topic:
     * Synthesize information from all relevant videos
     * Include (Video 1), (Video 3) citations to show sources
     * Present information coherently, not as separate video summaries

3. **Key Concepts** (15-20 total)
   - List the most important concepts across all videos
   - Brief definition for each
   - Video source in parentheses

4. **Timeline of Events** (if applicable)
   - Chronological listing of events mentioned across videos
   - Combine information from multiple videos when relevant

5. **Weekly Takeaways**
   - 5-7 main lessons/insights from the entire week's content
   - Synthesized understanding, not per-video bullets

**Important Guidelines:**
- SYNTHESIZE content, don't just list video-by-video summaries
- Group information by TOPIC, not by video
- Show which video(s) each fact came from using (Video 1), (Video 2), etc.
- Create a coherent narrative that flows naturally
- Highlight connections and contrasts between videos
- Use clear headers and formatting
- Keep it concise but comprehensive (2-3 pages)

Format as Markdown with clear sections.`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 16000,
            temperature: 0.7,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        const summary = message.content[0].text;

        console.log(`[Weekly Summary] Generated ${summary.length} characters`);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ summary })
        };

    } catch (error) {
        console.error('[Weekly Summary] Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to generate weekly summary',
                details: error.message
            })
        };
    }
};
