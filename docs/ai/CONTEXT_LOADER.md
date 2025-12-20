# AI Context Loader - MASTER INDEX

## Purpose
This document serves as the **definitive master index** for loading complete project context into AI conversations. Reference this at the start of important conversations to maintain continuity and ensure access to the full vision, current state, and future plans.

**Last Updated**: December 19, 2025 (Phase 8 Week 4 COMPLETE - Days 1-7 All Implemented)  
**Status**: Phase 8 (Video Intelligence) - Week 1-3 COMPLETE (all 7 content creation tools), Week 4 COMPLETE (video history, collections, batch operations)

---

## 🎨 ACTIVE DEVELOPMENT: Graphic Organizer Visual Rendering

**Problem Identified**: AI-generated educational diagrams are fundamentally broken
- AI image generators (DALL-E, Stable Diffusion, etc.) cannot create structured educational diagrams
- Current implementation generates Mermaid code and ASCII art, but browser doesn't render them
- User sees blank output instead of actual diagrams

**Solution Approach**: Option 2 - Specialized JavaScript Libraries
- AI generates structured data (nodes, relationships, categories)
- JavaScript libraries render that data into professional diagrams
- Each diagram type uses the best specialized library for that purpose

**Implementation Plan**: See [GRAPHIC_ORGANIZER_RENDERING.md](GRAPHIC_ORGANIZER_RENDERING.md)

---

## 📚 Core Context Files

### 1. Biography & Mission (WHO WE ARE)
- **[01-BIOGRAPHY-STORY.md](../../01-BIOGRAPHY-STORY.md)** - Scott's personal story and journey
- **[MISSION-STATEMENT.md](../../MISSION-STATEMENT.md)** - Core mission and values
- **[FELLOWSHIP_GUIDE.md](../../FELLOWSHIP_GUIDE.md)** - Team collaboration principles

### 2. Strategic Planning (WHAT WE'RE BUILDING)
- **[03-STRATEGIC-PLAN.md](../../03-STRATEGIC-PLAN.md)** - Overall strategic direction
- **[MASTER-PLAN.md](../../MASTER-PLAN.md)** - Original homeschool platform vision
- **[PROJECT_STATUS.md](../../PROJECT_STATUS.md)** - Current project status (updated weekly)
- **[COGNITIVE_AMPLIFICATION_VISION.md](../COGNITIVE_AMPLIFICATION_VISION.md)** - Ultimate vision for UCAS

### 3. Technical Implementation (HOW IT WORKS)
- **[IMPLEMENTATION_PLAN_FINAL.md](../../IMPLEMENTATION_PLAN_FINAL.md)** - Original game editor implementation
- **[CURRENT_STATUS.md](../../CURRENT_STATUS.md)** - Live development status (updated daily)
- **[MASTER_ROADMAP.md](../MASTER_ROADMAP.md)** - Historical game editor roadmap
- **[TECHNICAL_ARCHITECTURE.md](../TECHNICAL_ARCHITECTURE.md)** - System architecture and design

### 4. Multi-Agent System (THE AI CONSORTIUM)
- **[AGENT_COUNCIL_GUIDE.md](../../AGENT_COUNCIL_GUIDE.md)** - Multi-agent architecture
- **[LANGGRAPH_MULTIAGENT_PLAN.md](../../LANGGRAPH_MULTIAGENT_PLAN.md)** - LangGraph implementation
- **[personas/README.md](../../personas/README.md)** - 12-persona system overview

### 5. Phase Documentation (COMPLETED WORK)
- **Phase 0**: Initial Setup (✅ COMPLETE - Nov 2025)
- **Phase 1**: AI Framework & 12 Personas (✅ COMPLETE - Dec 1-5)
- **Phase 1.5**: Polish & Branding (✅ COMPLETE - Dec 5-6)
- **Phase 2**: Multi-Agent Orchestration (✅ COMPLETE - Dec 6-10)
  - Sprint 1: LangGraph Foundation
  - Sprint 2: Orchestration Agents
  - Sprint 3: Backend API
  - Sprint 4: UI Integration
- **Phase 3**: Memory System (✅ COMPLETE - Dec 10-11)
- **Phase 4**: Conversation Mode (✅ COMPLETE - Dec 11-12)
- **Phase 5**: Polish & Documentation (✅ COMPLETE - Dec 13-14)

### 6. Current Phase Documentation (IN PROGRESS)
**Phase 6: Deep Research Engine** (Dec 14-16, 2025) - ✅ COMPLETE
- **[PHASE_6_IMPLEMENTATION_PLAN.md](../../PHASE_6_IMPLEMENTATION_PLAN.md)** - Complete day-by-day plan
- **[PHASE_6_SETUP.md](../../PHASE_6_SETUP.md)** - API configuration guide
- **[PHASE_6_DAY_1_COMPLETE.md](../../PHASE_6_DAY_1_COMPLETE.md)** - Search foundation complete
- **Phase 6 Day 2**: Content extraction ✅ COMPLETE (Dec 14)
- **Phase 6 Day 3**: Multi-agent analysis ✅ COMPLETE (Dec 16)
  * ResearchAnalyzer with 12-persona orchestration
  * Intelligent chunk sampling (fixes token overflow)
  * Scrollable output UI (no more hidden content!)
  * Executive synthesis + individual perspectives
  * Beautiful collapsible UI with markdown rendering
- **Phase 6 Weeks 7-8**: Research memory & export ✅ COMPLETE (Dec 16)
  * Save/load research sessions to localStorage
  * Export to Markdown & JSON
  * Research history browser
  * Storage management

