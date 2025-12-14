# Universal Cognitive Amplification System (UCAS)

**Formerly: Universal Game Level Editor**  
**Now: Multi-Agent AI Cognitive Amplification Platform**

A next-generation cognitive amplification tool that combines multi-agent AI collaboration, deep research capabilities, and creative generation into one unified system. Built to replace ChatGPT, Perplexity, VS Code, and more with an integrated "Extended Mind" approach.

## 🎯 What Is This?

UCAS is a platform that amplifies your cognition through specialized AI agents working together. Think of it as having a team of 12 expert consultants (Master Teacher, Technical Architect, Strategist, Theologian, and more) who can:
- Discuss complex topics collaboratively
- Conduct deep research with citations
- Create content (images, videos, audio)
- Develop software end-to-end
- Integrate with your productivity tools

**Current Status**: Phase 5 Complete → Phase 6 Ready  
**Development Time**: ~5 hours total (AI-assisted "vibe coding")  
**Next Up**: Deep Research Engine (2-3 days)

## 📚 Documentation Hub

**New to UCAS?** → Start with [GETTING_STARTED.md](GETTING_STARTED.md) (15 min setup)

**Essential Reading**:
- 📖 [COGNITIVE_AMPLIFICATION_VISION.md](docs/COGNITIVE_AMPLIFICATION_VISION.md) - The big picture, philosophy, competitive analysis
- 🏗️ [CURRENT_CAPABILITIES_INVENTORY.md](docs/CURRENT_CAPABILITIES_INVENTORY.md) - What works now (Phases 1-5)
- 🔬 [RESEARCH_CAPABILITIES_SPEC.md](docs/RESEARCH_CAPABILITIES_SPEC.md) - Deep research system (Phase 6)
- 🗺️ [FUTURE_CAPABILITIES_ROADMAP.md](docs/FUTURE_CAPABILITIES_ROADMAP.md) - What's coming next (Phases 6-11)
- 🏛️ [TECHNICAL_ARCHITECTURE.md](docs/TECHNICAL_ARCHITECTURE.md) - How everything works
- 🧭 [MASTER_INDEX.md](docs/MASTER_INDEX.md) - Navigation hub for all docs

**Implementation**:
- 🎯 [PHASE_6_IMPLEMENTATION_PLAN.md](PHASE_6_IMPLEMENTATION_PLAN.md) - Next sprint (detailed day-by-day)
- ✅ [PHASE_5_COMPLETE.md](docs/ai/PHASE_5_COMPLETE.md) - What we just shipped
- 📊 [PROJECT_STATUS.md](PROJECT_STATUS.md) - Current project state

## ✨ Features

### Phase 1-5: Multi-Agent Consortium ✅ COMPLETE

**12 Expert Personas**:
- Core Council: Master Teacher, Classical Educator, Strategist, Theologian
- Specialists: Technical Architect, Writer, Analyst, Debugger, UX Designer, Marketing Strategist, Game Designer, Gen-Alpha Expert

**Three Orchestration Modes**:
1. **Panel Mode** - Sequential responses from all agents
2. **Consensus Mode** - Agents debate and reach agreement
3. **Conversation Mode** - Turn-taking discussion with user interjections

**Key Capabilities**:
- 🧠 Agent memory system (remembers past conversations)
- 💬 Real-time chat interface with persona avatars
- 🎭 Research-backed personas (30-60 min research each)
- 🤖 Multi-provider support (Anthropic Claude + OpenAI GPT)
- 📊 Dynamic speaker selection and turn-taking
- 💭 Context-aware responses building on previous turns

### Phase 6: Deep Research Engine 🎯 STARTING NOW

**Coming in 2-3 days**:
- 🔍 Multi-source search (Google, Tavily, Bing)
- 📄 Smart content extraction (web scraping, readability)
- 🧩 Intelligent chunking (semantic boundaries)
- 🤖 Multi-agent analysis (12 personas analyze together)
- 💾 Research memory (save sessions, export to Markdown)
- 📊 Citation tracking (source attribution)

### Phases 7-11: The Full Vision 🔮 NEXT 3-4 MONTHS

- **Phase 7**: YouTube + video processing (transcripts, analysis)
- **Phase 8**: Creative content (DALL-E, ElevenLabs, etc.)
- **Phase 9**: Code editor + GitHub integration
- **Phase 10**: Productivity integrations (Google Docs, Notion)
- **Phase 11**: Advanced AI (reasoning models, fine-tuning)

**Full details**: [FUTURE_CAPABILITIES_ROADMAP.md](docs/FUTURE_CAPABILITIES_ROADMAP.md)

### Legacy: Game Level Editor 🎮 STILL WORKS

The original game editor is still fully functional:
- Load background images and add game assets
- Drag & drop positioning with live property editing
- JSON export for game integration
- Project save/load functionality
- Keyboard shortcuts for fast workflow

## 🚀 Quick Start

### For New Developers

1. **Read** [GETTING_STARTED.md](GETTING_STARTED.md) (15 min setup guide)
2. **Install**:
   ```bash
   npm install
   # Creates .env file with your API keys
   node server.cjs
   ```
3. **Try It**: Open http://localhost:3000 and click 🤖 Multi-Agent Consortium
4. **Read**: [PHASE_6_IMPLEMENTATION_PLAN.md](PHASE_6_IMPLEMENTATION_PLAN.md) for next steps

### For Users

**Using the Multi-Agent Consortium**:

1. Click the 🤖 button in the UI
2. Select mode (Panel/Consensus/Conversation)
3. Choose personas (or use all 12)
4. Enter your question or topic
5. Watch agents collaborate!

**Three Modes Explained**:

- **Panel Mode**: All agents respond sequentially (best for comprehensive coverage)
- **Consensus Mode**: Agents debate and reach agreement (best for decisions)
- **Conversation Mode**: Turn-taking discussion (best for exploration)

## 🛠️ Technology Stack

**Current (Phases 1-5)**:
- **LangGraph.js** - Agent orchestration and state machines
- **Anthropic Claude** - Primary LLM (Sonnet, Opus, Haiku)
- **OpenAI GPT** - Secondary LLM (GPT-4, GPT-4o)
- **Netlify Functions** - Serverless API endpoints
- **Vanilla JS** - Frontend (no framework)

**Coming (Phase 6+)**:
- **SerpAPI** - Google search integration
- **Tavily** - AI-optimized search
- **Cheerio** - Web scraping
- **Turndown** - HTML to Markdown
- **YouTube API** - Video processing (Phase 7)
- **DALL-E, ElevenLabs** - Creative generation (Phase 8)

## 📊 Project Status

**Current Phase**: Phase 5 Complete ✅  
**Next Phase**: Phase 6 (Research Engine) - Starting Now  
**Timeline**: 2-3 days for Phase 6, then 4-6 weeks for Phases 7-11  
**Development Velocity**: 10-20x normal (AI-assisted)

**Detailed Status**: [PROJECT_STATUS.md](PROJECT_STATUS.md)
2. Log in to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub repository
5. Deploy settings:
   - **Build command**: (leave empty)
   - **Publish directory**: (leave empty or use `/`)
6. Click "Deploy site"

Netlify will automatically redeploy when you push to GitHub!

## Current Status & Roadmap

### ✅ PHASES COMPLETE (v2.0.0)

**Phase 0 - Persona System** ✓
- 12 deeply-researched expert personas loaded and available
- UI indicators showing active persona
- Enhanced logging and debugging tools

**Phase 1 - Agent Memory** ✓
- AgentMemory class (350 lines)
- Short-term memory (last 20 interactions)
- Long-term insights (preferences, topics, project context)
- Memory UI with viewer modal, stats, and export
- Persona-specific memory isolation via localStorage

**Phase 1.5 - Scott's Agent Council** ✓
- **12 Deeply-Researched Expert Personas**:
  - **Core Council** (7 personas): Master Teacher, Technical Architect, Strategist, Theologian, Writer, Analyst, Debugger
  - **Specialty Consultants** (5 personas): Classical Educator, Gen Alpha Expert, UX Designer, Marketing Strategist, Game Designer
  - Research-driven: 30-60 min per persona covering frameworks, voice, problem-solving approaches
  - Scott-specific: Tailored for The Accidental Teacher project, Alaska context, Reformed Baptist worldview

- **UX & Interface**:
  - Resizable AI Panel with proper collapse/expand
  - Quick-switcher UI for on-the-fly persona switching
  - Persona badge system with color coding
  - Markdown formatting with proper styling
  - Message timestamps for conversation context
  - Keyboard shortcuts with visual hints
  - Loading states with typing indicators

**Phase 4 - Frontend UI Integration** ✓
- Modal-based consortium interface (90vw × 90vh)
- Persona selector with 12 checkbox personas
- Mode selector: Panel (12 sequential agents), Consensus, Debate
- Results display with markdown formatting
- Dynamic LLM provider support (Anthropic Claude + OpenAI GPT)
- Color-coded 10-level logging system
- Full integration with multi-agent execution

**Phase 5 - Interactive Conversation Mode** ✓ (NEW!)
- **Conversation Orchestration Engine** (langgraph-conversation.js - 350 lines):
  - Turn-taking architecture with sequential agent responses
  - Smart speaker selection avoiding repetition
  - Persona-specific prompting with speaking style/tendency
  - Support for user interjections at any conversation point
## 🤝 Contributing

This project uses "vibe coding" - AI-assisted rapid development where concepts become code in hours instead of weeks.

**For Developers**:
1. Read [GETTING_STARTED.md](GETTING_STARTED.md)
2. Pick a task from [PHASE_6_IMPLEMENTATION_PLAN.md](PHASE_6_IMPLEMENTATION_PLAN.md)
3. Follow existing patterns in codebase
4. Update documentation as you go
5. Test thoroughly before committing

**For AI Assistants**:
- Read [docs/ai/AI_CONTEXT.md](docs/ai/AI_CONTEXT.md) for full context
- Follow [docs/ai/DAILY_UPDATE_CHECKLIST.md](docs/ai/DAILY_UPDATE_CHECKLIST.md) for updates
- Reference [TECHNICAL_ARCHITECTURE.md](docs/TECHNICAL_ARCHITECTURE.md) for system design

## 📖 Version History

**Current**: v2.0.0 - Phase 5 Complete  
**Next**: v2.1.0 - Phase 6 (Research Engine)

See [CHANGELOG.md](docs/CHANGELOG.md) for detailed version history.

## 📜 License

MIT License - Build whatever you want with this!

## 🙏 Acknowledgments

Built with AI assistance (Claude Sonnet 4.5) using "vibe coding" methodology.

**Development Philosophy**: *"Don't build the Death Star when you need a speeder bike."*

---

**Ready to amplify your cognition?** Start with [GETTING_STARTED.md](GETTING_STARTED.md)!

## Project Philosophy

This project was born from rejecting **5,000+ lines of over-engineered specifications** in favor of a **650-line MVP**. We embrace:

- **Simplicity over features**
- **Real usage over imagined requirements**
- **Documentation as first-class citizen**
- **AI-first development workflow**

The result: A fully functional game level editor built in hours, not months, with documentation more comprehensive than most enterprise applications.
