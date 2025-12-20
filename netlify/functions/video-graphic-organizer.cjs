const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
  // CORS headers
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
    const { videoData, transcript, organizerType, gradeLevel } = JSON.parse(event.body);

    console.log('[Graphic Organizer] Request received:', {
      organizerType,
      gradeLevel,
      videoTitle: videoData?.title,
      transcriptLength: transcript?.length
    });

    if (!transcript || transcript.length === 0) {
      console.error('[Graphic Organizer] ❌ No transcript provided');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Transcript is required' })
      };
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[Graphic Organizer] ❌ ANTHROPIC_API_KEY not found in environment');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    console.log('[Graphic Organizer] ✓ API key found, initializing Anthropic client');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });

    // Prepare transcript text (chunk if needed)
    // Handle transcript as array or pre-formatted string
    let transcriptText;
    if (Array.isArray(transcript)) {
      transcriptText = transcript.map(t => `[${t.timestamp}] ${t.text}`).join('\n');
    } else if (typeof transcript === 'string') {
      transcriptText = transcript;
    } else {
      console.error('[Graphic Organizer] ❌ Invalid transcript format:', typeof transcript);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid transcript format' })
      };
    }
    
    console.log(`[Graphic Organizer] Transcript text length: ${transcriptText.length} chars`);
    const maxLength = 12000;
    const truncatedTranscript = transcriptText.length > maxLength 
      ? transcriptText.substring(0, maxLength) + '\n\n[Transcript truncated for length...]'
      : transcriptText;

    const prompt = `You are an expert educator creating visual graphic organizers for ${gradeLevel || 'middle school'} students.

Video: ${videoData?.title || 'Educational Video'}
Organizer Type: ${organizerType}

Transcript:
${truncatedTranscript}

Create a ${organizerType} based on the video content. Use structured text format that can be easily converted to visual diagrams.

For ${organizerType}, include:
${getOrganizerGuidelines(organizerType)}

Format your response as JSON with this structure:
{
  "type": "${organizerType}",
  "title": "Brief title",
  "structure": { /* type-specific structure */ },
  "mermaid": "mermaid diagram code (if applicable)",
  "ascii": "ASCII art representation",
  "description": "How to use this organizer"
}

Make it grade-appropriate for ${gradeLevel || 'middle school'} with clear, concrete examples.`;

    console.log(`[Graphic Organizer] Sending request to Claude (${truncatedTranscript.length} chars)`);
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    console.log('[Graphic Organizer] ✓ Received response from Claude');
    const responseText = message.content[0].text;
    
    // Try to parse JSON response
    let organizerData;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                       responseText.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : responseText;
      organizerData = JSON.parse(jsonText);
    } catch (e) {
      // If JSON parsing fails, create a structured response
      organizerData = {
        type: organizerType,
        title: `${organizerType} for ${videoData?.title || 'Video'}`,
        structure: { raw: responseText },
        description: 'AI-generated graphic organizer'
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(organizerData)
    };

  } catch (error) {
    console.error('[Graphic Organizer] ❌ Error:', error.message);
    console.error('[Graphic Organizer] Stack:', error.stack);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate graphic organizer',
        details: error.message 
      })
    };
  }
};

function getOrganizerGuidelines(type) {
  const guidelines = {
    'Concept Map': `- Central concept in the middle
- Major concepts connected with labeled relationships
- Supporting details branching from major concepts
- Clear hierarchical structure
- Use arrows to show relationships with descriptive labels`,

    'Timeline': `- Chronological sequence of key events
- Date/time stamps for each event
- Brief description of what happened
- Visual markers for major milestones
- Beginning and end points clearly marked`,

    'Venn Diagram': `- 2-3 overlapping circles
- Unique characteristics in non-overlapping areas
- Shared characteristics in overlapping areas
- Clear labels for each circle
- Comprehensive comparison`,

    'Cause and Effect': `- Multiple causes leading to effects
- Clear arrows showing causal relationships
- Chain reactions if applicable
- Direct vs indirect causes
- Short-term and long-term effects`,

    'KWL Chart': `- K (Know): What students already know about the topic
- W (Want): Questions students have about the topic
- L (Learned): New information from the video
- Organized in clear columns`,

    'Mind Map': `- Central topic in the middle
- Main branches for major themes
- Sub-branches for supporting details
- Use keywords and short phrases
- Visual hierarchy with different levels`
  };

  return guidelines[type] || 'Create a clear, organized visual representation of the content.';
}
