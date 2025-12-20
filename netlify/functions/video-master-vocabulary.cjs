/**
 * Netlify Function: video-master-vocabulary
 * Generates master vocabulary list from multiple videos
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

        console.log(`[Master Vocabulary] Processing ${videos.length} videos`);

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
${transcript}
---
`;
        }).join('\n\n');

        const prompt = `You are an expert vocabulary educator. Create a master vocabulary list from these ${videos.length} YouTube videos.

**Videos:**
${combinedContent}

**Task:** Generate a comprehensive master vocabulary list with 40-50 unique terms.

**Requirements:**

1. **Term Selection:**
   - Extract the most important academic/technical terms across ALL videos
   - NO DUPLICATES - each term appears only once
   - Include terms that appear in multiple videos (note which videos)
   - Focus on content-specific vocabulary, not common words

2. **Organization:**
   - Group terms by category (e.g., Political, Economic, Social, Scientific, etc.)
   - Sort alphabetically within each category

3. **Format for Each Term:**
   \`\`\`
   ### [Term]
   **Definition:** [Clear, concise definition appropriate for students]
   **Context:** [How it's used in the videos]
   **Source:** (Videos 1, 3, 5) [List which videos mention this term]
   **Related Terms:** [2-3 related vocabulary words]
   \`\`\`

4. **Categories to Include:**
   - Create 5-8 logical categories based on content
   - Each category should have 5-10 terms
   - Category names should be clear and descriptive

5. **Special Features:**
   - Mark terms that appear in multiple videos with ⭐
   - Indicate difficulty level: [Basic] [Intermediate] [Advanced]
   - Include pronunciation guides for difficult terms

**Example Entry:**
\`\`\`
### Republic ⭐ [Intermediate]
**Definition:** A form of government where power is held by elected representatives and an elected leader rather than a monarch.
**Context:** Discussed in relation to Roman government structure and how the Senate functioned within the republic system.
**Source:** (Videos 1, 2, 4)
**Related Terms:** Senate, Consul, Democracy
**Pronunciation:** ri-PUB-lik
\`\`\`

Format as Markdown. Make this a comprehensive study resource.`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 16000,
            temperature: 0.5,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        const vocabulary = message.content[0].text;

        console.log(`[Master Vocabulary] Generated ${vocabulary.length} characters`);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vocabulary })
        };

    } catch (error) {
        console.error('[Master Vocabulary] Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to generate master vocabulary',
                details: error.message
            })
        };
    }
};
