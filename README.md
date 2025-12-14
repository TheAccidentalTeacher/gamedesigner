# Universal Game Level Editor

A lightweight, browser-based 2D game level editor that works with any game. Built with pure HTML5, CSS3, and JavaScript - no frameworks, no build process, no dependencies.

## Features

### AI & Personas (v2.0.0 - Phase 0-5 Complete)
- **🎭 Persona System** - 12 deeply-researched expert personas (Master Teacher, Technical Architect, Strategist, Theologian, Writer, Analyst, Debugger, Classical Educator, Gen Alpha Expert, UX Designer, Marketing Strategist, Game Designer)
- **🧠 Agent Memory** - Each persona remembers past conversations, learns preferences, tracks topics
- **💬 Smart Context** - Memory-enhanced responses that reference previous discussions
- **📊 Memory Viewer** - View conversation history, insights, and learned preferences
- **🤖 Multi-Provider AI** - Support for Anthropic Claude (5 models) + OpenAI GPT (5 models)
- **📚 Research-Driven** - Each persona built with 30-60 min domain research, frameworks, voice characteristics
- **🎙️ Live Conversation Mode** - Agents speak in turns, build on each other's ideas, respond to user interjections
- **🎯 Interactive Consortium** - Dedicated modal UI with persona selector, multiple modes, real-time chat display
- **💭 Multi-Agent Orchestration** - LangGraph.js-powered turn-taking with dynamic speaker selection

### Core Editor Features
- **✨ Universal Tooltips** (v1.1.0) - Every UI element has helpful, context-aware tooltips with keyboard shortcuts
- **Load Background Images**: Set your level background from any image file
- **Add Game Assets**: Browse and add multiple sprites/objects to your scene
- **Drag & Drop Positioning**: Click and drag objects to arrange your level
- **Live Property Editing**: Adjust position, size, and rotation in real-time
- **Object Duplication**: Quickly copy objects with Ctrl+D
- **JSON Export**: Clean, game-ready JSON with clipboard copy + file download
- **Project Save/Load**: Save entire projects (including images) for later editing
- **Keyboard Shortcuts**: Fast workflow with built-in shortcuts (discoverable via tooltips!)
- **Grid Visualization**: Visual grid for precise placement

## Usage

### The AI Consortium - Multi-Agent System

The Game Editor now includes a powerful multi-agent AI consortium with 12 expert personas that can be used in three ways:

#### 1️⃣ Panel Mode (Sequential Responses)
All selected agents respond to your question in sequence, each building on previous responses.
- **Best for**: Getting diverse perspectives, educational content, comprehensive coverage
- **Typical time**: 2-3 minutes for 12 agents
- **Output**: Sequential responses from each persona

#### 2️⃣ Debate Mode (Adversarial Discussion)  
Select 2-4 agents to argue positions and find common ground through discussion.
- **Best for**: Understanding different viewpoints, challenging assumptions, exploring pros/cons
- **Typical time**: 1-2 minutes for 2-4 agents
- **Output**: Back-and-forth argumentation with synthesis

#### 3️⃣ Live Conversation Mode (Interactive Turn-Taking)
Watch agents discuss topics naturally, jump in with interjections, request idea expansions.
- **Best for**: Real-time exploration, steering conversations, watching dynamic discussion
- **Typical time**: 5-10 minutes for interactive session
- **Output**: Chat bubbles with suggested actions (Expand, Steer, Continue, Summarize)

**How to Use:**
1. Click the 🤖 button in the Game Editor
2. Select your preferred mode (Panel, Debate, or Live Conversation)
3. Check which personas you want to include
4. Enter your question or topic
5. For Live Conversation: Click suggested actions or type your own input

### Local Development
1. Clone this repository
2. Open `index.html` in your browser (double-click or use a local server)
3. Start editing!

### Online Access
Visit the deployed version at: [your-netlify-url-here]

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Load Background |
| `Ctrl+A` | Add Asset |
| `Ctrl+E` | Export JSON |
| `Ctrl+S` | Save Project |
| `Ctrl+O` | Load Project |
| `Ctrl+D` | Duplicate Selected Object |
| `Arrow Keys` | Move Selected Object (1px) |
| `Shift+Arrows` | Move Selected Object (10px) |
| `Delete` | Delete Selected Object |

## Workflow

1. **Load Background** - Click "Load Background" or press `Ctrl+B` to set your level's background image
2. **Add Assets** - Click "Add Asset" or press `Ctrl+A` to add game objects (sprites, enemies, items, etc.)
3. **Position Objects** - Click to select, drag to move, or use arrow keys for precise placement
4. **Edit Properties** - Use the right panel to adjust X, Y, Width, Height, and Rotation
5. **Export** - Click "Export JSON" or press `Ctrl+E` to get your level data (auto-copies to clipboard)
6. **Save Project** - Click "Save Project" to save everything for later editing

