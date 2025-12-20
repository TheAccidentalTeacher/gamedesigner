// netlify/functions/video-lesson-plan.cjs
// Generate comprehensive lesson plan from YouTube video

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
    const { videoId, videoTitle, transcript, duration, prompt, options } = JSON.parse(event.body);

    if (!videoId || !transcript) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: videoId, transcript' })
      };
    }

    console.log('📚 Generating lesson plan for video:', videoId);

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.7,
      system: `You are an expert educator and curriculum designer specializing in creating comprehensive, practical lesson plans. You create plans that:
- Use backward design principles (start with objectives)
- Include engaging hooks and anticipatory sets
- Incorporate active learning strategies
- Provide differentiation for diverse learners
- Include formative and summative assessments
- Follow educational best practices (Bloom's Taxonomy, Webb's DOK, etc.)
- Are immediately usable by teachers
- Integrate technology effectively
- Support classical education principles when appropriate

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
    let lessonPlan;
    try {
      lessonPlan = JSON.parse(responseText);
    } catch (e) {
      const jsonMatch = responseText.match(/```json\n([\s\S]+?)\n```/) || 
                       responseText.match(/```\n([\s\S]+?)\n```/);
      if (jsonMatch) {
        lessonPlan = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse JSON from response');
      }
    }

    console.log('✅ Lesson plan generated successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(lessonPlan)
    };

  } catch (error) {
    console.error('❌ Error generating lesson plan:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate lesson plan',
        message: error.message 
      })
    };
  }
};
