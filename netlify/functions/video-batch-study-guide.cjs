/**
 * Video Batch Study Guide Generator
 * Complete curriculum: summary, quiz, vocab, timeline
 */

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

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
        const { videos } = JSON.parse(event.body);

        if (!videos || !Array.isArray(videos) || videos.length < 2) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Need at least 2 videos for study guide' })
            };
        }

        console.log(`[Study Guide] Processing ${videos.length} videos`);

        const videoContexts = videos.map((v, i) => {
            const transcript = typeof v.transcript === 'string' 
                ? v.transcript 
                : (v.transcript?.full_text || '');
            
            return `
VIDEO ${i + 1}: ${v.title}
Channel: ${v.channel_name || v.channelName || 'Unknown'}
Duration: ${v.duration || 'Unknown'}
TRANSCRIPT: ${transcript.substring(0, 7000)}...
`;
        }).join('\n\n');

        const prompt = `You are creating a COMPLETE UNIT STUDY GUIDE from ${videos.length} educational videos.

${videoContexts}

Create a comprehensive study guide with ALL of these sections:

---

# 📚 UNIT STUDY GUIDE: [Unit Title]

## 📋 UNIT OVERVIEW
- **Topic**: [Main subject covered]
- **Videos Included**: ${videos.length}
- **Estimated Study Time**: [hours]
- **Learning Objectives**: 5-7 clear objectives

---

## 🎯 EXECUTIVE SUMMARY
Write a 3-4 paragraph overview of the entire unit, covering:
- Main themes and concepts
- How videos build on each other
- Key takeaways
- Practical applications

---

## 📖 VIDEO SUMMARIES

For each video:
### Video ${1}: [Title]
**Main Focus**: [1 sentence]
**Key Points**:
- [3-5 bullet points]
**Connection to Unit**: [How it fits]

---

## 📚 MASTER VOCABULARY (20-25 terms)

Organized by category with:
- **Term**: Definition
- **Context**: Usage across videos
- **Example**: Clear example sentence

---

## 📝 COMPREHENSIVE QUIZ

**Multiple Choice** (8 questions)
**Short Answer** (5 questions)
**Connections** (3 questions)
**True/False** (6 questions)

With full answer key and explanations

---

## 🗺️ CONCEPT MAP

Create an ASCII art or text-based diagram showing:
- Major concepts
- How they connect
- Relationships between videos

---

## ⏰ LEARNING TIMELINE

**Week 1**:
- Day 1-2: [Videos, activities]
- Day 3-4: [Videos, activities]
- Day 5: [Review, quiz]

**Week 2**:
[Continue pattern]

---

## 💡 DISCUSSION QUESTIONS (8-10)

Mix of:
- Recall questions
- Analysis questions
- Synthesis questions
- Application questions

---

## 🎯 LEARNING ACTIVITIES

**Individual Activities** (5):
- Research projects
- Writing assignments
- Creative projects

**Group Activities** (3):
- Debates
- Presentations
- Collaborative projects

---

## 📊 ASSESSMENT RUBRIC

Criteria for evaluating:
- Quiz performance
- Participation
- Projects
- Understanding

---

## 📚 ADDITIONAL RESOURCES

- Related videos
- Books
- Websites
- Apps/tools

---

## ✅ STUDENT CHECKLIST

- [ ] Watched all ${videos.length} videos
- [ ] Completed vocabulary review
- [ ] Took unit quiz
- [ ] [Additional checkpoints]

---

Make this a COMPLETE, READY-TO-USE curriculum document. Format beautifully in Markdown with emojis, clear sections, and professional styling.`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 16000,
            temperature: 0.7,
            messages: [{
                role: 'user',
                content: prompt
            }]
        });

        const studyGuide = message.content[0].text;

        console.log(`[Study Guide] ✅ Generated guide (${studyGuide.length} chars)`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                studyGuide,
                videoCount: videos.length,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('[Study Guide] ❌ Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message || 'Failed to generate study guide'
            })
        };
    }
};
