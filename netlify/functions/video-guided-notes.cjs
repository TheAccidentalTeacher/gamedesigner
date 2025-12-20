/**
 * Video Guided Notes Generator - Phase 8 Week 3
 * Creates structured note-taking templates from video transcripts
 * 
 * Features:
 * - Cornell Notes format (questions | notes | summary)
 * - Hierarchical outline format (I, A, 1, a, etc.)
 * - Fill-in-the-blank worksheets (key terms removed)
 * - Guided questions throughout content
 * - Timestamp references for video navigation
 * - Section-based organization matching video structure
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
        const { videoData, transcript, noteStyle, gradeLevel } = JSON.parse(event.body);

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

        const style = noteStyle || 'cornell';
        const grade = gradeLevel || 'middle school';
        const videoTitle = videoData.title || 'this video';

        // Build style-specific prompt
        let styleInstructions = '';
        
        if (style === 'cornell') {
            styleInstructions = `**CORNELL NOTES FORMAT:**
Structure with three sections:
1. **Questions (Left Column)**: Key questions that the notes answer
2. **Notes (Right Column)**: Main content, facts, definitions, examples
3. **Summary (Bottom)**: 3-4 sentence synthesis of main ideas

Return as JSON:
{
  "sections": [
    {
      "topic": "Section title",
      "timestamp": "0:00",
      "questions": ["Question 1?", "Question 2?"],
      "notes": ["Note point 1", "Note point 2", "Note point 3"],
      "keyTerms": ["term1", "term2"]
    }
  ],
  "summary": "Overall 3-4 sentence summary connecting all sections"
}`;
        } else if (style === 'outline') {
            styleInstructions = `**HIERARCHICAL OUTLINE FORMAT:**
Use standard outline structure:
- Roman numerals (I, II, III) for main topics
- Capital letters (A, B, C) for subtopics
- Numbers (1, 2, 3) for supporting details
- Lowercase letters (a, b, c) for examples

Return as JSON:
{
  "title": "Main topic",
  "outline": [
    {
      "level": 1,
      "marker": "I",
      "text": "First main topic",
      "timestamp": "0:00",
      "children": [
        {
          "level": 2,
          "marker": "A",
          "text": "First subtopic",
          "children": [
            {"level": 3, "marker": "1", "text": "Supporting detail"}
          ]
        }
      ]
    }
  ]
}`;
        } else if (style === 'fillinblank') {
            styleInstructions = `**FILL-IN-THE-BLANK WORKSHEET:**
Create sentences with key terms removed, replaced with blanks.
Provide word bank at the end.

Return as JSON:
{
  "instructions": "Fill in the blanks using the word bank below.",
  "sections": [
    {
      "topic": "Section title",
      "timestamp": "0:00",
      "sentences": [
        "The ________ is the process by which plants convert ________ into food.",
        "This occurs in the ________ of plant cells."
      ]
    }
  ],
  "wordBank": ["photosynthesis", "sunlight", "chloroplasts"],
  "answerKey": ["photosynthesis", "sunlight", "chloroplasts"]
}`;
        } else { // guided
            styleInstructions = `**GUIDED QUESTIONS FORMAT:**
Mix of content blocks with interspersed questions to guide thinking.

Return as JSON:
{
  "sections": [
    {
      "topic": "Section title",
      "timestamp": "0:00",
      "contentBlocks": [
        {
          "type": "content",
          "text": "Paragraph of information from video"
        },
        {
          "type": "question",
          "text": "What does this tell us about...?"
        },
        {
          "type": "content",
          "text": "More information"
        }
      ]
    }
  ]
}`;
        }

        const prompt = `You are an expert educator creating guided notes for students watching an educational video.

**VIDEO INFORMATION:**
Title: ${videoTitle}
Duration: ${videoData.duration || 'Unknown'}
Grade Level: ${grade}

**TRANSCRIPT:**
${transcript}

**TASK:**
Create comprehensive guided notes in **${style.toUpperCase()}** format.

${styleInstructions}

**REQUIREMENTS:**
1. Organize content by video sections/topics
2. Include timestamps for navigation (format: "MM:SS")
3. Match ${grade} reading/comprehension level
4. Highlight key concepts and vocabulary
5. Make notes clear, concise, and student-friendly
6. Leave appropriate space for student responses

Focus on helping students actively engage with the video content while taking notes.`;

        console.log(`📝 Generating ${style} guided notes with Claude Sonnet 4...`);

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
        console.log('✅ Guided notes generated, parsing response...');
        console.log('📊 Response length:', responseText.length);
        console.log('📊 First 500 chars:', responseText.substring(0, 500));

        // Try to parse JSON from response
        let guidedNotesData;
        try {
            const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || 
                            responseText.match(/\{[\s\S]*"(sections|outline|title)"[\s\S]*\}/);
            
            if (jsonMatch) {
                guidedNotesData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            } else {
                guidedNotesData = JSON.parse(responseText);
            }

            console.log(`✅ Parsed guided notes (${style} format)`);
            console.log('📊 Parsed data keys:', Object.keys(guidedNotesData));
            console.log('📊 Has sections?', !!guidedNotesData.sections);
            console.log('📊 Has summary?', !!guidedNotesData.summary);
            if (guidedNotesData.sections) {
                console.log('📊 Number of sections:', guidedNotesData.sections.length);
            }
        } catch (parseError) {
            console.error('❌ JSON parsing failed, returning raw text:', parseError);
            
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({
                    sections: [],
                    rawText: responseText,
                    error: 'Failed to parse guided notes JSON',
                    parseError: parseError.message,
                    noteStyle: style
                })
            };
        }

        // Add metadata
        guidedNotesData.noteStyle = style;
        guidedNotesData.gradeLevel = grade;
        guidedNotesData.videoTitle = videoData.title;
        
        console.log('📦 Final data before returning:', {
            keys: Object.keys(guidedNotesData),
            hasSections: !!guidedNotesData.sections,
            hasSummary: !!guidedNotesData.summary,
            noteStyle: guidedNotesData.noteStyle,
            gradeLevel: guidedNotesData.gradeLevel
        });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(guidedNotesData)
        };

    } catch (error) {
        console.error('❌ Guided notes generation error:', error);
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                error: 'Failed to generate guided notes',
                message: error.message
            })
        };
    }
};
