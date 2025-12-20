/**
 * Video Vocabulary Builder - Phase 8 Week 3
 * Generates academic vocabulary lists from video transcripts
 * 
 * Features:
 * - Extract 15-20 key terms from video content
 * - Grade-appropriate definitions
 * - Example sentences showing usage in context
 * - Multiple meanings when applicable
 * - Word forms (noun, verb, adjective, etc.)
 * - Flashcard-friendly format (future: Anki/Quizlet export)
 */

const Anthropic = require('@anthropic-ai/sdk');

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
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { videoData, transcript, gradeLevel } = JSON.parse(event.body);

        if (!transcript || !videoData) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Missing required fields: videoData and transcript' })
            };
        }

        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });

        const grade = gradeLevel || 'middle school';
        const videoTitle = videoData.title || 'this video';

        const prompt = `You are an expert vocabulary instructor helping students build academic vocabulary from educational content.

**VIDEO INFORMATION:**
Title: ${videoTitle}
Duration: ${videoData.duration || 'Unknown'}

**TRANSCRIPT:**
${transcript}

**TASK:**
Generate a comprehensive vocabulary list of 15-20 key terms from this video. Focus on:
1. Academic vocabulary (tier 2 & 3 words)
2. Domain-specific terminology
3. Words essential for understanding the content
4. Terms students might not know at ${grade} level

**FOR EACH TERM PROVIDE:**
1. **Term**: The vocabulary word
2. **Part of Speech**: (noun, verb, adjective, etc.)
3. **Definition**: Clear, grade-appropriate definition (${grade} level)
4. **Context from Video**: How the term is used in this specific video
5. **Example Sentence**: Original example showing proper usage
6. **Word Forms**: Related forms (e.g., analyze → analysis, analytical, analyzer)
7. **Synonyms**: 2-3 similar words
8. **Memory Tip**: Mnemonic or connection to help remember

**RETURN AS JSON:**
{
  "vocabulary": [
    {
      "term": "photosynthesis",
      "partOfSpeech": "noun",
      "definition": "The process plants use to convert sunlight into food energy",
      "contextFromVideo": "The video explains how photosynthesis allows plants to create glucose from sunlight, water, and carbon dioxide",
      "exampleSentence": "During photosynthesis, chlorophyll in plant leaves captures energy from the sun",
      "wordForms": ["photosynthesize (verb)", "photosynthetic (adjective)"],
      "synonyms": ["carbon fixation", "light-dependent reactions"],
      "memoryTip": "Photo = light, synthesis = putting together. Plants put together food using light!"
    }
  ],
  "gradeLevel": "${grade}",
  "totalTerms": 15
}

Focus on words that are academically valuable and will expand students' vocabulary beyond this single video.`;

        console.log('🔤 Generating vocabulary list with Claude Sonnet 4...');

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            temperature: 0.7,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        const responseText = message.content[0].text;
        console.log('📚 Vocabulary generated, parsing response...');

        // Try to parse JSON from response
        let vocabularyData;
        try {
            // Look for JSON in code blocks or raw text
            const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                            responseText.match(/\{[\s\S]*"vocabulary"[\s\S]*\}/);
            
            if (jsonMatch) {
                vocabularyData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            } else {
                vocabularyData = JSON.parse(responseText);
            }

            console.log(`✅ Parsed ${vocabularyData.vocabulary?.length || 0} vocabulary terms`);
        } catch (parseError) {
            console.error('❌ JSON parsing failed, returning raw text:', parseError);
            
            // Fallback: return structured error with raw text
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({
                    vocabulary: [],
                    rawText: responseText,
                    error: 'Failed to parse vocabulary JSON',
                    parseError: parseError.message
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vocabularyData)
        };

    } catch (error) {
        console.error('❌ Vocabulary generation error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                error: 'Failed to generate vocabulary',
                message: error.message
            })
        };
    }
};
