# Phase 8-15: Content Creation Tools Roadmap

**Date**: December 16, 2025  
**Goal**: Build comprehensive content creation system, culminating in Chrome extension  
**Timeline**: 3-4 months (Jan - Apr 2026)

---

## 🎯 The Master Plan

**Phase 8 (Weeks 2-4)**: Video Creation Tools (Option A)  
**Phase 9 (Weeks 1-2)**: Universal Content Creation Tools (Option B)  
**Phase 10 (Weeks 3-4)**: Google Docs Live Integration (Option C)  
**Phase 11-14**: Advanced Features & Polish  
**Phase 15**: Chrome Extension (Package everything into browser extension)

---

## ✅ Phase 8 Day 1-3: Video Intelligence Foundation (COMPLETE)

**Status**: ✅ COMPLETE (Dec 16, 2025)

**What We Built**:
- YouTube search integration
- Transcript fetching with timestamps
- 4-level summaries (TLDR, Abstract, Detailed, Key Moments)
- Multi-agent analysis (4 personas)
- Side-by-side video player layout (95vw × 95vh)
- Export to Markdown, clipboard, SRT

**Files Created**:
- `youtube-api.js`, `transcript-fetcher.js`, `video-analyzer.js`
- `video-ui.js` (1246 lines)
- `netlify/functions/youtube-search.cjs`
- `netlify/functions/youtube-transcript.cjs`
- `netlify/functions/video-analyze.cjs`

---

## 🚀 Phase 8 Week 2: Video Creation Tools (Option A)

**Timeline**: Dec 17-24, 2025 (1 week)  
**Goal**: Generate educational content FROM YouTube videos

### Tools to Build:

#### 1. **Quiz Maker from Video** (Day 1-2)
**What it does**: Generate comprehensive quiz from any YouTube video

**Features**:
- Multiple choice questions (5-10)
  * 4 answer options
  * Correct answer marked
  * Explanation for each answer
- Short answer questions (3-5)
  * Open-ended prompts
  * Sample answer provided
  * Grading rubric
- True/False questions (5)
- Fill-in-the-blank (5)
- Timestamp references (which part of video)
- Difficulty levels (easy, medium, hard)
- Answer key with explanations

**Prompt Strategy**:
```javascript
// Multi-agent quiz generation
const quizPrompt = `
You are generating an educational quiz from this video transcript.

VIDEO: ${videoTitle}
TRANSCRIPT: ${transcript}

Create a comprehensive quiz with:
1. 5 multiple choice questions (4 options each, mark correct answer)
2. 3 short answer questions (provide sample answers)
3. 5 true/false questions
4. 5 fill-in-the-blank questions

For each question:
- Reference the timestamp in the video
- Vary difficulty (easy, medium, hard)
- Explain why the correct answer is correct
- Address common misconceptions

Format as structured JSON.
`;
```

**UI Location**: New "Create" tab in Video Intelligence modal

**Export Options**:
- Google Forms (future Phase 10)
- Google Doc (formatted quiz)
- Markdown
- JSON (for programmatic use)

---

#### 2. **Lesson Plan from Video** (Day 2-3)
**What it does**: Generate complete lesson plan using video as core content

**Features**:
- **Learning Objectives** (3-5)
  * Aligned to Bloom's Taxonomy
  * Measurable outcomes
  * Grade-appropriate
- **Materials Needed**
  * Video URL and duration
  * Handouts/worksheets
  * Additional resources
- **Pre-Video Activities** (10-15 min)
  * Anticipation guide
  * Vocabulary preview
  * KWL chart (Know, Want, Learn)
- **During-Video Activities** (video duration)
  * Guided notes template
  * Pause points with discussion questions
  * Note-taking strategies
- **Post-Video Activities** (15-20 min)
  * Discussion questions
  * Group activities
  * Writing prompts
  * Extension activities
- **Assessment**
  * Exit ticket
  * Formative assessment
  * Homework assignment
