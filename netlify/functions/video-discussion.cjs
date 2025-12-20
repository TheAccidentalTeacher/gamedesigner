// netlify/functions/video-discussion.cjs
// Generate discussion questions from YouTube video

const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
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
    const { videoId, videoTitle, transcript, prompt, options } = JSON.parse(event.body);

    if (!videoId || !transcript) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: videoId, transcript' })
      };
    }

    console.log('💬 Generating discussion questions for video:', videoId);

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,  // Increased from 3000 - discussion questions need more space
      temperature: 0.8,
      system: `You are an expert educator specializing in Socratic questioning and facilitating meaningful classroom discussions. You create questions that:
- Progress through Bloom's Taxonomy (remember → understand → apply → analyze → evaluate → create)
- Encourage critical thinking and deeper understanding
- Connect to students' lives and experiences
- Promote respectful debate and multiple perspectives
- Build on each other (follow-up questions)
- Are open-ended and thought-provoking
- Support classical education's emphasis on dialectic (logic) stage
- Foster intellectual curiosity

Return your response ONLY as valid JSON matching the requested structure. Do not include markdown formatting or code blocks.`,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].text;
    console.log('📝 Claude response received, parsing...');

    // Parse JSON response
    let questions;
    try {
      questions = JSON.parse(responseText);
    } catch (e) {
      const jsonMatch = responseText.match(/```json\n([\s\S]+?)\n```/) || 
                       responseText.match(/```\n([\s\S]+?)\n```/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse JSON from response');
      }
    }

    console.log('✅ Discussion questions generated successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(questions)
    };

  } catch (error) {
    console.error('❌ Error generating discussion questions:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate discussion questions',
        message: error.message 
      })
    };
  }
};
