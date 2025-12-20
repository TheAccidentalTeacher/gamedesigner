// video-content-tools.js
// Phase 8 Week 2: Generate educational content FROM YouTube videos
// Tools: Quiz Maker, Lesson Plan, Discussion Questions, Guided Notes, Vocabulary, Graphic Organizers

export class VideoContentTools {
  constructor(videoData, transcript) {
    this.videoData = videoData;
    this.transcript = transcript;
    this.videoTitle = videoData.title;
    this.videoId = videoData.videoId;
    this.duration = videoData.duration;
  }

  /**
   * Generate comprehensive quiz from video
   * Includes: Multiple choice, short answer, true/false, fill-in-blank
   * NOW WITH DOK (Depth of Knowledge) FRAMEWORK!
   */
  async generateQuiz(options = {}) {
    const {
      numMultipleChoice = 5,
      numShortAnswer = 3,
      numTrueFalse = 5,
      numFillInBlank = 5,
      difficulty = 'mixed',
      includeTimestamps = true,
      dokLevel = null, // 1-4 or null for mixed
      includeDOK = false // Add DOK labels to each question
    } = options;

    console.log('🎯 Generating quiz from video...', {
      videoTitle: this.videoTitle,
      options
    });

    const prompt = this.buildQuizPrompt(numMultipleChoice, numShortAnswer, numTrueFalse, numFillInBlank, difficulty, dokLevel, includeDOK);

    try {
      const response = await fetch('/api/video-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: this.videoId,
          videoTitle: this.videoTitle,
          transcript: this.transcript,
          prompt,
          options
        })
      });

      if (!response.ok) {
        throw new Error(`Quiz generation failed: ${response.statusText}`);
      }

      const quiz = await response.json();
      console.log('✅ Quiz generated:', quiz);
      
      return this.formatQuiz(quiz, includeTimestamps);
    } catch (error) {
      console.error('❌ Quiz generation error:', error);
      throw error;
    }
  }

  buildQuizPrompt(mc, sa, tf, fib, difficulty, dokLevel, includeDOK) {
    const dokGuidance = dokLevel ? this.getDOKGuidance(dokLevel) : '';
    const dokInstruction = includeDOK ? '- Label each question with its DOK level (1-4)\n   ' : '';
    
    return `You are an expert educator creating a comprehensive quiz from this YouTube video.

VIDEO INFORMATION:
- Title: ${this.videoTitle}
- Duration: ${this.duration}
- Video ID: ${this.videoId}

TRANSCRIPT:
${this.transcript.substring(0, 8000)} // Truncate if too long

${dokGuidance}

TASK: Create an educational quiz with the following components:

1. MULTIPLE CHOICE QUESTIONS (${mc} questions)
   - 4 answer options for each question
   - Clearly mark the correct answer
   - Include an explanation for why the correct answer is correct
   - Address common misconceptions
   - Vary difficulty: ${difficulty === 'mixed' ? 'Include easy (2), medium (2), and hard (1)' : `All ${difficulty} difficulty`}
   - Reference the timestamp in the video where the answer can be found

2. SHORT ANSWER QUESTIONS (${sa} questions)
   - Open-ended questions requiring synthesis
   - Provide a detailed sample answer (3-5 sentences)
   - Include a grading rubric (key points to look for)
   - Reference relevant timestamps

3. TRUE/FALSE QUESTIONS (${tf} questions)
   - Clear statements that are unambiguously true or false
   - Explain why the statement is true or false
   - Reference supporting content from video

4. FILL-IN-THE-BLANK QUESTIONS (${fib} questions)
   - Key terms or concepts with blanks
   - Provide word bank (include extra distractors)
   - Ensure only one answer makes sense

FORMATTING REQUIREMENTS:
- Return as structured JSON
- ${dokInstruction}Include timestamps for all questions
- Provide detailed explanations
- Include section headers
- For timestamps, use format: "MM:SS"
- Include difficulty rating for each question
- Add teaching notes where helpful

RESPONSE FORMAT:
{
  "title": "Quiz: [Video Title]",
  "videoId": "${this.videoId}",
  "totalQuestions": ${mc + sa + tf + fib},
  "estimatedTime": "30-45 minutes",
  "multipleChoice": [
    {
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "B",
      "explanation": "...",
      "timestamp": "3:45",
      "difficulty": "medium"
    }
  ],
  "shortAnswer": [
    {
      "question": "...",
      "sampleAnswer": "...",
      "rubric": ["Point 1", "Point 2", "Point 3"],
      "timestamp": "5:20",
      "difficulty": "hard"
    }
  ],
  "trueFalse": [
    {
      "statement": "...",
      "correct": true,
      "explanation": "...",
      "timestamp": "2:10"
    }
  ],
  "fillInBlank": [
    {
      "sentence": "The ____ is responsible for ____.",
      "blanks": ["brain", "thinking"],
      "wordBank": ["brain", "heart", "thinking", "pumping", "breathing"],
      "timestamp": "7:30"
    }
  ]
}

Generate a comprehensive, educationally sound quiz that tests understanding at multiple levels.`;
  }

  formatQuiz(quiz, includeTimestamps) {
    let markdown = `# ${quiz.title}\n\n`;
    markdown += `**Video ID**: ${quiz.videoId}  \n`;
    markdown += `**Total Questions**: ${quiz.totalQuestions}  \n`;
    markdown += `**Estimated Time**: ${quiz.estimatedTime}\n\n`;
    markdown += `---\n\n`;

    // Multiple Choice
    if (quiz.multipleChoice && quiz.multipleChoice.length > 0) {
      markdown += `## Part 1: Multiple Choice (${quiz.multipleChoice.length} questions)\n\n`;
      markdown += `*Choose the best answer for each question.*\n\n`;
      
      quiz.multipleChoice.forEach((q, index) => {
        markdown += `### Question ${index + 1}\n`;
        if (includeTimestamps && q.timestamp) {
          markdown += `*Video timestamp: ${q.timestamp}*\n\n`;
        }
        markdown += `${q.question}\n\n`;
        q.options.forEach(option => {
          markdown += `${option}\n`;
        });
        markdown += `\n`;
      });
      markdown += `\n`;
    }

    // Short Answer
    if (quiz.shortAnswer && quiz.shortAnswer.length > 0) {
      markdown += `## Part 2: Short Answer (${quiz.shortAnswer.length} questions)\n\n`;
      markdown += `*Answer each question in 3-5 complete sentences.*\n\n`;
      
      quiz.shortAnswer.forEach((q, index) => {
        markdown += `### Question ${index + 1}\n`;
        if (includeTimestamps && q.timestamp) {
          markdown += `*Video timestamp: ${q.timestamp}*\n\n`;
        }
        markdown += `${q.question}\n\n`;
        markdown += `---\n\n`;
      });
      markdown += `\n`;
    }

    // True/False
    if (quiz.trueFalse && quiz.trueFalse.length > 0) {
      markdown += `## Part 3: True/False (${quiz.trueFalse.length} questions)\n\n`;
      markdown += `*Mark each statement as TRUE or FALSE.*\n\n`;
      
      quiz.trueFalse.forEach((q, index) => {
        markdown += `${index + 1}. ${q.statement}\n`;
        if (includeTimestamps && q.timestamp) {
          markdown += `   *Video timestamp: ${q.timestamp}*\n`;
        }
        markdown += `\n`;
      });
      markdown += `\n`;
    }

    // Fill in the Blank
    if (quiz.fillInBlank && quiz.fillInBlank.length > 0) {
      markdown += `## Part 4: Fill in the Blank (${quiz.fillInBlank.length} questions)\n\n`;
      
      // Word bank
      if (quiz.fillInBlank[0].wordBank) {
        markdown += `**Word Bank**: ${quiz.fillInBlank[0].wordBank.join(', ')}\n\n`;
      }
      
      quiz.fillInBlank.forEach((q, index) => {
        markdown += `${index + 1}. ${q.sentence}\n`;
        if (includeTimestamps && q.timestamp) {
          markdown += `   *Video timestamp: ${q.timestamp}*\n`;
        }
        markdown += `\n`;
      });
      markdown += `\n`;
    }

    // Answer Key
    markdown += `---\n\n`;
    markdown += `# Answer Key\n\n`;
    markdown += `## Part 1: Multiple Choice\n`;
    quiz.multipleChoice.forEach((q, index) => {
      markdown += `${index + 1}. **${q.correctAnswer}** - ${q.explanation}\n`;
    });
    markdown += `\n## Part 2: Short Answer\n`;
    quiz.shortAnswer.forEach((q, index) => {
      markdown += `${index + 1}. **Sample Answer**: ${q.sampleAnswer}\n`;
      markdown += `   **Rubric**:\n`;
      q.rubric.forEach(point => {
        markdown += `   - ${point}\n`;
      });
      markdown += `\n`;
    });
    markdown += `\n## Part 3: True/False\n`;
    quiz.trueFalse.forEach((q, index) => {
      markdown += `${index + 1}. **${q.correct ? 'TRUE' : 'FALSE'}** - ${q.explanation}\n`;
    });
    markdown += `\n## Part 4: Fill in the Blank\n`;
    quiz.fillInBlank.forEach((q, index) => {
      markdown += `${index + 1}. **${q.blanks.join(', ')}**\n`;
    });

    return {
      raw: quiz,
      markdown,
      plainText: this.markdownToPlainText(markdown)
    };
  }

  /**
   * Generate complete lesson plan using video as core content
   */
  async generateLessonPlan(options = {}) {
    const {
      gradeLevel = '9-12',
      duration = '45 minutes',
      subject = 'General',
      includeActivities = true,
      includeDifferentiation = true
    } = options;

    console.log('📚 Generating lesson plan from video...', {
      videoTitle: this.videoTitle,
      options
    });

    const prompt = this.buildLessonPlanPrompt(gradeLevel, duration, subject, includeActivities, includeDifferentiation);

    try {
      const response = await fetch('/api/video-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: this.videoId,
          videoTitle: this.videoTitle,
          transcript: this.transcript,
          duration: this.duration,
          prompt,
          options
        })
      });

      if (!response.ok) {
        throw new Error(`Lesson plan generation failed: ${response.statusText}`);
      }

      const lessonPlan = await response.json();
      console.log('✅ Lesson plan generated:', lessonPlan);
      
      return this.formatLessonPlan(lessonPlan);
    } catch (error) {
      console.error('❌ Lesson plan generation error:', error);
      throw error;
    }
  }

  buildLessonPlanPrompt(gradeLevel, duration, subject, activities, differentiation) {
    return `You are an expert educator creating a comprehensive lesson plan using this YouTube video as the core instructional content.

VIDEO INFORMATION:
- Title: ${this.videoTitle}
- Duration: ${this.duration}
- Video ID: ${this.videoId}

TRANSCRIPT:
${this.transcript.substring(0, 8000)}

LESSON PARAMETERS:
- Grade Level: ${gradeLevel}
- Lesson Duration: ${duration}
- Subject Area: ${subject}

TASK: Create a complete, ready-to-use lesson plan with these components:

1. LEARNING OBJECTIVES (3-5 objectives)
   - Use Bloom's Taxonomy verbs (understand, analyze, evaluate, create)
   - Make objectives measurable and specific
   - Align to video content
   - Progressive difficulty

2. MATERIALS NEEDED
   - Video link and duration
   - Any handouts/worksheets
   - Technology requirements
   - Additional resources

3. LESSON SEQUENCE

   A. OPENING (10-15 min)
      - Hook/Attention-getter
      - Activate prior knowledge
      - Pre-video activity (KWL chart, anticipation guide, vocabulary preview)
      - Preview key questions

   B. VIDEO VIEWING (${this.duration})
      - Guided viewing strategy
      - Pause points with discussion questions (3-5 pauses)
      - Note-taking template or graphic organizer
      - Active watching techniques

   C. POST-VIDEO DISCUSSION (15-20 min)
      - Key questions to process content
      - Small group or whole class discussion
      - Think-Pair-Share activities
      - Connections to real world

   D. APPLICATION ACTIVITY (15-20 min)
      - Hands-on activity applying concepts
      - Group work or individual task
      - Creative extension

   E. CLOSURE (5-10 min)
      - Exit ticket or quick assessment
      - Summarize key learnings
      - Preview homework/next lesson

4. ASSESSMENT
   - Formative assessment during lesson
   - Summative assessment (quiz, project, essay)
   - Exit ticket question
   - Homework assignment

${differentiation ? `5. DIFFERENTIATION
   - For struggling learners (scaffolds, simplifications)
   - For advanced learners (extensions, enrichment)
   - For ELL students (vocabulary support, visuals)
   - For different learning styles (visual, auditory, kinesthetic)` : ''}

6. EXTENSION IDEAS
   - Related topics to explore
   - Additional resources
   - Cross-curricular connections

RESPONSE FORMAT:
{
  "title": "Lesson Plan: [Video Title]",
  "gradeLevel": "${gradeLevel}",
  "duration": "${duration}",
  "subject": "${subject}",
  "videoId": "${this.videoId}",
  "videoUrl": "https://www.youtube.com/watch?v=${this.videoId}",
  "videoDuration": "${this.duration}",
  
  "objectives": [
    "Students will be able to...",
    "Students will understand...",
    "Students will analyze..."
  ],
  
  "materials": [
    "Video: ${this.videoTitle}",
    "Handout: Guided notes template",
    "Technology: Computer/projector",
    "..."
  ],
  
  "lessonSequence": {
    "opening": {
      "duration": "10 min",
      "activities": [
        {
          "name": "Hook",
          "description": "...",
          "time": "3 min"
        },
        {
          "name": "KWL Chart",
          "description": "...",
          "time": "7 min"
        }
      ]
    },
    "videoViewing": {
      "duration": "${this.duration}",
      "pausePoints": [
        {
          "timestamp": "3:45",
          "question": "...",
          "purpose": "Check understanding"
        }
      ],
      "noteStrategy": "Cornell notes / Guided notes"
    },
    "discussion": {
      "duration": "15 min",
      "questions": [
        "...",
        "..."
      ],
      "activities": [
        "Think-Pair-Share: ...",
        "Small group discussion: ..."
      ]
    },
    "application": {
      "duration": "15 min",
      "activity": {
        "name": "...",
        "description": "...",
        "grouping": "pairs/groups/individual",
        "materials": "..."
      }
    },
    "closure": {
      "duration": "5 min",
      "exitTicket": "...",
      "summary": "...",
      "homework": "..."
    }
  },
  
  "assessment": {
    "formative": ["...", "..."],
    "summative": "...",
    "exitTicket": "...",
    "homework": "..."
  },
  
  ${differentiation ? `"differentiation": {
    "strugglingLearners": ["...", "..."],
    "advancedLearners": ["...", "..."],
    "ellStudents": ["...", "..."],
    "learningStyles": {
      "visual": "...",
      "auditory": "...",
      "kinesthetic": "..."
    }
  },` : ''}
  
  "extensions": [
    "...",
    "..."
  ]
}

Create a detailed, practical lesson plan that a teacher could use immediately.`;
  }

  formatLessonPlan(plan) {
    let markdown = `# ${plan.title}\n\n`;
    
    // Metadata
    markdown += `**Grade Level**: ${plan.gradeLevel}  \n`;
    markdown += `**Duration**: ${plan.duration}  \n`;
    markdown += `**Subject**: ${plan.subject}  \n`;
    markdown += `**Video**: [${this.videoTitle}](https://www.youtube.com/watch?v=${plan.videoId}) (${plan.videoDuration})\n\n`;
    markdown += `---\n\n`;

    // Learning Objectives
    markdown += `## Learning Objectives\n\n`;
    plan.objectives.forEach((obj, i) => {
      markdown += `${i + 1}. ${obj}\n`;
    });
    markdown += `\n`;

    // Materials
    markdown += `## Materials Needed\n\n`;
    plan.materials.forEach(material => {
      markdown += `- ${material}\n`;
    });
    markdown += `\n`;

    // Lesson Sequence
    markdown += `## Lesson Sequence\n\n`;

    // Opening
    markdown += `### Opening (${plan.lessonSequence.opening.duration})\n\n`;
    plan.lessonSequence.opening.activities.forEach(activity => {
      markdown += `**${activity.name}** (${activity.time})\n`;
      markdown += `${activity.description}\n\n`;
    });

    // Video Viewing
    markdown += `### Video Viewing (${plan.lessonSequence.videoViewing.duration})\n\n`;
    markdown += `**Note-Taking Strategy**: ${plan.lessonSequence.videoViewing.noteStrategy}\n\n`;
    if (plan.lessonSequence.videoViewing.pausePoints && plan.lessonSequence.videoViewing.pausePoints.length > 0) {
      markdown += `**Pause Points**:\n`;
      plan.lessonSequence.videoViewing.pausePoints.forEach(pause => {
        markdown += `- **${pause.timestamp}**: ${pause.question} (${pause.purpose})\n`;
      });
      markdown += `\n`;
    }

    // Discussion
    markdown += `### Post-Video Discussion (${plan.lessonSequence.discussion.duration})\n\n`;
    markdown += `**Discussion Questions**:\n`;
    plan.lessonSequence.discussion.questions.forEach((q, i) => {
      markdown += `${i + 1}. ${q}\n`;
    });
    markdown += `\n**Activities**:\n`;
    plan.lessonSequence.discussion.activities.forEach(activity => {
      markdown += `- ${activity}\n`;
    });
    markdown += `\n`;

    // Application
    markdown += `### Application Activity (${plan.lessonSequence.application.duration})\n\n`;
    const app = plan.lessonSequence.application.activity;
    markdown += `**${app.name}**\n\n`;
    markdown += `${app.description}\n\n`;
    markdown += `- **Grouping**: ${app.grouping}\n`;
    markdown += `- **Materials**: ${app.materials}\n\n`;

    // Closure
    markdown += `### Closure (${plan.lessonSequence.closure.duration})\n\n`;
    markdown += `**Exit Ticket**: ${plan.lessonSequence.closure.exitTicket}\n\n`;
    markdown += `**Summary**: ${plan.lessonSequence.closure.summary}\n\n`;
    markdown += `**Homework**: ${plan.lessonSequence.closure.homework}\n\n`;

    // Assessment
    markdown += `## Assessment\n\n`;
    markdown += `**Formative**:\n`;
    plan.assessment.formative.forEach(item => {
      markdown += `- ${item}\n`;
    });
    markdown += `\n**Summative**: ${plan.assessment.summative}\n\n`;

    // Differentiation
    if (plan.differentiation) {
      markdown += `## Differentiation\n\n`;
      markdown += `### For Struggling Learners\n`;
      plan.differentiation.strugglingLearners.forEach(item => {
        markdown += `- ${item}\n`;
      });
      markdown += `\n### For Advanced Learners\n`;
      plan.differentiation.advancedLearners.forEach(item => {
        markdown += `- ${item}\n`;
      });
      markdown += `\n### For ELL Students\n`;
      plan.differentiation.ellStudents.forEach(item => {
        markdown += `- ${item}\n`;
      });
      markdown += `\n`;
    }

    // Extensions
    markdown += `## Extension Ideas\n\n`;
    plan.extensions.forEach(ext => {
      markdown += `- ${ext}\n`;
    });

    return {
      raw: plan,
      markdown,
      plainText: this.markdownToPlainText(markdown)
    };
  }

  /**
   * Generate discussion questions at multiple cognitive levels
   */
  async generateDiscussionQuestions(options = {}) {
    const {
      numPerLevel = 3,
      includeSocratic = true,
      includeDebate = true
    } = options;

    console.log('💬 Generating discussion questions...', {
      videoTitle: this.videoTitle,
      options
    });

    const prompt = `Generate thought-provoking discussion questions from this video, organized by Bloom's Taxonomy levels.

VIDEO: ${this.videoTitle}
TRANSCRIPT: ${this.transcript.substring(0, 8000)}

Create ${numPerLevel} questions at each level:
1. Remember/Recall
2. Understand/Comprehension
3. Apply/Application
4. Analyze/Analysis
5. Evaluate/Evaluation
6. Create/Synthesis

${includeSocratic ? 'Include Socratic questioning techniques (probing assumptions, exploring implications).' : ''}
${includeDebate ? 'Include 2-3 debate-worthy questions with no clear right answer.' : ''}

Return as JSON with structure for each question: question, level, purpose, follow-ups.`;

    try {
      const response = await fetch('/api/video-discussion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: this.videoId,
          videoTitle: this.videoTitle,
          transcript: this.transcript,
          prompt,
          options
        })
      });

      const questions = await response.json();
      // API returns {discussion_questions: {...}}, extract the nested object
      const questionsData = questions.discussion_questions || questions;
      return this.formatDiscussionQuestions(questionsData);
    } catch (error) {
      console.error('❌ Discussion questions error:', error);
      throw error;
    }
  }

  formatDiscussionQuestions(data) {
    let markdown = `# Discussion Questions: ${this.videoTitle}\n\n`;
    markdown += `Use these questions to facilitate classroom discussion after watching the video.\n\n`;
    markdown += `---\n\n`;

    const levels = [
      { key: 'remember', title: 'Level 1: Remember/Recall' },
      { key: 'understand', title: 'Level 2: Understand/Comprehension' },
      { key: 'apply', title: 'Level 3: Apply/Application' },
      { key: 'analyze', title: 'Level 4: Analyze/Analysis' },
      { key: 'evaluate', title: 'Level 5: Evaluate/Evaluation' },
      { key: 'create', title: 'Level 6: Create/Synthesis' }
    ];

    levels.forEach(level => {
      if (data[level.key] && data[level.key].length > 0) {
        markdown += `## ${level.title}\n\n`;
        data[level.key].forEach((q, i) => {
          markdown += `${i + 1}. ${q.question}\n`;
          if (q.purpose) markdown += `   *Purpose: ${q.purpose}*\n`;
          if (q.followUps && q.followUps.length > 0) {
            markdown += `   **Follow-ups**:\n`;
            q.followUps.forEach(fu => {
              markdown += `   - ${fu}\n`;
            });
          }
          markdown += `\n`;
        });
      }
    });

    if (data.debate && data.debate.length > 0) {
      markdown += `## Debate Questions\n\n`;
      markdown += `*These questions have no single right answer and are excellent for structured debates.*\n\n`;
      data.debate.forEach((q, i) => {
        markdown += `${i + 1}. ${q.question}\n`;
        if (q.perspectives) {
          markdown += `   **Perspectives to consider**:\n`;
          q.perspectives.forEach(p => {
            markdown += `   - ${p}\n`;
          });
        }
        markdown += `\n`;
      });
    }

    return {
      raw: data,
      markdown,
      plainText: this.markdownToPlainText(markdown)
    };
  }

  /**
   * Generate DOK 3-4 Extended Project
   * For strategic thinking and extended thinking tasks
   */
  async generateDOKProject(options = {}) {
    const {
      dokLevel = 3, // 3 or 4
      projectType = 'research', // research, design, investigation, synthesis
      duration = '2-3 weeks',
      gradeLevel = '9-12',
      subject = 'General'
    } = options;

    console.log('🎓 Generating DOK Project from video...', {
      videoTitle: this.videoTitle,
      dokLevel,
      projectType
    });

    const prompt = this.buildDOKProjectPrompt(dokLevel, projectType, duration, gradeLevel, subject);

    try {
      const response = await fetch('/api/video-dok-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: this.videoId,
          videoTitle: this.videoTitle,
          transcript: this.transcript,
          prompt,
          options
        })
      });

      if (!response.ok) {
        throw new Error(`DOK project generation failed: ${response.statusText}`);
      }

      const project = await response.json();
      console.log('✅ DOK project generated:', project);
      
      return this.formatDOKProject(project);
    } catch (error) {
      console.error('❌ DOK project generation error:', error);
      throw error;
    }
  }

  buildDOKProjectPrompt(dokLevel, projectType, duration, gradeLevel, subject) {
    const dokDescription = dokLevel === 3 
      ? 'DOK 3 (Strategic Thinking): Requires reasoning, planning, using evidence, and abstract thinking. Students make complex inferences and support with evidence.'
      : 'DOK 4 (Extended Thinking): Requires investigation over time, complex reasoning, multiple sources, and real-world application. Students design, connect, synthesize, and apply.';

    return `You are an expert educator creating a ${dokDescription} project based on this YouTube video.

VIDEO INFORMATION:
- Title: ${this.videoTitle}
- Duration: ${this.duration}
- Video ID: ${this.videoId}

TRANSCRIPT:
${this.transcript.substring(0, 8000)}

PROJECT PARAMETERS:
- DOK Level: ${dokLevel}
- Project Type: ${projectType}
- Duration: ${duration}
- Grade Level: ${gradeLevel}
- Subject: ${subject}

TASK: Create an extended project that requires students to:

${dokLevel === 3 ? `
DOK 3 REQUIREMENTS (Strategic Thinking):
- Analyze complex information from the video
- Develop logical arguments using evidence
- Draw conclusions based on reasoning
- Solve non-routine problems
- Explain thinking and reasoning
- Cite evidence to support conclusions
- Make connections across concepts
- Use abstract thinking
` : `
DOK 4 REQUIREMENTS (Extended Thinking):
- Conduct extended research beyond the video (multiple sources)
- Synthesize information from diverse sources
- Apply knowledge to real-world situations
- Design solutions to complex problems
- Develop original work (research paper, presentation, product)
- Critique and evaluate multiple perspectives
- Connect across disciplines
- Demonstrate metacognitive thinking
- Work extended over time (multiple sessions)
`}

PROJECT COMPONENTS:

1. DRIVING QUESTION
   - Central question that requires ${dokLevel === 3 ? 'strategic thinking' : 'extended investigation'}
   - Open-ended, no single right answer
   - Grounded in video content but extends beyond it

2. LEARNING OBJECTIVES
   - What students will understand deeply
   - What skills they will develop
   - What they will be able to do at the end

3. PROJECT OVERVIEW
   - Clear description of the project
   - Connection to video content
   - Why this matters (real-world relevance)
   - ${dokLevel === 4 ? 'Timeline breakdown (week-by-week)' : 'Multi-day sequence'}

4. REQUIRED TASKS
   - ${dokLevel === 3 ? '5-7 strategic thinking tasks' : '8-10 extended thinking tasks'}
   - Each task must require ${dokLevel === 3 ? 'reasoning and evidence' : 'research, synthesis, and application'}
   - Mix of individual and collaborative work
   - Scaffolded progression (build complexity)

5. DELIVERABLES
   - What students will create/produce
   - Format options (research paper, presentation, product, performance, etc.)
   - Quality criteria for each deliverable

6. ASSESSMENT RUBRIC
   - DOK ${dokLevel} criteria
   - Evidence of strategic/extended thinking
   - Quality of reasoning and evidence
   - Depth of analysis
   - Real-world application
   - 4-point scale (Exemplary, Proficient, Developing, Beginning)

7. RESOURCES & MATERIALS
   - Starting point: This video
   - Additional resources students should explore
   - Tools/technology needed
   - Community resources (if applicable)

8. DIFFERENTIATION
   - Scaffolds for struggling learners
   - Extensions for advanced learners
   - Multiple means of expression
   - Choice in topic/format where appropriate

9. CONNECTION TO STANDARDS
   - Which academic standards this addresses
   - Cross-curricular connections

10. REFLECTION PROMPTS
    - Metacognitive questions for students
    - Process reflection (what worked, what was challenging)
    - Learning growth documentation

RESPONSE FORMAT: Return as structured JSON with all components above.`;
  }

  formatDOKProject(data) {
    let markdown = `# ${data.title || 'DOK Project'}\n\n`;
    markdown += `**DOK Level**: ${data.dokLevel} (${data.dokLevel === 3 ? 'Strategic Thinking' : 'Extended Thinking'})  \n`;
    markdown += `**Duration**: ${data.duration}  \n`;
    markdown += `**Grade Level**: ${data.gradeLevel}  \n`;
    markdown += `**Subject**: ${data.subject}  \n\n`;
    markdown += `---\n\n`;

    // Driving Question
    if (data.drivingQuestion) {
      markdown += `## 🎯 Driving Question\n\n`;
      markdown += `**${data.drivingQuestion}**\n\n`;
      if (data.questionRationale) {
        markdown += `*Why this question?* ${data.questionRationale}\n\n`;
      }
    }

    // Learning Objectives
    if (data.objectives) {
      markdown += `## 📚 Learning Objectives\n\n`;
      data.objectives.forEach(obj => {
        markdown += `- ${obj}\n`;
      });
      markdown += `\n`;
    }

    // Project Overview
    if (data.overview) {
      markdown += `## 📖 Project Overview\n\n`;
      markdown += `${data.overview}\n\n`;
      if (data.realWorldRelevance) {
        markdown += `**Real-World Relevance**: ${data.realWorldRelevance}\n\n`;
      }
    }

    // Timeline (DOK 4)
    if (data.timeline && data.timeline.length > 0) {
      markdown += `## 📅 Timeline\n\n`;
      data.timeline.forEach(week => {
        markdown += `### ${week.phase}\n`;
        if (week.duration) markdown += `*${week.duration}*\n\n`;
        if (week.tasks) {
          week.tasks.forEach(task => {
            markdown += `- ${task}\n`;
          });
        }
        markdown += `\n`;
      });
    }

    // Required Tasks
    if (data.tasks && data.tasks.length > 0) {
      markdown += `## ✅ Required Tasks\n\n`;
      data.tasks.forEach((task, index) => {
        markdown += `### Task ${index + 1}: ${task.name}\n`;
        markdown += `**DOK Level**: ${task.dokLevel || data.dokLevel}  \n`;
        markdown += `**Description**: ${task.description}\n\n`;
        if (task.reasoning) {
          markdown += `**Why this matters**: ${task.reasoning}\n\n`;
        }
        if (task.resources && task.resources.length > 0) {
          markdown += `**Resources**:\n`;
          task.resources.forEach(r => markdown += `- ${r}\n`);
          markdown += `\n`;
        }
      });
    }

    // Deliverables
    if (data.deliverables) {
      markdown += `## 📦 Deliverables\n\n`;
      data.deliverables.forEach(d => {
        markdown += `### ${d.name}\n`;
        markdown += `${d.description}\n\n`;
        if (d.format) markdown += `**Format**: ${d.format}\n`;
        if (d.criteria) markdown += `**Quality Criteria**: ${d.criteria}\n`;
        markdown += `\n`;
      });
    }

    // Assessment Rubric
    if (data.rubric) {
      markdown += `## 📊 Assessment Rubric\n\n`;
      markdown += `| Criteria | Exemplary (4) | Proficient (3) | Developing (2) | Beginning (1) |\n`;
      markdown += `|----------|---------------|----------------|----------------|---------------|\n`;
      data.rubric.forEach(criterion => {
        markdown += `| **${criterion.name}** | ${criterion.exemplary} | ${criterion.proficient} | ${criterion.developing} | ${criterion.beginning} |\n`;
      });
      markdown += `\n`;
    }

    // Resources
    if (data.resources && data.resources.length > 0) {
      markdown += `## 📚 Resources & Materials\n\n`;
      markdown += `**Starting Point**: [${this.videoTitle}](https://www.youtube.com/watch?v=${this.videoId})\n\n`;
      markdown += `**Additional Resources**:\n`;
      data.resources.forEach(r => {
        markdown += `- ${r}\n`;
      });
      markdown += `\n`;
    }

    // Differentiation
    if (data.differentiation) {
      markdown += `## 🎨 Differentiation\n\n`;
      if (data.differentiation.scaffolds) {
        markdown += `**For Struggling Learners**:\n`;
        data.differentiation.scaffolds.forEach(s => markdown += `- ${s}\n`);
        markdown += `\n`;
      }
      if (data.differentiation.extensions) {
        markdown += `**For Advanced Learners**:\n`;
        data.differentiation.extensions.forEach(e => markdown += `- ${e}\n`);
        markdown += `\n`;
      }
      if (data.differentiation.choices) {
        markdown += `**Student Choice Options**:\n`;
        data.differentiation.choices.forEach(c => markdown += `- ${c}\n`);
        markdown += `\n`;
      }
    }

    // Standards
    if (data.standards && data.standards.length > 0) {
      markdown += `## 📐 Standards Alignment\n\n`;
      data.standards.forEach(s => {
        markdown += `- ${s}\n`;
      });
      markdown += `\n`;
    }

    // Reflection Prompts
    if (data.reflectionPrompts && data.reflectionPrompts.length > 0) {
      markdown += `## 🤔 Reflection Prompts\n\n`;
      data.reflectionPrompts.forEach(prompt => {
        markdown += `- ${prompt}\n`;
      });
      markdown += `\n`;
    }

    markdown += `---\n\n`;
    markdown += `*Generated from: [${this.videoTitle}](https://www.youtube.com/watch?v=${this.videoId})*\n`;

    return {
      raw: data,
      markdown,
      plainText: this.markdownToPlainText(markdown)
    };
  }

  /**
   * Get DOK Level Guidance for prompts
   */
  getDOKGuidance(level) {
    const dokDescriptions = {
      1: `DOK 1 (Recall & Reproduction): Questions should require students to recall facts, definitions, or simple procedures. Focus on what students can remember or recognize directly from the video.`,
      2: `DOK 2 (Skills & Concepts): Questions should require students to make decisions, organize information, compare/contrast, or apply concepts. Go beyond simple recall to basic application.`,
      3: `DOK 3 (Strategic Thinking): Questions should require reasoning, planning, using evidence, and abstract thinking. Students must justify answers, cite evidence, analyze complex relationships, and draw conclusions.`,
      4: `DOK 4 (Extended Thinking): Questions should require investigation over time, synthesis of multiple sources, real-world application, and original thought. These are project-based, requiring extended work beyond this single video.`
    };

    return `DEPTH OF KNOWLEDGE (DOK) FRAMEWORK - TARGET LEVEL ${level}:

${dokDescriptions[level]}

IMPORTANT: All questions should be at DOK Level ${level}. Ensure questions require this level of cognitive demand.

DOK Level Indicators:
- DOK 1: Define, list, identify, recall, recognize, tell, who/what/when/where
- DOK 2: Compare, contrast, classify, organize, estimate, summarize, interpret
- DOK 3: Analyze, explain why, draw conclusions, support with evidence, hypothesize, investigate
- DOK 4: Design, connect across disciplines, synthesize, apply to real world, critique, create original work
`;
  }

  /**
   * Generate Vocabulary Builder from video
   * Extracts 15-20 key academic terms with definitions, examples, and study aids
   */
  async generateVocabulary(options = {}) {
    const {
      gradeLevel = 'middle school',
      numTerms = 15
    } = options;

    console.log('🔤 Generating vocabulary list from video...', {
      videoTitle: this.videoTitle,
      gradeLevel,
      numTerms
    });

    try {
      const response = await fetch('/api/video-vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoData: this.videoData,
          transcript: this.transcript,
          gradeLevel,
          numTerms
        })
      });

      if (!response.ok) {
        throw new Error(`Vocabulary generation failed: ${response.statusText}`);
      }

      const vocabularyData = await response.json();
      console.log('✅ Vocabulary list generated successfully');

      return this.formatVocabulary(vocabularyData);

    } catch (error) {
      console.error('❌ Vocabulary generation error:', error);
      throw error;
    }
  }

  /**
   * Format vocabulary data as markdown
   */
  formatVocabulary(data) {
    if (!data.vocabulary || data.vocabulary.length === 0) {
      return {
        raw: data,
        markdown: '# Vocabulary List\n\nNo vocabulary terms could be generated from this video.',
        plainText: 'No vocabulary terms generated.'
      };
    }

    let markdown = `# 📚 Vocabulary List: ${this.videoTitle}\n\n`;
    markdown += `**Grade Level:** ${data.gradeLevel || 'Not specified'}\n`;
    markdown += `**Total Terms:** ${data.totalTerms || data.vocabulary.length}\n\n`;
    markdown += `---\n\n`;

    // Generate vocabulary cards
    data.vocabulary.forEach((term, index) => {
      markdown += `## ${index + 1}. ${term.term}\n\n`;
      
      // Part of speech
      if (term.partOfSpeech) {
        markdown += `**Part of Speech:** *${term.partOfSpeech}*\n\n`;
      }

      // Definition
      markdown += `**Definition:** ${term.definition}\n\n`;

      // Context from video
      if (term.contextFromVideo) {
        markdown += `**In This Video:** ${term.contextFromVideo}\n\n`;
      }

      // Example sentence
      if (term.exampleSentence) {
        markdown += `**Example:** "${term.exampleSentence}"\n\n`;
      }

      // Word forms
      if (term.wordForms && term.wordForms.length > 0) {
        markdown += `**Related Forms:** ${term.wordForms.join(', ')}\n\n`;
      }

      // Synonyms
      if (term.synonyms && term.synonyms.length > 0) {
        markdown += `**Synonyms:** ${term.synonyms.join(', ')}\n\n`;
      }

      // Memory tip
      if (term.memoryTip) {
        markdown += `💡 **Memory Tip:** ${term.memoryTip}\n\n`;
      }

      markdown += `---\n\n`;
    });

    // Flashcard section
    markdown += `## 📇 Quick Flashcard Format\n\n`;
    markdown += `Copy and paste into Anki, Quizlet, or print as flashcards:\n\n`;
    
    data.vocabulary.forEach(term => {
      markdown += `**Front:** ${term.term}\n`;
      markdown += `**Back:** ${term.definition}\n\n`;
    });

    markdown += `---\n\n`;
    markdown += `*Generated from: [${this.videoTitle}](https://www.youtube.com/watch?v=${this.videoId})*\n`;

    return {
      raw: data,
      markdown,
      plainText: this.markdownToPlainText(markdown)
    };
  }

  /**
   * Generate Guided Notes from video
   * Creates structured note-taking templates in multiple formats
   */
  async generateGuidedNotes(options = {}) {
    const {
      noteStyle = 'cornell', // cornell, outline, fillinblank, guided
      gradeLevel = 'middle school'
    } = options;

    console.log('📝 Generating guided notes from video...', {
      videoTitle: this.videoTitle,
      noteStyle,
      gradeLevel
    });

    try {
      const response = await fetch('/api/video-guided-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoData: this.videoData,
          transcript: this.transcript,
          noteStyle,
          gradeLevel
        })
      });

      if (!response.ok) {
        throw new Error(`Guided notes generation failed: ${response.statusText}`);
      }

      const guidedNotesData = await response.json();
      console.log('✅ Guided notes generated successfully');
      console.log('📊 API Response data:', guidedNotesData);
      console.log('📊 Has sections?', !!guidedNotesData.sections);
      console.log('📊 Has summary?', !!guidedNotesData.summary);
      console.log('📊 Full response structure:', Object.keys(guidedNotesData));
      
      if (guidedNotesData.sections) {
        console.log('📊 Sections array length:', guidedNotesData.sections.length);
        console.log('📊 First section:', guidedNotesData.sections[0]);
      }

      return this.formatGuidedNotes(guidedNotesData);

    } catch (error) {
      console.error('❌ Guided notes generation error:', error);
      throw error;
    }
  }

  /**
   * Format guided notes data as markdown
   */
  formatGuidedNotes(data) {
    const styleFormatters = {
      cornell: this.formatCornellNotes.bind(this),
      outline: this.formatOutlineNotes.bind(this),
      fillinblank: this.formatFillInBlankNotes.bind(this),
      guided: this.formatGuidedQuestions.bind(this)
    };

    const formatter = styleFormatters[data.noteStyle] || styleFormatters.cornell;
    return formatter(data);
  }

  /**
   * Format Cornell Notes
   */
  formatCornellNotes(data) {
    if (!data.sections || data.sections.length === 0) {
      return {
        raw: data,
        markdown: '# Cornell Notes\n\nNo notes could be generated from this video.',
        plainText: 'No notes generated.'
      };
    }

    let markdown = `# 📔 Cornell Notes: ${this.videoTitle}\n\n`;
    markdown += `**Grade Level:** ${data.gradeLevel || 'Not specified'}\n\n`;
    markdown += `---\n\n`;

    // Cornell notes sections
    data.sections.forEach((section, index) => {
      markdown += `## ${section.topic}\n`;
      if (section.timestamp) {
        markdown += `**⏱️ Timestamp:** ${section.timestamp}\n`;
      }
      markdown += `\n`;

      // Two-column layout (simulated in markdown)
      markdown += `| Questions | Notes |\n`;
      markdown += `|-----------|-------|\n`;

      const maxRows = Math.max(
        section.questions?.length || 0,
        section.notes?.length || 0
      );

      for (let i = 0; i < maxRows; i++) {
        const question = section.questions?.[i] || '';
        const note = section.notes?.[i] || '';
        markdown += `| ${question} | ${note} |\n`;
      }

      markdown += `\n`;

      // Key terms
      if (section.keyTerms && section.keyTerms.length > 0) {
        markdown += `**Key Terms:** ${section.keyTerms.join(', ')}\n\n`;
      }

      markdown += `---\n\n`;
    });

    // Overall summary at bottom
    if (data.summary) {
      markdown += `## 📝 Summary\n\n`;
      markdown += `${data.summary}\n\n`;
      markdown += `---\n\n`;
    }

    markdown += `*Generated from: [${this.videoTitle}](https://www.youtube.com/watch?v=${this.videoId})*\n`;

    return {
      raw: data,
      markdown,
      plainText: this.markdownToPlainText(markdown)
    };
  }

  /**
   * Format Outline Notes
   */
  formatOutlineNotes(data) {
    if (!data.outline || data.outline.length === 0) {
      return {
        raw: data,
        markdown: '# Outline Notes\n\nNo outline could be generated from this video.',
        plainText: 'No outline generated.'
      };
    }

    let markdown = `# 📋 Outline: ${data.title || this.videoTitle}\n\n`;
    markdown += `**Grade Level:** ${data.gradeLevel || 'Not specified'}\n\n`;
    markdown += `---\n\n`;

    // Recursive function to format outline
    const formatOutlineLevel = (items, indent = 0) => {
      items.forEach(item => {
        const indentStr = '  '.repeat(indent);
        markdown += `${indentStr}${item.marker}. ${item.text}`;
        if (item.timestamp) {
          markdown += ` *(${item.timestamp})*`;
        }
        markdown += `\n`;

        if (item.children && item.children.length > 0) {
          formatOutlineLevel(item.children, indent + 1);
        }
      });
    };

    formatOutlineLevel(data.outline);

    markdown += `\n---\n\n`;
    markdown += `*Generated from: [${this.videoTitle}](https://www.youtube.com/watch?v=${this.videoId})*\n`;

    return {
      raw: data,
      markdown,
      plainText: this.markdownToPlainText(markdown)
    };
  }

  /**
   * Format Fill-in-the-Blank Notes
   */
  formatFillInBlankNotes(data) {
    if (!data.sections || data.sections.length === 0) {
      return {
        raw: data,
        markdown: '# Fill-in-the-Blank Worksheet\n\nNo worksheet could be generated from this video.',
        plainText: 'No worksheet generated.'
      };
    }

    let markdown = `# ✏️ Fill-in-the-Blank: ${this.videoTitle}\n\n`;
    markdown += `**Grade Level:** ${data.gradeLevel || 'Not specified'}\n\n`;
    markdown += `**Instructions:** ${data.instructions || 'Fill in the blanks using the word bank below.'}\n\n`;
    markdown += `---\n\n`;

    // Sections with fill-in-the-blank sentences
    data.sections.forEach((section, index) => {
      markdown += `## ${section.topic}\n`;
      if (section.timestamp) {
        markdown += `**⏱️ Timestamp:** ${section.timestamp}\n`;
      }
      markdown += `\n`;

      section.sentences?.forEach((sentence, i) => {
        markdown += `${i + 1}. ${sentence}\n\n`;
      });

      markdown += `---\n\n`;
    });

    // Word bank
    if (data.wordBank && data.wordBank.length > 0) {
      markdown += `## 📦 Word Bank\n\n`;
      markdown += `${data.wordBank.join(' • ')}\n\n`;
      markdown += `---\n\n`;
    }

    // Answer key (hidden at end)
    if (data.answerKey && data.answerKey.length > 0) {
      markdown += `## 🔑 Answer Key\n\n`;
      data.answerKey.forEach((answer, i) => {
        markdown += `${i + 1}. ${answer}\n`;
      });
      markdown += `\n---\n\n`;
    }

    markdown += `*Generated from: [${this.videoTitle}](https://www.youtube.com/watch?v=${this.videoId})*\n`;

    return {
      raw: data,
      markdown,
      plainText: this.markdownToPlainText(markdown)
    };
  }

  /**
   * Format Guided Questions Notes
   */
  formatGuidedQuestions(data) {
    if (!data.sections || data.sections.length === 0) {
      return {
        raw: data,
        markdown: '# Guided Questions\n\nNo guided questions could be generated from this video.',
        plainText: 'No questions generated.'
      };
    }

    let markdown = `# 🎯 Guided Questions: ${this.videoTitle}\n\n`;
    markdown += `**Grade Level:** ${data.gradeLevel || 'Not specified'}\n\n`;
    markdown += `---\n\n`;

    // Sections with content blocks and questions
    data.sections.forEach((section, index) => {
      markdown += `## ${section.topic}\n`;
      if (section.timestamp) {
        markdown += `**⏱️ Timestamp:** ${section.timestamp}\n`;
      }
      markdown += `\n`;

      section.contentBlocks?.forEach(block => {
        if (block.type === 'content') {
          markdown += `${block.text}\n\n`;
        } else if (block.type === 'question') {
          markdown += `**❓ ${block.text}**\n\n`;
          markdown += `_[Write your answer here]_\n\n`;
        }
      });

      markdown += `---\n\n`;
    });

    markdown += `*Generated from: [${this.videoTitle}](https://www.youtube.com/watch?v=${this.videoId})*\n`;

    return {
      raw: data,
      markdown,
      plainText: this.markdownToPlainText(markdown)
    };
  }

  /**
   * Generate Graphic Organizer from video
   * Creates visual learning tools like concept maps, timelines, Venn diagrams
   */
  async generateGraphicOrganizer(options = {}) {
    const {
      organizerType = 'Concept Map', // Concept Map, Timeline, Venn Diagram, Cause and Effect, KWL Chart, Mind Map
      gradeLevel = 'middle school'
    } = options;

    console.log('🎨 Generating graphic organizer from video...', {
      videoTitle: this.videoTitle,
      organizerType,
      gradeLevel
    });

    try {
      const response = await fetch('/api/video-graphic-organizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoData: this.videoData,
          transcript: this.transcript,
          organizerType,
          gradeLevel
        })
      });

      if (!response.ok) {
        throw new Error(`Graphic organizer generation failed: ${response.statusText}`);
      }

      const organizerData = await response.json();
      console.log('✅ Graphic organizer generated successfully');
      
      return this.formatGraphicOrganizer(organizerData);

    } catch (error) {
      console.error('❌ Graphic organizer generation error:', error);
      throw error;
    }
  }

  /**
   * Format graphic organizer data as markdown with visual rendering
   */
  formatGraphicOrganizer(data) {
    let markdown = `# 🎨 ${data.type}: ${this.videoTitle}\n\n`;
    markdown += `**Organizer Type:** ${data.type}\n`;
    markdown += `**Video:** [${this.videoTitle}](https://www.youtube.com/watch?v=${this.videoId})\n\n`;
    
    if (data.description) {
      markdown += `## How to Use\n\n${data.description}\n\n`;
    }

    markdown += `---\n\n`;

    // 🎨 NEW: Create container for rendered diagram
    const containerId = 'diagram-' + Date.now();
    const diagramType = data.type.toLowerCase().replace(/\s+/g, '-');
    markdown += `<div id="${containerId}" class="diagram-container ${diagramType}-diagram" style="min-height: 400px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid rgba(255, 255, 255, 0.05);">
  <div style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.5);">
    <div style="display: inline-block; border: 3px solid rgba(97, 218, 251, 0.3); border-top-color: #61dafb; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
    <p style="margin-top: 15px;">Rendering diagram...</p>
  </div>
</div>\n\n`;

    // 🎨 NEW: Render diagram after DOM insertion
    setTimeout(async () => {
      const container = document.getElementById(containerId);
      if (!container || typeof DiagramRenderers === 'undefined') {
        console.warn('Container or DiagramRenderers not found for', data.type);
        if (container) {
          container.innerHTML = '<div style="padding: 20px; color: #ffd93d;">⚠️ Diagram rendering library not loaded. Showing text representation below.</div>';
        }
        return;
      }

      try {
        console.log('🎨 Rendering diagram:', data.type, data);
        
        switch (data.type) {
          case 'Venn Diagram':
            await DiagramRenderers.renderVennDiagram(container, data);
            break;
            
          case 'Timeline':
            await DiagramRenderers.renderTimeline(container, data);
            break;
            
          case 'Concept Map':
            await DiagramRenderers.renderConceptMap(container, data);
            break;
            
          case 'Mind Map':
            await DiagramRenderers.renderMindMap(container, data);
            break;
            
          case 'KWL Chart':
            await DiagramRenderers.renderKWLChart(container, data);
            break;
            
          case 'Cause and Effect':
            // Render Mermaid diagram
            if (data.mermaid) {
              await DiagramRenderers.renderMermaidDiagram(container, data.mermaid);
            } else {
              throw new Error('No Mermaid code provided for Cause and Effect diagram');
            }
            break;
            
          default:
            console.warn('Unknown diagram type:', data.type);
            DiagramRenderers.renderTextFallback(container, data);
        }
        
      } catch (error) {
        console.error('❌ Diagram rendering error:', error);
        container.innerHTML = `
          <div style="padding: 20px; color: #ff6b6b; background: rgba(255, 107, 107, 0.1); border-radius: 8px; border: 1px solid #ff6b6b;">
            <strong>⚠️ Diagram Rendering Error</strong><br>
            ${error.message}<br><br>
            <small>See browser console for details. Text representation shown below.</small>
          </div>
        `;
      }
    }, 100);

    // Still include structured content below for accessibility and text fallback
    markdown += `## Content\n\n`;
    
    if (data.structure) {
      markdown += this.formatOrganizerStructure(data.type, data.structure);
    }

    markdown += `\n---\n\n`;
    markdown += `*Generated from: [${this.videoTitle}](https://www.youtube.com/watch?v=${this.videoId})*\n`;

    return {
      raw: data,
      markdown,
      plainText: this.markdownToPlainText(markdown)
    };
  }

  /**
   * Format organizer structure based on type
   */
  formatOrganizerStructure(type, structure) {
    let markdown = '';

    switch (type) {
      case 'Concept Map':
        if (structure.centralConcept) {
          markdown += `### Central Concept\n**${structure.centralConcept}**\n\n`;
        }
        if (structure.concepts && structure.concepts.length > 0) {
          markdown += `### Related Concepts\n`;
          structure.concepts.forEach(concept => {
            markdown += `- **${concept.name}**`;
            if (concept.relationship) {
              markdown += ` (${concept.relationship})`;
            }
            markdown += `\n`;
            if (concept.details && concept.details.length > 0) {
              concept.details.forEach(detail => {
                markdown += `  - ${detail}\n`;
              });
            }
          });
        }
        break;

      case 'Timeline':
        if (structure.events && structure.events.length > 0) {
          structure.events.forEach(event => {
            markdown += `### ${event.timestamp || event.date}\n`;
            markdown += `${event.description}\n\n`;
          });
        }
        break;

      case 'Venn Diagram':
        if (structure.circles && structure.circles.length > 0) {
          structure.circles.forEach(circle => {
            markdown += `### ${circle.label}\n`;
            if (circle.items && circle.items.length > 0) {
              circle.items.forEach(item => markdown += `- ${item}\n`);
            }
            markdown += `\n`;
          });
          if (structure.overlap) {
            markdown += `### Shared Characteristics\n`;
            structure.overlap.forEach(item => markdown += `- ${item}\n`);
            markdown += `\n`;
          }
        }
        break;

      case 'Cause and Effect':
        if (structure.relationships && structure.relationships.length > 0) {
          structure.relationships.forEach(rel => {
            markdown += `### ${rel.cause}\n`;
            markdown += `**→ Effect:** ${rel.effect}\n\n`;
          });
        }
        break;

      case 'KWL Chart':
        if (structure.know) {
          markdown += `### K - What We Know\n`;
          structure.know.forEach(item => markdown += `- ${item}\n`);
          markdown += `\n`;
        }
        if (structure.want) {
          markdown += `### W - What We Want to Know\n`;
          structure.want.forEach(item => markdown += `- ${item}\n`);
          markdown += `\n`;
        }
        if (structure.learned) {
          markdown += `### L - What We Learned\n`;
          structure.learned.forEach(item => markdown += `- ${item}\n`);
          markdown += `\n`;
        }
        break;

      case 'Mind Map':
        if (structure.centralTopic) {
          markdown += `### Central Topic\n**${structure.centralTopic}**\n\n`;
        }
        if (structure.branches && structure.branches.length > 0) {
          structure.branches.forEach(branch => {
            markdown += `### ${branch.topic}\n`;
            if (branch.subtopics && branch.subtopics.length > 0) {
              branch.subtopics.forEach(sub => markdown += `- ${sub}\n`);
            }
            markdown += `\n`;
          });
        }
        break;

      default:
        // Generic structure formatting
        markdown += JSON.stringify(structure, null, 2);
    }

    return markdown;
  }

  /**
   * Utility: Convert markdown to plain text
   */
  markdownToPlainText(markdown) {
    return markdown
      .replace(/#{1,6} /g, '')  // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
      .replace(/\*(.*?)\*/g, '$1')  // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')  // Remove links
      .replace(/`(.*?)`/g, '$1')  // Remove code
      .replace(/---+/g, '')  // Remove horizontal rules
      .trim();
  }
}

// Export for use in video UI
window.VideoContentTools = VideoContentTools;
