/**
 * Video Batch Summary Generator
 * Synthesize multiple videos into one master document
 */

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { videos } = JSON.parse(event.body);

        if (!videos || !Array.isArray(videos) || videos.length < 2) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Need at least 2 videos for batch summary' })
            };
        }

        console.log(`[Batch Summary] Processing ${videos.length} videos`);

        // Prepare context with all video data
        const videoContexts = videos.map((v, i) => {
            const transcript = typeof v.transcript === 'string' 
                ? v.transcript 
                : (v.transcript?.full_text || '');
            
            return `
VIDEO ${i + 1}: ${v.title}
Channel: ${v.channel_name || v.channelName || 'Unknown'}
Duration: ${v.duration || 'Unknown'}

TRANSCRIPT:
${transcript}

---
`;
        }).join('\n\n');

        // Generate combined summary with Claude
        const prompt = `You are analyzing ${videos.length} educational videos to create a comprehensive weekly summary.

${videoContexts}

Please create a master summary document that:

1. **OVERVIEW**: Write a 2-3 paragraph executive summary covering the main themes across all ${videos.length} videos

2. **KEY THEMES**: Identify and explain 5-7 major themes/concepts that appear across multiple videos

3. **INDIVIDUAL VIDEO SUMMARIES**: For each video, provide:
   - Title and key focus
   - Main points (3-5 bullet points)
   - How it connects to other videos in the collection

4. **CONNECTIONS & INSIGHTS**: Explain how these videos relate to each other and build on concepts

5. **KEY TAKEAWAYS**: List 8-10 most important points from the entire collection

6. **REFLECTION QUESTIONS**: 5 thoughtful questions for deeper understanding

Format in clear Markdown with headings, subheadings, and bullet points.`;

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

        console.log(`[Batch Summary] ✅ Generated summary (${summary.length} chars)`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                summary,
                videoCount: videos.length,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('[Batch Summary] ❌ Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message || 'Failed to generate batch summary'
            })
        };
    }
};