## JSON Output Format

```json
{
  "background": "background.png",
  "objects": [
    {
      "id": "asset_123456",
      "name": "sprite.png",
      "x": 100,
      "y": 150,
      "width": 64,
      "height": 64,
      "rotation": 0
    }
  ]
}
```

## Browser Compatibility

Works in all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Technical Details

- **Pure JavaScript**: No frameworks, no dependencies
- **HTML5 Canvas**: Smooth rendering with requestAnimationFrame
- **FileReader API**: Client-side image loading
- **localStorage**: Project persistence
- **Netlify Ready**: Static files, instant deployment

## Deployment

### Deploy to Netlify via GitHub
1. Push this repository to GitHub
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
  - Idea expansion requests ("expand on Bobby's point")
  - Variable response types: brief, detailed, challenge, expansion
  - Suggested next actions: Continue, Expand, Steer, Summarize
  - Comprehensive stats tracking (execution time, character counts, etc.)

- **API Endpoint** (`/api/conversation`):
  - Accepts: question, selectedPersonas, conversationHistory, userInterjection, expandOnPersona, provider, model
  - Returns: Full conversation history + new messages + suggested actions + stats
  - Error handling with comprehensive logging

- **Interactive UI** (multi-agent-ui.js + style.css):
  - Chat bubble display with agent icons and message types
  - Real-time streaming message rendering
  - User input area with suggested action buttons
  - Conversation history management
  - Color-coded animations and styling
  - Responsive design for all screen sizes

- **Live Conversation Features**:
  - Watch agents discuss topics in turn-taking manner
  - Jump in at any time with user interjections
  - Request idea expansions for deep dives on specific topics
  - See suggested actions for natural conversation flow
  - Variable response lengths (brief quips to detailed explanations)

### 📋 PLANNED

**Phase 6 - Advanced Features** (PLANNED)
- Persistent conversation storage and retrieval
- Branching conversations with decision trees
- Multi-topic discussion flow
- Conversation export (PDF, JSON, Markdown)
- Enhanced memory with conversation tagging

**Phase 7 - Production Deployment** (PLANNED)
- Performance optimization
- Database integration for conversation history
- Multi-user support
- Advanced analytics

## Documentation

### Phase Documentation
- **[PHASE_0_VERIFICATION.md](PHASE_0_VERIFICATION.md)** - ✅ Persona activation & testing
- **[PHASE_1_PLAN.md](PHASE_1_PLAN.md)** - ✅ Memory system architecture

### Persona Guides
- **[personas/README.md](personas/README.md)** - Persona system guide
- **[FELLOWSHIP_GUIDE.md](FELLOWSHIP_GUIDE.md)** - Fellowship multi-character details

### Technical References
- **[CURRENT_STATUS.md](CURRENT_STATUS.md)** - System inventory & status

## Future Enhancements

### Additional Future Features

Potential features based on real-world usage:
- Grid snapping toggle
- Undo/redo system
- Layer management (z-ordering)
- Zoom/pan controls
- Asset library panel with thumbnails
- Multiple export format templates
- Copy/paste objects
- Path waypoint editor
- Collision shape visualization

## Documentation

This project is **epically documented** with AI-first documentation. Every line is explained, every decision is justified, every workflow is documented.

### 📚 Complete Documentation Index

#### For AI Assistants (Start Here!)
- **[AI_CONTEXT.md](docs/ai/AI_CONTEXT.md)** - Complete AI orientation (580 lines)
  - Project philosophy and MVP principles
  - Current state and capabilities
  - Data structures and formats
  - Quick start guide
  - Communication guidelines
  
- **[DAILY_UPDATE_CHECKLIST.md](docs/ai/DAILY_UPDATE_CHECKLIST.md)** - Maintenance protocol
  - Daily update tasks
  - Documentation sync checklist
  - Quality assurance steps

#### Technical Documentation
- **[ARCHITECTURE.md](docs/technical/ARCHITECTURE.md)** - System design (710 lines)
  - High-level architecture diagrams
  - Component overview
  - Data flow and state management
  - Rendering pipeline
  - Event system
  - Design decisions and rationale
  
- **[API_REFERENCE.md](docs/technical/API_REFERENCE.md)** - Complete code docs (1150 lines)
  - GameEditor class documentation
  - Every method with parameters and returns
  - Code examples and usage patterns
  - Data structure definitions
  - Performance notes