- **Differentiation**
  * For struggling learners
  * For advanced learners
  * For ELL students
- **Standards Alignment** (future)
  * Common Core
  * State standards
  * NGSS (science)

**Multi-Agent Approach**:
- **Master Teacher**: Pedagogical best practices
- **Classical Educator**: Trivium integration (grammar, logic, rhetoric)
- **Strategist**: Lesson flow and pacing
- **UX Designer**: Student engagement strategies

**Template Sections**:
```markdown
# Lesson Plan: [Video Title]

## Grade Level: [X-Y]
## Duration: [X] minutes
## Subject: [Subject]

## Learning Objectives
1. Students will be able to...
2. Students will understand...
3. Students will analyze...

## Materials
- Video: [URL] ([Duration])
- Handouts: [List]
- Technology: [Requirements]

## Lesson Sequence

### Opening (10 min)
[Hook/Anticipation guide]

### Video Viewing (X min)
[Guided viewing with pause points]

### Discussion (15 min)
[Key questions and activities]

### Assessment (10 min)
[Exit ticket or formative assessment]

## Differentiation
- **Struggling Learners**: [Strategies]
- **Advanced Learners**: [Extensions]
- **ELL Students**: [Supports]

## Homework/Extension
[Assignment description]
```

---

#### 3. **Discussion Questions Generator** (Day 3)
**What it does**: Create thought-provoking questions for classroom discussion

**Question Types**:
1. **Recall Questions** (3-5)
   - What did the video say about...?
   - Who was mentioned...?
   - When did...?

2. **Comprehension Questions** (3-5)
   - Explain in your own words...
   - What is the main idea...?
   - Summarize the key points...

3. **Application Questions** (3-5)
   - How could you use this in...?
   - What would happen if...?
   - Can you think of an example...?

4. **Analysis Questions** (3-5)
   - Why do you think...?
   - What is the relationship between...?
   - What evidence supports...?

5. **Synthesis Questions** (3-5)
   - How would you combine...?
   - What if you designed...?
   - Can you propose...?

6. **Evaluation Questions** (3-5)
   - Do you agree with...?
   - What is your opinion...?
   - How would you judge...?

**Features**:
- Bloom's Taxonomy levels
- Socratic questioning techniques
- Think-Pair-Share format
- Small group vs whole class
- Debate-worthy topics
- "No right answer" questions
- Follow-up questions

---

#### 4. **Guided Notes Generator** (Day 4)
**What it does**: Create structured note-taking worksheet for students

**Format Options**:
1. **Cornell Notes**
   - Cues column
   - Notes column
   - Summary section

2. **Outline Format**
   - Main topics (I, II, III)
   - Subtopics (A, B, C)
   - Details (1, 2, 3)

3. **Fill-in-the-Blank**
   - Sentences with key terms removed
   - Word bank provided
   - Organized by video sections

4. **Graphic Organizer**
   - Concept map
   - Timeline (for history)
   - Cause/Effect chart
   - Compare/Contrast matrix

**Features**:
- Matches video structure (timestamps)
- Space for student additions
- Key vocabulary highlighted
- Visual cues (boxes, arrows)
- Summary section at end

---

#### 5. **Vocabulary Builder** (Day 5)
**What it does**: Extract and define key terms from video

**Features**:
- 10-20 key terms from video
- Clear definitions (grade-appropriate)
- Example sentences
- Related terms
- Etymology (for advanced)
- Visual associations
- Usage in video context (timestamp)

**Formats**:
- **Flashcards** (one term per card)
- **Vocabulary list** (definitions)
- **Word wall** (printable posters)
- **Matching activity** (term to definition)
- **Crossword puzzle** (future)

---

#### 6. **Graphic Organizer Generator** (Day 6-7)
**What it does**: Create visual learning aids from video content

**Organizer Types**:

1. **Concept Map**
   ```
   [Main Concept]
        ↓
   ┌────┴────┬────────┐
   [Sub 1]  [Sub 2]  [Sub 3]
      ↓        ↓        ↓
   [Detail] [Detail] [Detail]
   ```

2. **Timeline** (for history/sequence)
   ```
   Event 1 ──→ Event 2 ──→ Event 3 ──→ Event 4
   [Date]      [Date]      [Date]      [Date]
   ```

3. **Venn Diagram** (compare/contrast)
   ```
       ┌────────────┐
       │  Topic A   │
       │    ┌───────┼────────┐
       └────┼───────┘        │
            │   Both         │ Topic B
            └────────────────┘
   ```

4. **Cause & Effect**
   ```
   Cause 1 ─┐
   Cause 2 ─┼──→ [EFFECT]
   Cause 3 ─┘
   ```

5. **Flowchart** (processes)
   ```
   [Start] → [Step 1] → [Decision?] ┬→ Yes → [Step 2]
                           ↓         │
                           No ←──────┘
   ```

6. **T-Chart** (pros/cons, before/after)
   ```
   ┌──────────┬──────────┐
   │   Pros   │   Cons   │
   ├──────────┼──────────┤
   │ Item 1   │ Item 1   │
   │ Item 2   │ Item 2   │
   └──────────┴──────────┘
   ```

**Implementation**:
- Use **Mermaid.js** for diagrams (text-based, renders beautifully)
- AI determines best organizer type for content
- User can override and select specific type
- Export to SVG, PNG, or Markdown

---

### Implementation Plan (Week 2)

#### File Structure:
```
video-content-tools.js          # New module (400+ lines)
├── QuizGenerator
├── LessonPlanGenerator  
├── DiscussionQuestionsGenerator
├── GuidedNotesGenerator
├── VocabularyBuilder
├── GraphicOrganizerGenerator

netlify/functions/
├── video-quiz.cjs              # Quiz generation endpoint
├── video-lesson-plan.cjs       # Lesson plan endpoint
├── video-discussion.cjs        # Discussion questions endpoint
├── video-notes.cjs             # Guided notes endpoint
├── video-vocabulary.cjs        # Vocabulary endpoint
├── video-organizer.cjs         # Graphic organizer endpoint
```

#### UI Changes:
Add new **"Create"** tab to Video Intelligence modal:
```html
<div class="tab-row">
  <button data-tab="transcript">Transcript</button>
  <button data-tab="summary">Summary</button>
  <button data-tab="analysis">Analysis</button>
  <button data-tab="stats">Stats</button>
  <button data-tab="search">Search</button>
  <button data-tab="create">🎨 Create</button> <!-- NEW -->
</div>

<div id="create-tab" class="tab-content">
  <div class="tools-grid">
    <button class="tool-card" onclick="generateQuiz()">
      <div class="tool-icon">📝</div>
      <div class="tool-name">Quiz</div>
      <div class="tool-desc">Multiple choice, short answer, T/F</div>
    </button>
    
    <button class="tool-card" onclick="generateLessonPlan()">
      <div class="tool-icon">📚</div>
      <div class="tool-name">Lesson Plan</div>
      <div class="tool-desc">Complete lesson with activities</div>
    </button>
    
    <button class="tool-card" onclick="generateDiscussion()">
      <div class="tool-icon">💬</div>
      <div class="tool-name">Discussion Questions</div>
      <div class="tool-desc">Socratic, Bloom's taxonomy</div>
    </button>
    
    <button class="tool-card" onclick="generateNotes()">
      <div class="tool-icon">📋</div>
      <div class="tool-name">Guided Notes</div>
      <div class="tool-desc">Cornell, outline, fill-in-blank</div>
    </button>
    
    <button class="tool-card" onclick="generateVocabulary()">
      <div class="tool-icon">📖</div>
      <div class="tool-name">Vocabulary</div>
      <div class="tool-desc">Key terms with definitions</div>
    </button>
    
    <button class="tool-card" onclick="generateOrganizer()">
      <div class="tool-icon">🗺️</div>
      <div class="tool-name">Graphic Organizer</div>
      <div class="tool-desc">Concept maps, timelines, charts</div>
    </button>
  </div>
  
  <div id="tool-output" style="display: none;">
    <!-- Generated content appears here -->
  </div>
</div>
```

