/**
 * Netlify Function: video-combined-quiz
 * Generates a quiz covering all selected videos
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

        console.log(`[Combined Quiz] Processing ${videos.length} videos`);

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

${transcript}

---
`;
        }).join('\n\n');

        const questionsPerVideo = Math.max(4, Math.floor(25 / videos.length));

        const prompt = `You are an expert quiz creator. Generate a comprehensive quiz covering these ${videos.length} YouTube videos.

**Videos:**
${combinedContent}

**Task:** Create a quiz with ${questionsPerVideo * videos.length} questions total (approximately ${questionsPerVideo} questions per video).

**Requirements:**

1. **Question Distribution:**
   - Balanced across all ${videos.length} videos
   - Each question must clearly show which video it came from
   - Mix of difficulty levels (40% easy, 40% medium, 20% hard)

2. **Question Types:**
   - 50% Multiple Choice (4 options, 1 correct)
   - 25% Short Answer
   - 15% True/False
   - 10% Fill-in-the-Blank

3. **Format for Each Question:**
   \`\`\`
   **Question [#] (from Video [#]: [Video Title])**
   [Question text]
   
   A) [Option 1]
   B) [Option 2]
   C) [Option 3]
   D) [Option 4]
   
   **Answer:** [Correct answer]
   **Explanation:** [Why this is correct and what video timestamp/context it came from]
   \`\`\`

4. **Coverage:**
   - Test key concepts from each video
   - Include some questions that connect information across multiple videos
   - Focus on important facts, concepts, and relationships

5. **Answer Key:**
   - Provide at the end
   - Include brief explanations
   - Reference video source and approximate timestamp if possible

Format as Markdown. Make questions clear, educational, and fair.`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 16000,
            temperature: 0.5,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        const quiz = message.content[0].text;

        console.log(`[Combined Quiz] Generated ${quiz.length} characters`);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quiz })
        };

    } catch (error) {
        console.error('[Combined Quiz] Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to generate combined quiz',
                details: error.message
            })
        };
    }
};