#### Workflow Guides
- **[ADDING_FEATURES.md](docs/workflows/ADDING_FEATURES.md)** - Feature implementation (640 lines)
  - Step-by-step feature addition workflow
  - Three complete examples (grid snapping, undo/redo, layers)
  - Code style guidelines
  - Common pitfalls and prevention
  - Testing checklist
  
- **[TESTING_PROTOCOL.md](docs/workflows/TESTING_PROTOCOL.md)** - QA checklist (330 lines)
  - 35-step critical path test
  - Keyboard shortcuts verification
  - Browser compatibility matrix
  - Edge case scenarios
  - Performance benchmarks
  
- **[DEBUGGING_GUIDE.md](docs/workflows/DEBUGGING_GUIDE.md)** - Troubleshooting (460 lines)
  - Browser DevTools guide
  - Common issues with solutions
  - Error message reference
  - Debugging workflow
  - Console tricks and techniques

#### General Documentation
- **[CHANGELOG.md](docs/CHANGELOG.md)** - Version history
  - Semantic versioning
  - Complete feature list
  - Known limitations
  - Design decisions
  
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Known issues
  - Quick fixes
  - Browser-specific issues
  - Performance optimization
  - FAQ

#### Historical Documentation
- **[FELLOWSHIP_GUIDE.md](FELLOWSHIP_GUIDE.md)** - D&D persona system
  - Five character perspectives
  - Party dynamics
  - Sample dialogue
  
- **[AI-ASSISTANT-CHECKLIST.md](AI-ASSISTANT-CHECKLIST.md)** - Quick reference
  - Context loading protocol
  - Party member quick reference
  - Workflow guidance

### 📊 Project Stats

**Code Base:**
- **Backend Functions**: 3 serverless Netlify functions (chat.cjs, multi-agent.cjs, conversation.cjs)
- **Core Files**: index.html, style.css, editor.js
- **AI Modules**: multi-agent-ui.js (350+ lines), multi-agent-client.js, langgraph-conversation.js (350+ lines)
- **Support**: agent-memory.js (memory system), persona definitions

**API Endpoints:**
- `/.netlify/functions/chat` - Single-agent responses
- `/.netlify/functions/multi-agent` - Multi-agent panel/consensus/debate
- `/.netlify/functions/conversation` - Interactive turn-taking conversations
- All endpoints support dynamic LLM provider selection (Anthropic Claude, OpenAI GPT)

**Total Documentation**: 4,900+ lines
- **Code**: ~2,500 lines (HTML, CSS, JavaScript modules)
- **Docs-to-Code Ratio**: 2:1
- **Files Created**: 15+ documentation files
- **Cross-References**: Extensively linked
- **Last Updated**: January 2025 (Phase 5 Complete)

### 🎯 Where to Start

**If you're an AI assistant:**
1. Read [AI_CONTEXT.md](docs/ai/AI_CONTEXT.md) first (12 min)
2. Skim [ARCHITECTURE.md](docs/technical/ARCHITECTURE.md) (15 min)
3. Reference [API_REFERENCE.md](docs/technical/API_REFERENCE.md) as needed

**If you're a developer:**
1. Read this README
2. Open `index.html` in browser
3. Read [ARCHITECTURE.md](docs/technical/ARCHITECTURE.md) for design
4. Reference [API_REFERENCE.md](docs/technical/API_REFERENCE.md) for code

**If you're debugging:**
1. Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) first
2. Follow [DEBUGGING_GUIDE.md](docs/workflows/DEBUGGING_GUIDE.md)
3. Check browser console (F12)

**If you're adding features:**
1. Read [ADDING_FEATURES.md](docs/workflows/ADDING_FEATURES.md)
2. Follow the workflow
3. Update documentation
4. Run [TESTING_PROTOCOL.md](docs/workflows/TESTING_PROTOCOL.md)

---

## License

MIT License - Feel free to use for any project!

## Created With

Built by AI (Claude Sonnet 4.5) with the D&D Fellowship Party:
- **Shadowstep** (Silk) - Marketing & Strategy
- **Skytalon** (Kael) - UX Design
- **Ironpaw** (Bjorn) - Technical Systems
- **Sage** (Lyra) - Game Design
- **The Dungeon Master** - Orchestration

*"Don't build the Death Star when you need a speeder bike."* - The Party

---

## Project Philosophy

This project was born from rejecting **5,000+ lines of over-engineered specifications** in favor of a **650-line MVP**. We embrace:

- **Simplicity over features**
- **Real usage over imagined requirements**
- **Documentation as first-class citizen**
- **AI-first development workflow**

The result: A fully functional game level editor built in hours, not months, with documentation more comprehensive than most enterprise applications.