#### Styling:
```css
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;
}

.tool-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(97, 218, 251, 0.2);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-card:hover {
  background: rgba(97, 218, 251, 0.1);
  border-color: #61dafb;
  transform: translateY(-2px);
}

.tool-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.tool-name {
  font-size: 18px;
  font-weight: bold;
  color: #61dafb;
  margin-bottom: 8px;
}

.tool-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}
```

---

### **Phase 8 Week 2 Deliverable**:
✅ 6 video content creation tools working  
✅ Create tab in Video Intelligence modal  
✅ Export to Markdown for all tools  
✅ Multi-agent generation for quality  
✅ Professional UI with tool cards  

---

## 🎨 Phase 9: Universal Content Creation Tools (Option B)

**Timeline**: Dec 25 - Jan 7, 2026 (2 weeks)  
**Goal**: Tools that work with ANY content source (not just videos)

### Context-Aware Content Detection:

**Input Sources**:
1. **Current YouTube video** (if on Video tab)
2. **Research results** (if on Research tab)
3. **Manual text input** (paste any content)
4. **URL input** (fetch and analyze webpage)
5. **File upload** (PDF, DOCX - future)
6. **Custom topic** (AI generates from scratch)

### Universal Tools (Work with ANY source):

#### 1. **Universal Quiz Maker** (Day 1-2)
- Accepts: Video transcript, article text, research results, custom topic
- Same quiz types as video version
- Context detection: "Creating quiz from [source]"

#### 2. **Universal Lesson Plan Generator** (Day 3-4)
- From video: Uses transcript
- From article: Uses extracted content
- From topic: AI generates curriculum
- Customization: Grade level, duration, subject

#### 3. **Unit Plan Generator** (Day 5-6)
- Multi-day lesson sequence (5-10 days)
- Builds on single lesson plan
- Progressive learning objectives
- Includes assessments, activities, homework

#### 4. **Rubric Generator** (Day 7-8)
- For any assignment type
- Criteria-based grading
- Point scales (10, 20, 50, 100 points)
- Descriptors for each level

#### 5. **Assessment Builder** (Day 9-10)
- Comprehensive test/exam
- Multiple sections (MC, SA, Essay, Problem-solving)
- Aligned to objectives
- Answer key with point values

#### 6. **Standards Unpacker** (Day 11-12)
- Input: Common Core standard code
- Output: Learning targets, key concepts, example activities
- Progressive difficulty levels

### Implementation:

**New Module**: `universal-tools.js`
```javascript
class UniversalToolGenerator {
  constructor(contentSource) {
    this.source = contentSource; // video, article, topic, etc.
    this.content = null;
  }
  
  async extractContent() {
    switch(this.source.type) {
      case 'video':
        this.content = await this.getVideoTranscript();
        break;
      case 'article':
        this.content = await this.extractArticleContent();
        break;
      case 'research':
        this.content = this.source.researchResults;
        break;
      case 'topic':
        this.content = this.source.topicDescription;
        break;
    }
  }
  
  async generateQuiz(options) { /* ... */ }
  async generateLessonPlan(options) { /* ... */ }
  async generateUnitPlan(options) { /* ... */ }
  async generateRubric(options) { /* ... */ }
  async generateAssessment(options) { /* ... */ }
}
```

**UI Location**: New "Tools" button in main AI panel toolbar

### **Phase 9 Deliverable**:
✅ 6 universal content creation tools  
✅ Work with any content source  
✅ Smart context detection  
✅ Unified UI for all tools  
✅ Export to multiple formats  

---

## 📄 Phase 10: Google Docs Live Integration (Option C)