**Phase 7: Cloud Sync with OAuth** (Dec 16, 2025) - ✅ COMPLETE
- **[DEPLOYMENT_CHECKLIST.md](../../DEPLOYMENT_CHECKLIST.md)** - **CRITICAL: Read before deploying to production!**
- **Supabase Integration**: PostgreSQL cloud database with real-time sync
- **OAuth Authentication**: GitHub & Google sign-in (PKCE flow)
- **Multi-Device Access**: Research sessions sync across all devices
- **User Profiles**: Avatar, email, session management
- **Auto-Sync**: Background sync with offline fallback
- **Database**: `research_sessions` & `user_preferences` tables with RLS
- **UI Components**:
  * One-click sign-in button in toolbar
  * Auth modal with provider selection
  * User profile dropdown with avatar
  * Sync status indicator (syncing/synced/offline/error)
  * Sign-out functionality

**Phase 8: YouTube & Video Intelligence** (Dec 16, 2025) - 🔄 Week 4 IN PROGRESS
- **[PHASE_8_DAY_1_COMPLETE.md](../../PHASE_8_DAY_1_COMPLETE.md)** - Search & transcript foundation
- **[PHASE_8_DAY_2-3_COMPLETE.md](../../PHASE_8_DAY_2-3_COMPLETE.md)** - Video summarization & multi-agent analysis
- **[PHASE_8_WEEK_4_PLAN.md](../../PHASE_8_WEEK_4_PLAN.md)** - Video history & batch operations plan
- **Week 1-3**: All 7 content creation tools ✅ COMPLETE
- **Week 4 Day 1**: Supabase schema & auto-transcript ✅ COMPLETE (Dec 18)
- **Week 4 Day 2**: History tab UI 🔄 IN PROGRESS (Dec 19)
  * **BUG FIXED**: Method name mismatch in video-history-ui.js
  * **Issue**: `videoHistory.getAllVideos()` called non-existent method
  * **Solution**: Changed to `videoHistory.getRecentVideos()` (correct method name)
  * **Status**: Fix applied, awaiting user hard refresh to confirm 2 videos display
- **Day 1**: YouTube search + transcript fetching (✅ COMPLETE)
  * YouTube Data API v3 integration
  * Server-side transcript fetching
  * Modal-based search UI (1200px × 80vh)
  * Video player embed with responsive design
- **Day 2-3**: Video summarization + analysis (✅ COMPLETE)
  * 4-level summary system (TLDR, Abstract, Detailed, Key Moments)
  * Multi-agent analysis (4 specialized personas)
  * Side-by-side layout (95vw × 95vh - massive!)
  * Video left (55%), content right (45%)
  * Fullscreen video button
  * Export to Markdown, clipboard, SRT
  * Timestamp navigation (jump-to-time)
  * All display bugs fixed (visibility + scrolling)
- **Next**: Week 2 advanced features (bookmarks, graphic organizers, assessments)

### 7. Future Capabilities Roadmap (THE BIG PICTURE)
- **[FUTURE_CAPABILITIES_ROADMAP.md](../FUTURE_CAPABILITIES_ROADMAP.md)** - **READ THIS FOR ALL FUTURE PLANS**

---

## 🎯 Complete Project Phases Overview

### ✅ COMPLETED (Phases 0-7)
The multi-agent consortium is fully functional with 12 specialized personas, 4 orchestration modes (Panel, Consensus, Debate, Conversation), deep research engine with multi-agent analysis, research memory & export, and **cloud sync with OAuth authentication** for multi-device access.

### ✅ COMPLETED (Phase 8 Week 4 - ALL 7 DAYS)
**Current Status**: Video Intelligence with full cloud-synced library and batch operations - ALL FEATURES COMPLETE

**Phase 8 Week 4 Summary**:
- **Day 1**: Auto-transcript loading + Supabase schema ✅ COMPLETE (Dec 18)
- **Day 2**: History tab UI with grid view ✅ COMPLETE (Dec 19)
- **Day 3**: Collections Manager (create, filter, badges) ✅ COMPLETE (Dec 19)
- **Day 4**: Batch operations UI (multi-select, actions) ✅ COMPLETE (Dec 19)
- **Days 5-7**: Batch content generation (4 endpoints) ✅ COMPLETE (Dec 19)

**All Features Working**:
- ✅ Video history with 2 videos cached
- ✅ Collections with color-coding and filtering
- ✅ Multi-select batch mode
- ✅ 4 batch operations: Weekly Summary, Combined Quiz, Master Vocabulary, Unit Study Guide
- ✅ Cloud sync via Supabase
- ✅ Export/copy functionality

**Ready for Production Testing** 🎉

### 📋 FUTURE PHASES (Complete Roadmap)

#### Phase 8: YouTube & Video Intelligence (Dec 16, 2025) - 🔄 IN PROGRESS
**Goal**: Process video content like Brisk Education

**Week 1: Video Search & Transcript Foundation** ✅ COMPLETE (Dec 16)
- YouTube Data API v3 integration (search with 25 results per query)
- Server-side transcript fetching (youtube-transcript-plus package)
- Modal-based search UI (1200px x 80vh, full-screen experience)
- Video player embed (responsive 16:9 iframe with YouTube embed API)
- Scrolling fixes applied (inline styles for browser cache bypass)
- Files created:
  * `netlify/functions/youtube-search.cjs` (145 lines) - YouTube search endpoint
  * `netlify/functions/youtube-transcript.cjs` (127 lines) - Transcript proxy
  * `video-ui.js` (639 lines) - Video search and player UI
  * Modal HTML structure in `index.html`
