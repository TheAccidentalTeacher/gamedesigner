# Phase 8: YouTube & Video Intelligence - Implementation Plan

**Status**: 🚀 Starting Implementation  
**Timeline**: 4 weeks (December 15, 2025 - January 12, 2026)  
**Goal**: Watch, understand, and teach from videos (Brisk-inspired)

---

## 📋 Overview

Transform YouTube videos into educational resources through multi-agent analysis. Extract transcripts, generate summaries, create graphic organizers, and produce assessments - all integrated with the existing research panel.

---

## 🎯 Success Criteria

- ✅ Summarize any YouTube video in < 60 seconds
- ✅ Generate timestamped highlights with key points
- ✅ Compare and synthesize multiple videos
- ✅ Create usable graphic organizers automatically
- ✅ Export to Google Docs/Word seamlessly

---

## 🗓️ Week 1: Video Processing Foundation (Dec 15-21)

### Day 1: API Integration & Metadata
**Goal**: Fetch video info and transcripts

**Tasks**:
- [ ] Research YouTube transcript APIs (youtube-transcript-api alternatives)
- [ ] Decide: Server-side (Node.js) vs client-side approach
- [ ] Create `youtube-api.js` module
  - Video metadata extraction (title, duration, channel, views)
  - Thumbnail URLs
  - Video ID parsing from URLs
- [ ] Create `transcript-fetcher.js` module
  - Fetch captions/transcripts
  - Handle auto-generated vs manual captions
  - Timestamp preservation
  - Language detection
- [ ] Error handling
  - Videos without transcripts
  - Age-restricted videos
  - Private/deleted videos

**Deliverable**: Can fetch any YouTube video's transcript with timestamps

**API Options**:
1. **YouTube Data API v3** (Google)
   - Pros: Official, reliable, video metadata
   - Cons: No transcript access, requires OAuth for some features
   - Cost: Free tier (10,000 units/day)

2. **youtube-transcript-api** (Python library)
   - Pros: Free, no API key needed
   - Cons: Requires Python backend or conversion to JS
   - Cost: Free

3. **getVideoTranscript** (browser extension approach)
   - Pros: No backend needed
   - Cons: May break with YouTube updates
   - Cost: Free

4. **Netlify Functions** (recommended)
   - Use Node.js port: `youtubei.js` or `youtube-transcript`
   - Deploy as serverless function
   - No Python needed

**Decision**: Use Netlify Functions with `youtubei.js` for both metadata and transcripts

---

### Day 2-3: UI Integration
**Goal**: Add video analysis panel to research modal

**Tasks**:
- [ ] Add "Video" tab to research panel (next to "Web" and "Agent")
- [ ] Create video input UI
  - URL input field with YouTube logo
  - "Analyze Video" button
  - Video preview (thumbnail + metadata)
- [ ] Create transcript viewer
  - Scrollable transcript with timestamps
  - Clickable timestamps (future: sync with video)
  - Search within transcript
  - Highlight key passages
- [ ] Loading states
  - "Fetching transcript..." progress indicator
  - Transcript word count and duration display
- [ ] Error UI
  - Friendly messages for common failures
  - Suggestion to check video URL
  - Link to test with example videos

**Deliverable**: UI for pasting YouTube URL and viewing transcript

---

### Day 4: Testing & Polish
**Goal**: Ensure reliability across video types

**Test Cases**:
- [ ] Standard video with auto-captions
- [ ] Video with manual captions
- [ ] Long video (2+ hours - lectures)
- [ ] Short video (<5 min - clips)
- [ ] Videos in different languages
- [ ] Videos without captions (error handling)
- [ ] Age-restricted videos (error handling)
- [ ] Invalid URLs (error handling)

**Deliverable**: Robust video transcript fetching working in production

---

## 🗓️ Week 2: Multi-Level Summarization (Dec 22-28)

### Day 5-6: Summary Generation
**Goal**: Create tiered summaries using multi-agent system

**Tasks**:
- [ ] Create `video-summarizer.js` module
- [ ] Implement 4-tier summarization:
  1. **TLDR** (1 sentence) - What's this video about?
  2. **Abstract** (1 paragraph) - Main ideas and conclusion
  3. **Detailed** (3-5 paragraphs) - Full summary with context
  4. **Timestamped** (timeline view) - Key moments with time codes
- [ ] Multi-agent prompt engineering
  - All 12 agents analyze transcript
  - Debate most important points
  - Cross-validate facts
  - Identify teaching opportunities
- [ ] Token optimization
  - For long videos (>1 hour), use intelligent sampling
  - Full transcript for key sections
  - Summary for filler content
  - Agents get representative excerpts

