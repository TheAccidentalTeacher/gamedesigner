/**
 * Netlify Function: video-unit-study-guide
 * Generates comprehensive unit study guide from multiple videos
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

        console.log(`[Unit Study Guide] Processing ${videos.length} videos`);

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

        const prompt = `You are an expert educational curriculum designer. Create a comprehensive unit study guide from these ${videos.length} YouTube videos.

**Videos:**
${combinedContent}

**Task:** Generate a complete unit study guide (8-12 pages) that synthesizes all content into a cohesive learning resource.

**Required Sections:**

## 1. Unit Overview (1-2 pages)
- Brief introduction to the unit topic
- Learning objectives (5-8 specific objectives)
- Essential questions (3-5 overarching questions)
- Connection to broader context
- How the videos relate to each other

## 2. Timeline of Events (if applicable)
- Chronological listing of key events
- Dates and significance
- Synthesize information from multiple videos
- Include (Video #) citations

## 3. Key Concepts & Themes (2-3 pages)
- Organize by major themes/topics (not by video)
- For each theme:
  * Detailed explanation
  * Examples from videos (with citations)
  * Why it matters
  * Connections to other themes
- 5-8 major concepts total

## 4. Important People & Their Roles (if applicable)
- Key figures mentioned across videos
- Their contributions/significance
- Relationships between people
- Video sources

## 5. Study Questions (20-25 questions)
- Mix of question types and difficulty levels
- Organized by topic/theme
- Some questions that span multiple videos
- Include answer guidance (not full answers)

## 6. Vocabulary List (30-40 terms)
- Group by category
- Clear definitions
- Video sources
- Related terms

## 7. Discussion Questions (10-15 questions)
- Higher-order thinking (DOK 3-4)
- Questions that connect multiple videos
- Encourage analysis and synthesis
- Some with no single "right answer"

## 8. Review Activities
- Suggested study strategies
- Self-quiz questions
- Practice exercises
- Project ideas that use content from multiple videos

## 9. Additional Resources
- Related topics to explore
- Connections to other subjects
- Real-world applications

**Important Guidelines:**
- SYNTHESIZE content across videos, don't just summarize each video
- Create a cohesive narrative that flows naturally
- Use clear headers, subheaders, and formatting
- Include (Video #) citations throughout
- Make it comprehensive but readable
- Focus on understanding, not just memorization
- Make connections explicit between different videos/concepts

Format as Markdown. This should be a complete, print-ready study guide.`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 16000,
            temperature: 0.6,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        const studyGuide = message.content[0].text;

        console.log(`[Unit Study Guide] Generated ${studyGuide.length} characters`);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studyGuide })
        };

    } catch (error) {
        console.error('[Unit Study Guide] Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to generate unit study guide',
                details: error.message
            })
        };
    }
};