**Timeline**: Jan 8-21, 2026 (2 weeks)  
**Goal**: Generate content directly in Google Docs, watching it appear live

### Week 1: Google OAuth & Docs API

#### Day 1-2: OAuth Setup
- Create Google Cloud Project
- Enable Google Docs API + Drive API
- Configure OAuth 2.0 consent screen
- Create credentials (Client ID + Secret)
- Store in `.env.local`

#### Day 3-4: OAuth Flow
- Add "Sign in with Google" button
- Implement OAuth flow in UCAS
- Store access token in Supabase (per user)
- Token refresh logic
- Test authentication

#### Day 5-7: Google Docs API Wrapper
```javascript
// google-docs-api.js
class GoogleDocsAPI {
  constructor(accessToken) {
    this.token = accessToken;
    this.baseUrl = 'https://docs.googleapis.com/v1';
  }
  
  async createDocument(title) {
    // Create blank document
  }
  
  async insertText(docId, text, index) {
    // Insert text at position
  }
  
  async formatText(docId, range, format) {
    // Apply formatting (bold, heading, etc.)
  }
  
  async insertTable(docId, rows, cols, index) {
    // Insert table
  }
  
  async insertList(docId, items, index) {
    // Insert bulleted/numbered list
  }
}
```

### Week 2: Live Document Generation

#### Day 1-3: Streaming Generator
**The Magic**: Make text appear line-by-line in Google Doc

**Approach 1: Server-Sent Events (SSE)**
```javascript
// Backend: Stream content generation
app.get('/api/generate-lesson-plan-stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Generate lesson plan in chunks
  const chunks = await generateLessonPlanChunks(req.query);
  
  for (const chunk of chunks) {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 100)); // Delay for effect
  }
  
  res.write('data: [DONE]\n\n');
  res.end();
});

// Frontend: Receive chunks and insert into Google Doc
async function createLessonPlanInGoogleDocs(videoId, options) {
  // 1. Create blank Google Doc
  const docId = await googleDocs.createDocument(`Lesson Plan: ${videoTitle}`);
  
  // 2. Open Google Doc in new tab
  window.open(`https://docs.google.com/document/d/${docId}/edit`, '_blank');
  
  // 3. Stream content to doc
  const eventSource = new EventSource(`/api/generate-lesson-plan-stream?videoId=${videoId}`);
  let currentIndex = 1; // Start after title
  
  eventSource.onmessage = async (event) => {
    if (event.data === '[DONE]') {
      eventSource.close();
      return;
    }
    
    const chunk = JSON.parse(event.data);
    
    // Insert chunk into Google Doc
    await googleDocs.insertText(docId, chunk.text, currentIndex);
    
    // Apply formatting if needed
    if (chunk.format) {
      await googleDocs.formatText(docId, {
        start: currentIndex,
        end: currentIndex + chunk.text.length
      }, chunk.format);
    }
    
    currentIndex += chunk.text.length;
  };
}
```

**Approach 2: Progressive Batching**
```javascript
// Generate full content first, then insert progressively
async function createLessonPlanInGoogleDocs(videoId, options) {
  // 1. Generate full lesson plan
  showLoadingMessage('Generating lesson plan...');
  const lessonPlan = await generateLessonPlan(videoId, options);
  
  // 2. Create blank Google Doc
  const docId = await googleDocs.createDocument(`Lesson Plan: ${videoTitle}`);
  
  // 3. Open Google Doc
  window.open(`https://docs.google.com/document/d/${docId}/edit`, '_blank');
  
  // 4. Insert content progressively (paragraph by paragraph)
  showLoadingMessage('Writing to Google Docs...');
  const paragraphs = lessonPlan.split('\n\n');
  let index = 1;
  
  for (const paragraph of paragraphs) {
    await googleDocs.insertText(docId, paragraph + '\n\n', index);
    index += paragraph.length + 2;
    await new Promise(resolve => setTimeout(resolve, 200)); // Visual delay
  }
  
  showSuccessMessage('Lesson plan created in Google Docs!');
}
```

#### Day 4-5: Document Templates
```javascript
// doc-templates.js
class LessonPlanTemplate {
  async apply(docId, content) {
    let index = 1;
    
    // Title (Heading 1)
    await this.insertHeading(docId, content.title, 1, index);
    index += content.title.length + 1;
    
    // Metadata table
    await this.insertTable(docId, [
      ['Grade Level', content.gradeLevel],
      ['Duration', content.duration],
      ['Subject', content.subject]
    ], index);
    index += 100; // Approximate table size
    
    // Learning Objectives (Heading 2)
    await this.insertHeading(docId, 'Learning Objectives', 2, index);
    index += 22;
    
    // Numbered list of objectives
    await this.insertList(docId, content.objectives, 'ORDERED', index);
    index += content.objectives.join('').length + 10;
    
    // Materials (Heading 2)
    await this.insertHeading(docId, 'Materials', 2, index);
    index += 11;
    
    // Bulleted list of materials
    await this.insertList(docId, content.materials, 'BULLETED', index);
    index += content.materials.join('').length + 10;
    
    // Continue for all sections...
  }
}
```

#### Day 6-7: Testing & Polish
- Test with all content types (video, article, topic)
- Test with all tools (quiz, lesson plan, etc.)
- Error handling (API rate limits, auth failures)
- Loading states and progress indicators
- Success/error notifications

### UI Changes:

**Add "Create in Google Docs" button to each tool**:
```html
<div class="tool-output-header">
  <h3>Generated Lesson Plan</h3>
  <div class="export-buttons">
    <button onclick="copyToClipboard()">📋 Copy</button>
    <button onclick="exportMarkdown()">📄 Markdown</button>
    <button onclick="createInGoogleDocs()" class="primary-btn">
      📝 Create in Google Docs
    </button>
  </div>