**Deliverable**: AI-generated summaries at multiple detail levels

---

### Day 7-8: Multi-Video Analysis
**Goal**: Compare and synthesize across multiple videos

**Tasks**:
- [ ] Add "Compare Videos" feature
  - Support 2-5 videos at once
  - Show all transcripts side-by-side
- [ ] Create `video-comparator.js` module
  - Find common themes across videos
  - Identify unique perspectives
  - Detect contradictions
  - Rank videos by quality/depth
- [ ] Synthesis engine
  - Combined summary across all videos
  - "What each video contributes" section
  - Recommended viewing order
  - Best source for each sub-topic

**Deliverable**: Can analyze multiple videos together intelligently

---

## 🗓️ Week 3: Educational Features (Dec 29 - Jan 4)

### Day 9-10: Graphic Organizer Generation
**Goal**: Auto-generate visual learning aids from video content

**Tasks**:
- [ ] Create `organizer-generator.js` module
- [ ] Implement organizer types:
  1. **Concept Map** - Main ideas and relationships
  2. **Timeline** - Chronological events
  3. **Compare/Contrast** - For multi-video analysis
  4. **Cause/Effect** - For historical/scientific content
  5. **Venn Diagram** - Overlapping concepts
  6. **Flowchart** - Process/sequence
- [ ] Use Mermaid.js for diagram generation
  - Text-based, easy to edit
  - Renders beautifully
  - Export to SVG/PNG
- [ ] AI determines best organizer type
  - Analyze content structure
  - Suggest 2-3 best formats
  - Generate all on demand

**Deliverable**: Auto-generated graphic organizers from video content

---

### Day 11-12: Assessment Creation
**Goal**: Generate quizzes, discussion prompts, assignments

**Tasks**:
- [ ] Create `assessment-creator.js` module
- [ ] Quiz generation
  - Multiple choice (4-10 questions)
  - True/False
  - Short answer prompts
  - Answers with explanations
  - Timestamp references
- [ ] Discussion prompts
  - 3-5 thought-provoking questions
  - Requires synthesis of video content
  - Open-ended, debate-worthy
- [ ] Writing assignments
  - Essay prompts based on video
  - Research extensions
  - Creative applications
- [ ] Difficulty levels
  - Elementary (grades 3-5)
  - Middle school (grades 6-8)
  - High school (grades 9-12)
  - College/Adult

**Deliverable**: Assessment tools generated from any video

---

## 🗓️ Week 4: Export & Polish (Jan 5-12)

### Day 13-14: Export Features
**Goal**: Get content out into teacher's workflow

**Tasks**:
- [ ] Create `video-exporter.js` module
- [ ] Export formats:
  1. **Markdown** - Formatted text with links
  2. **PDF** - Ready to print
  3. **Google Docs** - Direct export (if time allows)
  4. **Word** - .docx download
- [ ] Export packages:
  - "Complete Analysis" - All summaries + organizers + quiz
  - "Teacher Guide" - Lesson plan format
  - "Student Handout" - Simplified version
  - "Transcript Only" - Clean, formatted text
- [ ] Clipboard copy
  - One-click copy any section
  - Preserves formatting
  - Includes citations

**Deliverable**: Flexible export options for all generated content

---

### Day 15-16: Testing, Docs, Polish
**Goal**: Production-ready feature

**Tasks**:
- [ ] Comprehensive testing
  - Educational videos (Khan Academy, CrashCourse)
  - Historical documentaries
  - Science lectures
  - TED Talks
  - Classical education content
- [ ] Performance optimization
  - Parallel processing where possible
  - Caching for repeated videos
  - Progressive loading for long transcripts
- [ ] Documentation
  - Update CONTEXT_LOADER.md
  - Update CURRENT_STATUS.md
  - Update PROJECT_STATUS.md
  - Create user guide section in README
- [ ] UI polish
  - Smooth animations
  - Helpful tooltips
  - Keyboard shortcuts
  - Mobile responsive (if applicable)

**Deliverable**: Phase 8 complete and documented

---

## 🏗️ Technical Architecture

### New Files to Create

```
youtube-api.js (200 lines)
  - Video metadata extraction
  - URL parsing and validation
  - Error handling

transcript-fetcher.js (250 lines)
  - Transcript fetching via youtubei.js
  - Timestamp parsing
  - Language handling

video-summarizer.js (300 lines)
  - Multi-level summary generation
  - Multi-agent orchestration
  - Token optimization for long videos

video-comparator.js (200 lines)
  - Multi-video analysis
  - Theme extraction
  - Synthesis engine

organizer-generator.js (350 lines)
  - Mermaid diagram generation
  - Type detection (timeline vs concept map)
  - SVG/PNG export

assessment-creator.js (250 lines)
  - Quiz generation
  - Discussion prompts
  - Difficulty adjustment

video-exporter.js (200 lines)
  - Markdown/PDF export
  - Template system
  - Clipboard utilities

video-ui.js (400 lines)
  - Video tab in research panel
  - Transcript viewer
  - Results display
  - Export controls
```