- Testing complete: Search returns 25 videos, scrolling works, player embeds correctly

**Week 2: Video Summarization & Analysis** ✅ COMPLETE (Dec 16)
- 4-level summaries (TLDR, Abstract, Detailed, Key Moments with timestamps)
- Multi-agent video analysis (4 personas debate about video content)
- Export to Markdown, clipboard, SRT format
- Files created:
  * `netlify/functions/video-analyze.cjs` (multi-agent analysis endpoint)
  * Video analysis UI integrated in video-ui.js
- Testing complete: Summaries accurate, multi-agent debates insightful

**Week 3: Educational Content Creation** ✅ ALL 7 TOOLS COMPLETE (Dec 17)
**All Tools Working**:
- ✅ **Quiz Maker**: Multiple choice, short answer, T/F, fill-in-blank with timestamps
- ✅ **Lesson Plan Generator**: Backward design, differentiation, Bloom's taxonomy
- ✅ **Discussion Questions**: 6 cognitive levels, Socratic method, debate topics
  * **BUG FIXED (Dec 16)**: API returned nested `{discussion_questions: {...}}` but code expected flat structure
  * **FIX**: Extract nested object before formatting: `questions.discussion_questions || questions`
  * **BUG FIXED (Dec 17)**: Token limit too low (3000 tokens) - Claude stopped mid-generation
  * **FIX**: Increased to 16000 tokens in video-discussion.cjs for full question generation
- ✅ **DOK 3-4 Project Generator**: Depth of Knowledge framework for strategic/extended thinking
  * DOK 3: Strategic thinking (1-2 week projects, reasoning, evidence)
  * DOK 4: Extended thinking (2-3 week projects, research, synthesis, real-world application)
  * Includes driving questions, objectives, timeline, tasks, deliverables, rubrics, resources, differentiation
- ✅ **Vocabulary Builder**: 15-20 key terms with grade-appropriate definitions, example sentences, word forms, synonyms, memory tips
- ✅ **Guided Notes Generator**: Cornell notes, outline format, fill-in-blank worksheets
  * **MAJOR FIX**: Table rendering in browser display
  * **Problem**: Cornell Notes showed raw markdown pipes `| Questions | Notes |` instead of formatted tables
  * **Solution**: Enhanced `markdownToHTML()` function with pipe-table parser
  * **Implementation**: Detects `|` rows, skips separator lines `|---|---|`, creates HTML `<table>` with borders, padding, gray headers
  * **Result**: Cornell Notes now display as beautiful formatted tables with proper styling
- ✅ **Graphic Organizer Generator**: Concept maps, timelines, Venn diagrams, cause/effect, KWL, mind maps
  * **BUG FIXED (Dec 17)**: `transcript.map is not a function` error
  * **Issue**: Transcript sent as string instead of array to backend
  * **FIX**: Added type checking to handle both array and string formats gracefully
  * 6 organizer types with Mermaid diagrams and ASCII art
  * Grade-appropriate content (K-5, 6-8, 9-12, College)
- Files created:
  * `video-content-tools.js` (1200+ lines) - Core content generation + all tools
  * `netlify/functions/video-quiz.cjs` (95 lines) - Quiz generation endpoint
  * `netlify/functions/video-lesson-plan.cjs` (95 lines) - Lesson plan endpoint
  * `netlify/functions/video-discussion.cjs` (95 lines) - Discussion questions endpoint
  * `netlify/functions/video-dok-project.cjs` (140 lines) - DOK 3-4 project endpoint
  * `netlify/functions/video-vocabulary.cjs` (95 lines) - Vocabulary builder endpoint
  * `netlify/functions/video-guided-notes.cjs` (110 lines) - Guided notes endpoint
  * `netlify/functions/video-graphic-organizer.cjs` (120 lines) - Graphic organizer endpoint
  * "Create" tab added to Video Intelligence modal (7 tool cards)
  * Export: Copy to clipboard, Download Markdown
  * Enhanced `markdownToHTML()` function with table parsing (index.html)
  * "Create" tab added to Video Intelligence modal (7 tool cards)
  * Export: Copy to clipboard, Download Markdown
  * Enhanced `markdownToHTML()` function with table parsing (index.html)

**Critical Bug Resolved** (Dec 16):
- **Issue**: ES6 module caching prevented Discussion Questions bug fix from loading
- **Solution**: Added automatic cache-busting to module imports with timestamp query parameters
- **Implementation**: `import('./video-content-tools.js?v=' + Date.now())` forces fresh module on every page load
- **Result**: No more manual cache clearing required - normal F5 refresh now works

**Still Need (Week 3)**:
- ⏳ **Graphic Organizer Generator**: Concept maps, timelines, Venn diagrams, cause/effect charts (LAST TOOL)

**Week 4: Video History & Batch Operations** � DAY 1-2 IN PROGRESS (Dec 18-19, 2025)
**Goal**: Transform Video Intelligence modal into full video library with history tracking and batch operations

**Completed (Day 1 - Dec 18)**:
- ✅ **Auto-Load Transcripts**: No manual clicking - transcripts load automatically when video opens
- ✅ **Supabase Schema**: `video_history` and `video_collections` tables created with RLS policies
- ✅ **VideoHistory Manager**: Cloud sync with localStorage fallback (video-history-manager.js, 350+ lines)
- ✅ **VideoCollections Manager**: Collection CRUD operations (video-collections-manager.js, 200+ lines)
- ✅ **Full Screen Modal**: Redesigned to 98vw × 98vh with 4-tab layout
- ✅ **Database Testing**: Successfully cached 2 videos with thumbnails and metadata

