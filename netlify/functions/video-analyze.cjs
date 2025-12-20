/**
 * Video Analysis Endpoint
 * 
 * Multi-agent analysis of YouTube video transcripts
 * Generates summaries and expert perspectives
 */

const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Persona definitions (subset - full list in personas folder)
const PERSONAS = {
    'master-teacher': { name: '👨‍🏫 Master Teacher', emoji: '👨‍🏫' },
    'classical-educator': { name: '📖 Classical Educator', emoji: '📖' },
    'strategist': { name: '📊 Strategist', emoji: '📊' },
    'theologian': { name: '⛪ Theologian', emoji: '⛪' },
    'technical-architect': { name: '🏗️ Technical Architect', emoji: '🏗️' },
    'writer': { name: '✍️ Writer', emoji: '✍️' },
    'analyst': { name: '🔬 Analyst', emoji: '🔬' },
    'debugger': { name: '🐛 Debugger', emoji: '🐛' },
    'ux-designer': { name: '🎨 UX Designer', emoji: '🎨' },
    'marketing-strategist': { name: '📢 Marketing Strategist', emoji: '📢' },
    'game-designer': { name: '🎮 Game Designer', emoji: '🎮' },
    'gen-alpha-expert': { name: '👾 Gen-Alpha Expert', emoji: '👾' }
};

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    // Only accept POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const request = JSON.parse(event.body);
        const { videoId, title, author, duration, transcript, segments, selectedPersonas, requestedSummaries } = request;

        console.log(`📺 Analyzing video: ${title} (${videoId})`);
        console.log(`   Transcript length: ${transcript?.length || 0} characters`);
        console.log(`   Personas: ${selectedPersonas?.length || 'all'}`);

        // Generate summaries
        const summaries = await generateSummaries(title, author, transcript, segments, requestedSummaries);
        
        // Get agent analyses
        const personas = selectedPersonas || Object.keys(PERSONAS);
        const agentAnalyses = await generateAgentAnalyses(title, author, transcript, personas.slice(0, 4)); // Limit to 4 for speed
        
        const response = {
            videoId,
            title,
            author,
            duration,
            summaries,
            agentAnalyses,
            analyzedAt: new Date().toISOString()
        };

        console.log(`✅ Analysis complete: ${agentAnalyses.length} agent perspectives`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(response)
        };

    } catch (error) {
        console.error('Video analysis error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Analysis failed',
                message: error.message
            })
        };
    }
};

/**
 * Generate multi-level summaries
 */
async function generateSummaries(title, author, transcript, segments, requestedTypes) {
    const summaries = {};

    // System prompt for summarization
    const systemPrompt = `You are an expert at analyzing and summarizing video content. 
Provide clear, concise, and insightful summaries that capture the essence and key points of the content.`;

    try {
        // Generate all summary types in one API call for efficiency
        const userPrompt = `Analyze this YouTube video transcript and provide the following summaries:

**Video**: "${title}" by ${author}

**Transcript**:
${transcript.substring(0, 8000)} ${transcript.length > 8000 ? '... (truncated)' : ''}

Please provide:

1. **TLDR** (one sentence): The absolute essence in 15-20 words
2. **Abstract** (one paragraph): A concise 100-150 word summary
3. **Detailed Summary** (5-7 paragraphs): Comprehensive analysis with key points
4. **Key Moments** (5-10 timestamped highlights): Important moments worth noting

Format your response as JSON:
{
  "tldr": "one sentence",
  "abstract": "one paragraph",
  "detailed": "detailed paragraphs",
  "keyMoments": [
    {"timestamp": "MM:SS", "description": "what happens"}
  ]
}`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4000,
            temperature: 0.3,
            system: systemPrompt,
            messages: [{
                role: 'user',
                content: userPrompt
            }]
        });

        // Parse response
        const content = message.content[0].text;
        
        // Try to extract JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            Object.assign(summaries, parsed);
        } else {
            // Fallback: parse as plain text
            summaries.tldr = content.split('\n')[0];
            summaries.abstract = content;
            summaries.detailed = content;
            summaries.keyMoments = [];
        }

    } catch (error) {
        console.error('Summary generation error:', error);
        summaries.error = error.message;
    }

    return summaries;
}

/**
 * Generate agent-specific analyses
 */
async function generateAgentAnalyses(title, author, transcript, personas) {
    const analyses = [];

    // Limit transcript length for each agent
    const truncatedTranscript = transcript.substring(0, 6000);

    for (const personaId of personas) {
        try {
            const persona = PERSONAS[personaId];
            if (!persona) continue;

            // Persona-specific prompt
            const systemPrompt = getPersonaPrompt(personaId);
            
            const userPrompt = `Analyze this YouTube video from your unique perspective:

**Video**: "${title}" by ${author}

**Transcript**:
${truncatedTranscript}

Provide your expert analysis focusing on what's most relevant to your area of expertise. Be specific and insightful.`;

            const message = await anthropic.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                temperature: 0.7,
                system: systemPrompt,
                messages: [{
                    role: 'user',
                    content: userPrompt
                }]
            });

            analyses.push({
                personaId,
                persona: persona.name,
                emoji: persona.emoji,
                analysis: message.content[0].text
            });

        } catch (error) {
            console.error(`Agent analysis error (${personaId}):`, error);
            analyses.push({
                personaId,
                persona: PERSONAS[personaId]?.name || personaId,
                error: error.message
            });
        }
    }

    return analyses;
}

/**
 * Get persona-specific system prompt
 */
function getPersonaPrompt(personaId) {
    const prompts = {
        'master-teacher': 'You are a master educator with expertise in pedagogy and Socratic method. Analyze content for educational value and teaching opportunities.',
        'classical-educator': 'You are a classical educator focused on the trivium (grammar, logic, rhetoric) and great books. Connect content to classical learning principles.',
        'strategist': 'You are a strategic thinker focused on big-picture insights and long-term implications. Analyze content for strategic value.',
        'theologian': 'You are a theologian and philosopher. Analyze content for theological, philosophical, and ethical implications.',
        'technical-architect': 'You are a software architect. Analyze technical content for architecture patterns and system design.',
        'writer': 'You are a creative writer and storyteller. Analyze content for narrative structure and communication effectiveness.',
        'analyst': 'You are a data analyst focused on evidence and critical thinking. Analyze content for logical rigor and factual accuracy.',
        'debugger': 'You are a critical analyst who identifies flaws and weaknesses. Analyze content for potential issues or gaps.',
        'ux-designer': 'You are a UX designer. Analyze content for user experience and design principles.',
        'marketing-strategist': 'You are a marketing expert. Analyze content for marketing potential and audience engagement.',
        'game-designer': 'You are a game designer. Analyze content for engagement mechanics and flow.',
        'gen-alpha-expert': 'You are an expert on Gen Alpha youth culture. Analyze content for relevance to digital natives.'
    };

    return prompts[personaId] || 'You are an expert analyst. Provide insightful analysis of this content.';
}
