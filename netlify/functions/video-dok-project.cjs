// netlify/functions/video-dok-project.cjs
// Phase 8 Week 3: Generate DOK 3-4 Extended Projects from videos
// Serverless function for strategic thinking and extended thinking projects

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

exports.handler = async (event, context) => {
  // Handle CORS preflight
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
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { videoId, videoTitle, transcript, prompt, options } = JSON.parse(event.body);
    
    console.log(`📊 Generating DOK ${options.dokLevel} project for video: ${videoTitle}`);
    const startTime = Date.now();

    // Call Claude Sonnet 4 to generate DOK project
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192, // Extended projects need more tokens
      temperature: 0.7,
      system: `You are an expert educator specializing in creating rigorous, DOK 3-4 level projects that promote deep thinking and real-world application. You understand Depth of Knowledge framework and create projects that truly require strategic or extended thinking.

For DOK 3 projects: Require reasoning, planning, evidence use, and abstract thinking
For DOK 4 projects: Require investigation over time, synthesis, and real-world application

Always return valid JSON with all required components.`,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].text;
    console.log('✅ Claude response received');

    // Try to parse as JSON
    let projectData;
    try {
      // Look for JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        projectData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: structure the text response
        projectData = {
          title: `DOK ${options.dokLevel} Project: ${videoTitle}`,
          dokLevel: options.dokLevel,
          duration: options.duration,
          gradeLevel: options.gradeLevel,
          subject: options.subject,
          videoId: videoId,
          rawContent: responseText
        };
      }
    } catch (parseError) {
      console.warn('⚠️ JSON parsing failed, returning structured markdown:', parseError);
      projectData = {
        title: `DOK ${options.dokLevel} Project: ${videoTitle}`,
        dokLevel: options.dokLevel,
        duration: options.duration,
        gradeLevel: options.gradeLevel,
        subject: options.subject,
        videoId: videoId,
        rawContent: responseText
      };
    }

    const duration = Date.now() - startTime;
    console.log(`✅ DOK project generated in ${duration}ms`);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(projectData)
    };

  } catch (error) {
    console.error('❌ DOK project generation error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'DOK project generation failed',
        message: error.message
      })
    };
  }
};