**In Progress (Day 2 - Dec 19)**:
- 🔄 **History Tab UI**: Grid view of recent videos (video-history-ui.js)
  * Grid HTML structure complete
  * Click handlers attached for video reload
  * Collections sidebar initialized
  * **BUG FIXED**: render() method called `getAllVideos()` which doesn't exist
  * **Solution**: Changed to `getRecentVideos()` (correct method name in video-history-manager.js)
  * **Current Status**: Fix applied, awaiting user hard refresh to confirm display
  * Expected: 2 video cards with thumbnails, titles, channel names, tool status

**Still Need (Days 3-7)**:
- ⏳ **Collections/Playlists**: Create units like "Week 1 Science" or "American Revolution" for organization
- ⏳ **Multi-Select Batch Mode**: Select multiple videos from history for batch operations
- ⏳ **Weekly Summary**: Synthesize 5-10 videos into one master document
- ⏳ **Combined Quiz**: Generate questions covering all selected videos
- ⏳ **Master Vocabulary**: Merge vocabulary from multiple videos into one comprehensive list
- ⏳ **Unit Study Guide**: Export complete curriculum with summary, quiz, vocab, and timeline
- ⏳ **Tool Usage Tracking**: See which tools you've used on each video (✅ Quiz, ⬜ Notes, etc.)
- ⏳ **Star/Favorite Videos**: Pin important videos to top of history (UI ready, needs testing)
- ⏳ **Quick Reload**: Click video in history → instant load (transcript already cached)

**New Tab Structure**:
1. 🔍 **Search/Load** - Find and load videos (existing functionality)
2. 📚 **History** - Grid view of recent videos with thumbnails and tool status
3. 📦 **Batch** - Multi-select mode with batch action buttons
4. 📺 **Current Video** - All existing tools (Transcript, Summary, Analysis, Create)

**Use Cases**:
- **Weekly Review**: Select this week's 8 videos → "Weekly Summary" → get one synthesis document
- **Unit Planning**: Create "American Revolution" collection → add 5 videos → "Unit Study Guide" → complete curriculum
- **Daily Workflow**: Click video → transcript auto-loads → immediately use Create tools (no extra clicking)

**Implementation Timeline**: 3-4 days (24-26 hours)
- Day 1: Auto-transcript loading + History storage (4h)
- Day 2: History tab UI + Full screen redesign (4h)
- Day 3: Collections manager (4h)
- Day 4: Batch tab + Multi-select (4h)
- Day 5: Weekly summary backend (3h)
- Day 6: Combined quiz + vocabulary (3h)
- Day 7: Study guide export + polish (3h)

**Technical Architecture**:
- **Supabase Tables** (✅ Created Dec 18):
  * `video_history` (video_id, title, thumbnail_url, channel_name, transcript, tools_used, collections, is_starred, last_accessed, user_id)
  * `video_collections` (id, name, description, video_ids[], color, created_at, user_id)
  * RLS policies: 8 total (4 per table) for user data isolation
- **Backend Endpoints** (⏳ Week 4 Days 3-7):
  * `video-batch-summary.cjs` - Synthesize multiple videos
  * `video-batch-quiz.cjs` - Combined quiz generation
  * `video-batch-vocabulary.cjs` - Master vocabulary list
  * `video-batch-study-guide.cjs` - Complete export
- **Frontend Modules**:
  * `video-history-manager.js` (350+ lines) - ✅ Complete - Supabase data layer with cloud sync
  * `video-collections-manager.js` (200+ lines) - ✅ Complete - Collection CRUD operations
  * `video-history-ui.js` (800+ lines) - 🔄 IN PROGRESS - History tab render (bug just fixed)
  * `video-batch-tools.js` - ⏳ NOT STARTED - Batch operations UI

**Current Technical Status** (Dec 19, 2025):
- **Database**: ✅ 2 videos cached, schema correct, RLS working
- **Server**: ✅ Running on http://localhost:8888, all 7 content tools active
- **Auth**: ✅ GitHub OAuth, user scosom@gmail.com authenticated
- **History Manager**: ✅ Data layer working, `getRecentVideos()` method available
- **History UI**: 🔄 render() bug just fixed (method name), awaiting test
- **Collections**: ✅ Manager initialized, 0 collections created yet
- **Batch Operations**: ⏳ Not started yet (Days 3-7)

**Detailed Plan**: See [PHASE_8_WEEK_4_PLAN.md](../../PHASE_8_WEEK_4_PLAN.md)

#### Phase 9: Creative Content Generation
**Goal**: Full multimedia creation capabilities
- **Month 4-5**: Image generation (DALL-E, Midjourney, Stable Diffusion)
  * Smart prompting with multi-agent optimization
  * Educational diagrams and infographics
  * Batch generation and variation
- **Month 6-7**: Video & audio creation
  * Text-to-video with RunwayML, Synthesia
  * Voice generation with ElevenLabs
  * Podcast and music creation

#### Phase 10: Development Environment
**Goal**: Replace VS Code with AI-native coding tool
- **Month 8-9**: Code intelligence
  * Monaco editor integration
  * Multi-agent code review (Architect + Debugger + Strategist)
  * Context-aware completion
  * Refactoring assistant
- **Month 10-11**: Project management
  * Project scaffolding with agent discussion
  * Build automation and deployment
  * Test generation and coverage

#### Phase 11: Integration Ecosystem
**Goal**: Seamless productivity tool integration
- **Month 12**: Google & Microsoft
  * Google Workspace (Docs, Sheets, Slides, Gmail)
  * Microsoft Office (Word, Excel, PowerPoint)
