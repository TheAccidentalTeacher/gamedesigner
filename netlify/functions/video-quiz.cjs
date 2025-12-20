// netlify/functions/video-quiz.cjs
// Generate comprehensive quiz from YouTube video transcript

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

    console.log('🎯 Generating quiz for video:', videoId);

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      system: `You are an expert educator specializing in creating comprehensive, educationally sound assessments. You create quizzes that:
- Test understanding at multiple cognitive levels (Bloom's Taxonomy)
- Include clear, unambiguous questions
- Provide detailed explanations for correct answers
- Address common misconceptions
- Reference video content with timestamps
- Are appropriate for the target grade level
- Follow best practices in assessment design

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

    // Parse JSON response (handle potential markdown wrapping)
    let quizData;
    try {
      // Try direct parse first
      quizData = JSON.parse(responseText);
    } catch (e) {
      // If that fails, try extracting JSON from markdown code block
      const jsonMatch = responseText.match(/```json\n([\s\S]+?)\n```/) || 
                       responseText.match(/```\n([\s\S]+?)\n```/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse JSON from response');
      }
    }

    console.log('✅ Quiz generated successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(quizData)
    };

  } catch (error) {
    console.error('❌ Error generating quiz:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate quiz',
        message: error.message 
      })
    };
  }
};