**Total New Code**: ~2,150 lines

### Netlify Functions

```
netlify/functions/youtube-transcript.js
  - Serverless function for transcript fetching
  - Uses youtubei.js
  - No API keys required

netlify/functions/youtube-metadata.js
  - Video info fetching
  - Thumbnail URLs
  - Optional: Use YouTube Data API if needed
```

### Dependencies to Add

```json
{
  "dependencies": {
    "youtubei.js": "^5.0.0",           // YouTube scraping (no API key)
    "mermaid": "^10.0.0",               // Diagram generation
    "pdfkit": "^0.13.0",                // PDF export (optional)
    "marked": "^11.0.0"                 // Markdown processing
  }
}
```

---

## 💰 Cost Estimates

### API Costs (Monthly)
- **YouTube Data API**: Free tier (10,000 units/day, should be enough)
- **Transcript Fetching**: Free (using youtubei.js, no API key)
- **OpenAI (summarization)**: ~$10-15 extra (100 videos)
  - Each video: 2,000-10,000 tokens input
  - 500-1,000 tokens output
  - Using GPT-4 Turbo: ~$0.01-0.15 per video

**Total Added Cost**: ~$10-15/month for moderate use

### Development Time
- **Week 1**: 30 hours (video processing foundation)
- **Week 2**: 30 hours (summarization)
- **Week 3**: 30 hours (educational features)
- **Week 4**: 20 hours (export & polish)

**Total**: ~110 hours

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] Video URL parsing
- [ ] Transcript fetching (mock data)
- [ ] Summary generation (various lengths)
- [ ] Organizer type detection
- [ ] Export format validation

### Integration Tests
- [ ] End-to-end video analysis
- [ ] Multi-video comparison
- [ ] UI interactions
- [ ] Export downloads

### User Acceptance Tests
- [ ] Real videos from Khan Academy
- [ ] Classical Conversations content
- [ ] TED-Ed videos
- [ ] Long lectures (>1 hour)
- [ ] Non-English videos (if supported)

---

## 📝 Documentation Updates Required

After completion:
- [ ] Update CONTEXT_LOADER.md (Phase 8 → COMPLETE)
- [ ] Update CURRENT_STATUS.md (v2.0.0 → v2.1.0)
- [ ] Update PROJECT_STATUS.md (Phase 8 features list)
- [ ] Update README.md (add video intelligence features)
- [ ] Create VIDEO_INTELLIGENCE_GUIDE.md (user documentation)
- [ ] Git commit with comprehensive message

---

## 🎯 MVP Definition (Minimum Viable Product)

If time is constrained, ship with:
1. ✅ Single video transcript fetching
2. ✅ 4-tier summarization (TLDR to timestamped)
3. ✅ Multi-agent analysis
4. ✅ One organizer type (concept map)
5. ✅ Quiz generation (5 questions)
6. ✅ Markdown export

**Can defer to Phase 8.5**:
- Multi-video comparison (Week 2 Day 7-8)
- All 6 organizer types (Week 3 Day 9-10)
- Google Docs integration (Week 4 Day 13-14)
- Assessment difficulty levels (Week 3 Day 11-12)

---

## 🚀 Getting Started

**Right now**:
1. Install `youtubei.js`: `npm install youtubei.js`
2. Create Phase 8 feature branch: `git checkout -b phase-8-video-intelligence`
3. Start with `youtube-api.js` and test fetching video metadata
4. Build transcript fetcher next
5. Test with 5-10 different videos before moving to UI

**First commit**: Video metadata and transcript fetching working

---

## 🔗 Related Documentation

- [FUTURE_CAPABILITIES_ROADMAP.md](docs/FUTURE_CAPABILITIES_ROADMAP.md) - Original Phase 8 plan
- [CONTEXT_LOADER.md](docs/ai/CONTEXT_LOADER.md) - AI context for future sessions
- [CURRENT_STATUS.md](CURRENT_STATUS.md) - Live project status
- [PHASE_6_WEEK_7-8_COMPLETE.md](PHASE_6_WEEK_7-8_COMPLETE.md) - Previous research memory work
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Production deployment guide

---

**Ready to build? Let's start with Day 1: YouTube API integration! 🎬**