- **Year 2 Q1**: Browser & productivity
  * Browser extension for universal access
  * Notion, Trello, Asana integration
  * Slack/Teams bot integration

#### Phase 12: Advanced Intelligence & Autonomy
**Goal**: Persistent memory and autonomous agents
- **Year 2 Q2**: Memory & learning
  * Long-term memory system
  * Personal knowledge base
  * Preference learning
  * Visual knowledge graph
- **Year 2 Q3**: Autonomous agents
  * Background processing
  * Scheduled tasks (overnight research)
  * Proactive assistance
  * Multi-step workflows: Research → Analyze → Create → Deploy
- **Year 2 Q4**: Collaboration
  * Shared workspaces
  * Team features
  * Role-based access
  * Collective intelligence

#### Phase 13: Scale & Ecosystem (Year 3)
- **Y3 Q1**: Public API & plugin system
- **Y3 Q2**: Mobile & cross-platform apps
- **Y3 Q3**: Advanced AI (fine-tuning, multi-modal)
- **Y3 Q4**: Enterprise features & white-labeling

---

## 👤 Quick Identity Summary

### Who You Are (Scott Somers)
- **Reformed Baptist Christian** homeschool educator and father
- **Theological Foundation**: Spurgeon, MacArthur, Piper, Sproul (Reformed theology)
- **Background**: 
  * Undergrad: Theology
  * Grad: Elementary Education (in progress)
  * Experience: Homeschool dad + public school teacher (rural Alaska, Title 1)
  * Deacon with deep theological knowledge
- **Philosophy**: "My life is better because you're in it" - meeting kids where they are
- **Vision**: Building tools that reflect YOUR worldview and values (Reformed, classical education)

### What We're Building
**Universal Cognitive Amplification System (UCAS)**
- **Primary**: Multi-Agent AI Consortium (12 specialized personas)
- **Secondary**: Original game editor (now background tool)
- **Current Focus**: Deep Research Engine (Phase 6)
- **Ultimate Goal**: Complete cognitive amplification platform replacing multiple tools

**12 Expert Personas**:
1. 👨‍🏫 Master Teacher - Educational expertise, Socratic method
2. 📖 Classical Educator - Classical trivium, great books, virtue
3. 📊 Strategist - Strategic thinking, vision, planning
4. ⛪ Theologian - Theology, philosophy, ethics
5. 🏗️ Technical Architect - Software architecture, systems design
6. ✍️ Writer - Creative writing, storytelling, editing
7. 🔬 Analyst - Data analysis, evidence, critical thinking
8. 🐛 Debugger - Critical analysis, flaw identification
9. 🎨 UX Designer - User experience, design patterns
10. 📢 Marketing Strategist - Marketing, positioning, growth
11. 🎮 Game Designer - Game mechanics, engagement, flow
12. 👾 Gen-Alpha Expert - Youth culture, digital natives

**Orchestration Modes**:
- Panel Discussion (all agents respond sequentially)
- Consensus Voting (agents debate and vote)
- Debate Mode (focused argumentation)
- Live Conversation (turn-taking discussion - most engaging!)
- Deep Research (multi-agent analysis of sources)

---

## 🎯 Current Priority (Phase 8 - Day 1 COMPLETE)

**Status**: Phase 7 (Cloud Sync) COMPLETE ✅ | Phase 8 Week 1-2 COMPLETE ✅ | Phase 8 Week 3: 6 of 7 tools ✅  
**Current**: Phase 8 Week 3 (Educational Content Creation) - Cornell Notes table rendering fixed, testing Graphic Organizers