</div>
```

**Google Docs button styling** (make it prominent):
```css
.primary-btn {
  background: #4285f4; /* Google blue */
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-btn:hover {
  background: #357ae8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}
```

### **Phase 10 Deliverable**:
✅ Google OAuth working  
✅ Google Docs API integrated  
✅ Live document creation (watch text appear)  
✅ All tools support Google Docs export  
✅ Beautiful templates for each tool type  
✅ Error handling and user feedback  

---

## 📊 Phase 11: Feedback Tools (2 weeks)

**Timeline**: Jan 22 - Feb 4, 2026

### Tools:
1. **Glow & Grow Feedback** - Strengths and growth areas
2. **Next Steps Feedback** - Actionable recommendations
3. **Rubric Criteria Feedback** - Aligned to rubric
4. **Targeted Feedback** - Specific suggestions
5. **Batch Feedback** - Multiple documents at once
6. **Feedback Insights** - Patterns across student work

**Integration**: Works with Google Docs (student assignments)

---

## 🌍 Phase 12: Text Leveling & Translation (1 week)

**Timeline**: Feb 5-11, 2026

### Tools:
1. **Reading Level Adjuster** - Rewrite for different grades
2. **Text Translator** - 50+ languages
3. **Combined** - Level + translate
4. **Multi-version Generator** - Create 3 versions at once

**Use Cases**: Differentiation, ELL support

---

## 📐 Phase 13: Standards Integration (2 weeks)

**Timeline**: Feb 12-25, 2026

### Features:
1. **Standards Database** - Common Core, NGSS, state standards
2. **Auto-tagging** - Generated content tagged with standards
3. **Standards Search** - Find by code or keyword
4. **Standards Unpacker** - Break down complex standards

**Critical for**: K-12 school adoption

---

## 🎨 Phase 14: Advanced Features & Polish (2 weeks)

**Timeline**: Feb 26 - Mar 11, 2026

### Features:
1. **Podcast Generator** - Text-to-speech audio
2. **State Practice Tests** - STAAR, SBAC, etc.
3. **SAT/ACT Prep** - Practice tests
4. **Custom Tool Creation** - User-defined tools
5. **Admin Dashboard** - For schools/districts

---

## 🔌 Phase 15: Chrome Extension (3-4 weeks)

**Timeline**: Mar 12 - Apr 9, 2026  
**Goal**: Package all UCAS features into browser extension

### What Changes:
- **Before**: Visit UCAS website, open AI panel
- **After**: Click extension icon on ANY webpage, access all tools

### Extension Features:
1. **Context Detection**
   - On YouTube → Show video tools
   - On article → Show content tools
   - On Google Doc → Show feedback tools
   - Anywhere → Show universal tools

2. **Floating Widget**
   - Bottom-right corner
   - Expandable sidebar
   - Full UCAS interface
   - Stays on current page

3. **One-Click Actions**
   - "Summarize this video"
   - "Create quiz from this article"
   - "Generate lesson plan"
   - "Create in Google Docs"

### Technical Approach:
- **Manifest V3** extension
- **Content script** injection (works on all pages)
- **Communication** with UCAS backend (existing APIs)
- **Same UI** as web app (reuse components)
- **OAuth** through extension

### Files to Create:
```
extension/
├── manifest.json          # Extension config
├── background.js          # Service worker
├── content-script.js      # Inject on pages
├── popup.html             # Extension popup
├── widget.html            # Floating widget
├── widget.js              # Widget logic
├── styles.css             # Extension styles
└── lib/
    ├── ucas-api.js        # Connect to backend
    ├── google-docs.js     # Docs integration
    └── context-detect.js  # Page type detection
```

### Publishing:
1. Chrome Web Store
2. Edge Add-ons
3. Firefox Add-ons (future)

---

## 🎯 Summary: Phase 8-15 Timeline

| Phase | Focus | Duration | Deliverable |
|-------|-------|----------|-------------|
| 8 (Week 2) | Video Creation Tools | 1 week | 6 tools (Quiz, Lesson Plan, etc.) |
| 9 | Universal Content Tools | 2 weeks | Tools work with ANY source |
| 10 | Google Docs Integration | 2 weeks | Live doc generation |
| 11 | Feedback Tools | 2 weeks | 6 feedback tools |
| 12 | Text Leveling & Translation | 1 week | Differentiation tools |
| 13 | Standards Integration | 2 weeks | K-12 standards database |
| 14 | Advanced Features | 2 weeks | Podcast, practice tests, admin |
| 15 | Chrome Extension | 3-4 weeks | Browser extension published |

**Total**: ~14-16 weeks (3.5-4 months)  
**Launch Date**: April 2026

---

## 📈 Growth Strategy

### Phase 8-10 (Jan):
- **Target**: Classical homeschool families
- **Marketing**: Blog posts, tutorials, demos
- **Goal**: 1,000 active users

### Phase 11-13 (Feb):
- **Target**: Classical Christian schools
- **Marketing**: School partnerships, teacher training
- **Goal**: 50 schools, 10,000 users

### Phase 14-15 (Mar-Apr):
- **Target**: K-12 schools (public/private)
- **Marketing**: Chrome Store, education conferences
- **Goal**: 100,000 extension installs

---

## ✅ Success Metrics

### Technical:
- All 30+ tools working
- Google Docs integration reliable
- Extension published to Chrome Store
- 4.5+ star rating
- < 100ms load time

### User Adoption:
- 100,000+ extension installs
- 10,000+ active daily users
- 500+ schools using
- 1,000+ testimonials

### Revenue (Optional):
- $50K MRR from hosted plans
- 100+ school/district contracts
- Profitable on operating costs

---

## 🚀 Let's Start Building!

**Next Step**: Implement Phase 8 Week 2 (Video Creation Tools)

Ready to begin? I'll start with the Quiz Maker from Video.