**What's Working Now** (Phase 8 Week 3):
- ✅ Quiz Maker with DOK levels
- ✅ Lesson Plan Generator with backward design
- ✅ Discussion Questions (6 Bloom's levels) - **BUG FIXED**
- ✅ DOK 3-4 Project Generator
- ✅ Vocabulary Builder (15-20 terms with definitions, examples, memory tips)
- ✅ Guided Notes - Cornell Notes format with **TABLE RENDERING FIX**
  * **Enhanced markdownToHTML()**: Converts pipe tables to HTML `<table>` elements
  * Beautiful formatting: borders, padding, gray headers, full width
  * No more raw markdown pipes in browser display
- ✅ Cache-busting for automatic module updates
- ⏳ Graphic Organizers (last tool - next up)

**What Was Working** (Phase 8 Week 1-2):
- ✅ YouTube search with Data API v3 (25 results per query)
- ✅ Server-side transcript fetching (youtube-transcript-plus)
- ✅ Modal-based search UI (1200px x 80vh, full-screen)
- ✅ Video player embed (responsive 16:9 iframe)
- ✅ Scrollable search results and transcript containers
- ✅ Video selection and playback tested end-to-end
- ✅ Console logging for debugging (e.g., "📺 YouTube Search: Found 25 videos")
- ✅ Files: `youtube-search.cjs` (145 lines), `youtube-transcript.cjs` (127 lines), `video-ui.js` (639 lines)

**Phase 7 Complete** (Cloud Sync):
- ✅ Supabase PostgreSQL cloud database
- ✅ OAuth authentication with GitHub & Google (PKCE flow)
- ✅ User sessions with profile dropdown (avatar, email)
- ✅ Multi-device sync for research sessions
- ✅ Auto-sync with offline fallback
- ✅ Row-Level Security (RLS) for data privacy

**Implementation Time**: Phase 7 (~4 hours), Phase 8 Day 1 (~3 hours)  
**Status**: Phase 7 ✅ PRODUCTION READY | Phase 8 Day 1 ✅ COMPLETE  

**What's Next** (Phase 8 Day 2-3):
1. ⏳ Video summarization with multi-level summaries (TLDR, abstract, detailed, timestamped)
2. ⏳ Multi-agent video analysis (all 12 agents "watch" and debate)
3. ⏳ Key teaching moments identification
4. ⏳ Transcript search within videos
5. ⏳ Export summaries (Markdown, JSON)

**See**: [PHASE_8_DAY_1_COMPLETE.md](../../PHASE_8_DAY_1_COMPLETE.md) for full implementation details

---
## 💻 Technical Stack

### Core Technologies
- **Frontend**: Vanilla JavaScript (ES6+), no frameworks
- **Backend**: Node.js + Netlify Serverless Functions
- **Orchestration**: LangGraph.js state machines
- **AI Provider**: Anthropic Claude (Sonnet 4.5, Opus 4.5, Haiku 4.5)
- **Also Supports**: OpenAI GPT (4, 4.1, 5, 5.2, 5-mini)
- **Database**: Supabase (PostgreSQL with real-time sync)
- **Authentication**: Supabase Auth (GitHub & Google OAuth, PKCE flow, debug logging disabled for production)

### Phase 6 Research Stack
- **Search**: Tavily AI, Brave Search API, Serper API
- **Content Extraction**: Mozilla Readability, Cheerio, jsdom
- **Text Processing**: Semantic chunking (~4000 token chunks, 200 token overlap)
- **Analysis**: 12-persona multi-agent orchestration

### Phase 8 Video Stack
- **YouTube API**: YouTube Data API v3 (search, video details)
- **Transcript**: youtube-transcript-plus (server-side Node.js package)
- **Video Player**: YouTube iframe embed API (responsive 16:9)
- **UI**: Modal-based search (1200px x 80vh, scrollable)
- **Endpoints**: `youtube-search.cjs`, `youtube-transcript.cjs`, `video-quiz.cjs`, `video-lesson-plan.cjs`, `video-discussion.cjs`, `video-dok-project.cjs`
- **Content Generation**: Claude Sonnet 4 with 4096-8192 token limits
- **Cache-Busting**: Automatic timestamp query parameters for ES6 modules (`?v=timestamp`)

### Infrastructure
- **Hosting**: Netlify (serverless, auto-deploy from GitHub)
- **Version Control**: Git + GitHub
- **Development**: Custom Node.js dev server (port 8888)
- **Storage**: Supabase (cloud) + localStorage (offline fallback)
- **Database**: PostgreSQL with Row-Level Security (RLS)
- **Auth**: OAuth 2.0 with PKCE flow (GitHub, Google)

---

## 📊 Project Status at a Glance

### Completed Capabilities
✅ 12-persona multi-agent system  
✅ 4 orchestration modes (Panel, Consensus, Debate, Conversation)  
✅ Deep Research mode with multi-agent analysis  
✅ Memory system (agent-memory.js + research sessions)  
✅ Multi-LLM support (Claude + GPT)  
✅ Search foundation (Tavily/Brave/Serper)  
✅ Content extraction & chunking (Mozilla Readability)  
✅ ResearchAnalyzer with intelligent token sampling  
✅ Scrollable research UI with collapsible sections  
✅ Executive synthesis + 12 expert perspectives  
✅ Markdown rendering in analysis output  
✅ Research memory & export (save/load/history/Markdown/JSON)  
✅ Cloud sync with Supabase PostgreSQL  
✅ OAuth authentication (GitHub & Google, PKCE flow, clean console logging)  
✅ Multi-device access with real-time sync  
✅ User profiles with avatars  
✅ Auto-sync with offline fallback  
✅ Row-Level Security (RLS) for data privacy  
✅ YouTube search with Data API v3 (25 results, modal UI)  
✅ Video player embed (responsive 16:9 iframe)  
✅ Server-side transcript fetching (youtube-transcript-plus)  
✅ Video content creation tools (Quiz, Lesson Plans, Discussion Questions, DOK Projects)  
✅ Discussion Questions with proper token allocation (16K tokens)  
✅ DOK (Depth of Knowledge) Framework integration (levels 1-4)  
✅ Automatic module cache-busting for seamless updates  
✅ Table rendering in markdown display (pipe-delimited tables → HTML)  
✅ Production-ready console output (verbose debug logging removed)
✅ Comprehensive documentation (30,000+ words)

### In Progress
🔄 Phase 8 Week 3: Educational content creation - 6 of 7 tools complete
🔄 Graphic Organizers - concept maps, timelines, Venn diagrams (LAST TOOL - next up)

### Recent Fixes (Dec 17)
✅ Discussion Questions token limit increased (3000 → 16000 tokens)
✅ Supabase GoTrueClient debug logging disabled (production-ready)
✅ Console cleanup for cleaner output

### Next Up
⏳ Phase 8 Week 3: Complete last tool (Graphic Organizers)  
⏳ Phase 8 Week 4: Export & integration (Google Docs, Word .docx with tables, multi-video features)  
⏳ Phase 9: Creative content generation  
⏳ Phase 10: Development environment  
⏳ Phase 11-13: Integration, autonomy, scale

### Known Limitations
- No YouTube video processing yet (Phase 8)
- Desktop-first (mobile optimization in Phase 11)
- Single-user workspaces (team features in Phase 12)

---

## 🚀 Development Velocity

**Time Investment So Far**: ~12-15 hours total (Phases 1-7)  
**Development Speed**: 10-20x normal (AI-assisted rapid development)  
**Documentation**: Intentionally over-documented (10:1 docs-to-code ratio)  
**Philosophy**: Ship fast, iterate based on real usage

**Cost Per Session**: $0.10-0.30 (Claude Sonnet)  
**Monthly API Costs**: ~$20-30 (current usage with cloud sync)

---

## 📖 Context Loading Strategy for AI Conversations

### For Claude Sonnet 4.5 (200K Token Context Window)
Sonnet 4.5 has ~200K token capacity, equivalent to:
- ~150,000 words
- ~500 pages of text
- **Your entire project docs fit comfortably!**

### Tier 1: Always Load (5-10K tokens)
**Essential for every conversation:**
- This file (CONTEXT_LOADER.md) - Master index
- CURRENT_STATUS.md - Live development state
- Current phase objectives
- Last 3 interactions from session

### Tier 2: Load When Relevant (20-40K tokens)
**For feature development or planning:**
- FUTURE_CAPABILITIES_ROADMAP.md - Complete vision
- PHASE_6_IMPLEMENTATION_PLAN.md (or current phase plan)
- Technical architecture docs
- Persona definitions

### Tier 3: Reference on Demand (Remaining Capacity)
**Deep dives and historical context:**
- Biography and mission documents
- Historical phase completion summaries
- Legacy planning documents
- Full conversation history

---

## 🎬 Quick Start Templates for New Conversations

### Template 1: Continue Current Work
```
Continuing work on UCAS - Universal Cognitive Amplification System.

Context loaded:
- CONTEXT_LOADER.md (master index)
- CURRENT_STATUS.md (live state)
- Phase 7 (Cloud Sync with OAuth) - COMPLETE

Current status: Planning Phase 8 (YouTube & Video Intelligence)
Next: Design video processing architecture

Proceed from documented state in CURRENT_STATUS.md
```

### Template 2: Strategic Planning Session
```
Strategic planning for UCAS future phases.

Context needed:
- CONTEXT_LOADER.md
- FUTURE_CAPABILITIES_ROADMAP.md (Phases 8-13)
- COGNITIVE_AMPLIFICATION_VISION.md
- Current completion: Phase 7 (Cloud Sync)

Goal: [Describe planning objective]

Please review future plans before discussion.
```

### Template 3: Bug Fixing / Debugging
```
Debugging issue in Phase 7 cloud sync system.

Context:
- CONTEXT_LOADER.md (overview)
- CURRENT_STATUS.md (current state)
- PHASE_7_COMPLETE.md (OAuth & Supabase integration)
- Recent changes: [Describe what changed]

Issue: [Describe problem]
Expected: [What should happen]
Actual: [What is happening]

System state: [Relevant files/functions]
```

### Template 4: Feature Implementation
```
Implementing [Feature Name] for UCAS.

Context:
- CONTEXT_LOADER.md
- FUTURE_CAPABILITIES_ROADMAP.md (Phase X section)
- CURRENT_STATUS.md
- Related files: [List relevant existing code]

Requirements:
- [Requirement 1]
- [Requirement 2]

Approach: [Proposed implementation strategy if known]
```

---

## 🔧 Context Management Recommendations

### Automatic Context Injection (Future Enhancement)
Build a system that automatically includes context in AI calls:

```javascript
class ProjectContext {
  constructor() {
    this.core = this.loadCoreContext();        // Mission, values, current phase
    this.session = this.loadSessionContext();  // Active work this session
    this.persona = this.loadPersonaContext();  // Agent-specific knowledge
  }
  
  buildPrompt(userMessage, tier = 2) {
    let context = `[CORE CONTEXT]\n${this.core}\n\n`;
    
    if (tier >= 2) {
      context += `[TECHNICAL CONTEXT]\n${this.getTechnicalContext()}\n\n`;
    }
    
    if (tier >= 3) {
      context += `[HISTORICAL CONTEXT]\n${this.getHistoricalContext()}\n\n`;
    }
    
    context += `[USER MESSAGE]\n${userMessage}`;
    
    return context;
  }
  
  loadCoreContext() {
    return {
      identity: readFile('01-BIOGRAPHY-STORY.md'),
      mission: readFile('MISSION-STATEMENT.md'),
      currentPhase: readFile('CURRENT_STATUS.md'),
      architecture: readFile('docs/TECHNICAL_ARCHITECTURE.md')
    };
  }
}
```

### Memory Expansion Needed (Phase 11)
Enhance agent-memory.js to include:
- Project milestones and completion dates
- Architectural decisions with rationale
- Key patterns and coding conventions
- Cross-session continuity
- Decision logs (why we chose X over Y)

### "Project Brain" Concept
A persistent knowledge base that:
- Indexes all documentation with semantic search
- Tracks decisions and their rationale
- Maintains architectural principles
- Stores key conversations and insights
- Enables "tell me what we decided about X"

---

## 📂 File Organization for Context

### Living Documents (Update Frequently)
📝 **CURRENT_STATUS.md** - Updated daily/after each session  
📝 **PROJECT_STATUS.md** - Updated weekly  
📝 **CONTEXT_LOADER.md** - Updated when major changes occur (this file!)

### Strategic Documents (Update Per Phase)
📋 **FUTURE_CAPABILITIES_ROADMAP.md** - Update when plans change  
📋 **PHASE_X_IMPLEMENTATION_PLAN.md** - Update during active phase  
📋 **COGNITIVE_AMPLIFICATION_VISION.md** - Update when vision evolves

### Historical Documents (Archive, Don't Update)
📦 **PHASE_X_COMPLETE.md** - Completion summaries (locked after phase ends)  
📦 **MASTER-PLAN.md** - Original homeschool vision (historical reference)  
📦 **MASTER_ROADMAP.md** - Game editor roadmap (historical reference)

### Reference Documents (Rarely Change)
📚 **AGENT_COUNCIL_GUIDE.md** - Multi-agent architecture principles  
📚 **FELLOWSHIP_GUIDE.md** - Team collaboration principles  
📚 **personas/*.md** - Individual persona definitions

---

## 🎓 Best Practices for Context Continuity

### Starting Each Day
1. Review CURRENT_STATUS.md for overnight updates
2. Check this file (CONTEXT_LOADER.md) for any changes
3. Scan recent git commits for what changed
4. Load relevant phase documentation

### When Switching Tasks
1. Update CURRENT_STATUS.md with completed work
2. Note any blockers or open questions
3. Commit changes to git
4. Start new task with fresh context load

### When Onboarding New AI Assistant
1. **Start with**: CONTEXT_LOADER.md (this file)
2. **Then read**: CURRENT_STATUS.md
3. **Then review**: Current phase plan (PHASE_X_IMPLEMENTATION_PLAN.md)
4. **Optional**: Completed phase summaries for background

### When Context Gets Stale
**Signs you need to reload context:**
- AI suggests features already implemented
- AI asks questions answered in docs
- AI doesn't remember recent decisions
- AI proposes approaches we already rejected

**Solution:**
- Copy key excerpts from CURRENT_STATUS.md into conversation
- Reference specific completed phases
- Point to architectural decisions in documentation

---

## 🔮 Future Enhancements (Phase 11)

### Persistent Context System
When we implement Phase 11 (Persistent Memory), we'll add:

1. **Context Auto-Loader**: Automatically inject project context into every AI call
2. **Smart Context Selection**: Only include relevant context based on task type
3. **Context Compression**: Summarize old context to fit more in window
4. **Context Versioning**: Track how project context evolves over time
5. **Context Search**: "Show me all decisions about authentication"
6. **Context Graph**: Visual map of how concepts connect

### Agent Memory Enhancement
Expand agent-memory.js to include:
- Cross-session memory (remember conversations from days/weeks ago)
- Project-level facts (stored once, accessed by all agents)
- Decision logs (why we chose X, rejected Y, with full context)
- Architecture principles (automatically enforced)
- Pattern library (recognized coding patterns)

---

## 💡 Tips for Effective Context Usage

### DO:
✅ Start every important conversation by referencing this file  
✅ Keep CURRENT_STATUS.md ruthlessly up-to-date  
✅ Use specific document references when asking questions  
✅ Link to line numbers for precision: `file.js#L123-L456`  
✅ Include relevant error messages and console output  
✅ Mention recent changes that might affect current work

### DON'T:
❌ Assume AI remembers previous unrelated conversations  
❌ Reference obsolete documents (check last updated date)  
❌ Skip context loading for "quick questions" (they compound)  
❌ Let documentation drift from reality  
❌ Forget to document major decisions

---

## 📞 Emergency Context Recovery

**If an AI conversation goes off the rails:**

1. **Stop and reset**: "Let's pause and reload context"
2. **Provide core files**: Share CONTEXT_LOADER.md + CURRENT_STATUS.md
3. **State current objective**: "We're working on X, currently at Y state"
4. **Clarify misconceptions**: "That feature is already done" or "We decided against that approach"
5. **Link to evidence**: Point to specific files/lines showing current state
6. **Resume with clarity**: "Now, continuing from [clear starting point]..."

---

## 🎯 Success Metrics for Context Management

**Good context management means:**
- AI rarely asks about things documented
- AI suggests appropriate next steps
- AI remembers recent decisions
- AI builds on existing work rather than starting over
- Conversations feel continuous, not disjointed

**Poor context management means:**
- AI suggests rebuilding working features
- AI asks same questions repeatedly
- AI proposes rejected approaches
- AI unaware of recent progress
- Conversations feel like Groundhog Day

---

**Remember**: Context is everything. The 5 minutes spent loading proper context saves hours of confused back-and-forth.

**This file is your North Star for project continuity. Reference it often.**

---

*Last Updated: December 17, 2025 (Evening - Token Limit Fix + Console Cleanup)*  
*Next Review: After Phase 8 Week 3 completion (1 tool remaining: Graphic Organizers)*

---

## Recent Bug Fixes (December 17, 2025)

### Discussion Questions Token Limit
**Problem**: Generated questions were truncated after ~170 characters (only title + intro)  
**Root Cause**: `max_tokens: 3000` in video-discussion.cjs was insufficient  
**Solution**: Increased to `max_tokens: 16000` for full question generation  
**Files Modified**: `netlify/functions/video-discussion.cjs` (line 45)  
**Result**: Discussion Questions now generate completely with all 6 Bloom's taxonomy levels

### Supabase Console Logging Cleanup
**Problem**: GoTrueClient verbose debug logs cluttering console (50+ lines per page load)  
**Root Cause**: `debug: true` in Supabase client configuration  
**Solution**: Changed to `debug: false` in supabase-client.js  
**Files Modified**: `supabase-client.js` (line 58)  
**Result**: Clean console output - only shows important auth status messages

---

**Remember**: Sonnet 4.5's 200K context is HUGE. We can comfortably load:
- All mission/strategy docs (~10K tokens)
- All technical specs (~20K tokens)  
- All persona definitions (~5K tokens)
- All phase documentation (~30K tokens)
- Current conversation (~30K tokens)
- **Still have 100K+ tokens remaining!**

Don't be shy about loading context. The model can handle it!
