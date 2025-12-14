# LangGraph.js Multi-Agent System Implementation Plan

**Status**: 📋 PLANNED  
**Priority**: 🔥 NEXT MAJOR FEATURE  
**Estimated Timeline**: 12-16 hours (3 phases)  
**Dependencies**: LangGraph.js, @langchain/core  
**Current Date**: December 12, 2025

---

## 🎯 Executive Summary

Transform the current **static persona system** into a **living, interactive multi-agent system** where AI personas can:
- Maintain persistent memory across conversations
- Communicate and collaborate with each other
- Participate in orchestrated discussions (panel, debate, consensus)
- Evolve their understanding based on past interactions

**Architecture Choice**: **LangGraph.js** - JavaScript-native framework for stateful agent orchestration, chosen for seamless integration with existing Node.js/browser stack.

---

## 📊 Current State Assessment

### ✅ What's Working (Phase 3 - COMPLETE)

**Persona Infrastructure** (Built, but NOT ACTIVE):
```
personas/
├── default.md          ✓ Created (40 lines) - NOT LOADED BY DEFAULT
├── fellowship.md       ✓ Created (45 lines) - NOT LOADED BY DEFAULT  
├── _TEMPLATE.md        ✓ Created (65 lines) - Template only
└── README.md           ✓ Created (180 lines) - Documentation
```

**Backend Integration** (Built, but INACTIVE):
- ✅ `buildSystemPrompt()` function supports persona loading
- ✅ `fs.readFileSync()` reads persona files from `personas/{name}.md`
- ✅ Special handling for `fellowship` mode (loads FELLOWSHIP_GUIDE.md)
- ✅ Error handling with fallback to default
- ⚠️ **ISSUE**: Personas are NOT currently being used by the live system

**Frontend Integration** (Built, but INACTIVE):
- ✅ Persona dropdown in AI Settings modal (line 148-153 in index.html)
- ✅ `loadAIConfig()` and `saveAIConfig()` handle persona selection
- ✅ `sendAIMessage()` includes persona in request payload
- ⚠️ **ISSUE**: Dropdown exists but personas aren't actually affecting responses

**AI Provider System** (Fully Functional):
- ✅ Multi-provider support (Anthropic Claude + OpenAI GPT)
- ✅ 10 models supported with dynamic parameter handling
- ✅ Custom dev server (server.js, port 8888)
- ✅ Serverless functions (netlify/functions/chat.js, 520+ lines)
- ✅ Environment variables properly configured (.env with 16 API keys)

### 🚨 Critical Discovery

**THE PERSONA SYSTEM IS NOT ACTIVE IN PRODUCTION**

Evidence:
1. **No default persona loaded**: System uses hardcoded conversational prompt
2. **Dropdown not tested**: Frontend has dropdown but no indication it's working
3. **No user feedback**: No indication which persona is active
4. **No memory system**: Each conversation starts fresh
5. **No multi-agent capability**: Only single-agent responses

**Action Required BEFORE Multi-Agent**:
1. ✅ **Phase 0: Activate Basic Personas** (1 hour) - Make current system work
2. ✅ **Phase 1: Agent Memory** (3-4 hours) - Add persistent memory per persona
3. ✅ **Phase 2: Multi-Agent Orchestration** (8-12 hours) - LangGraph.js integration

---

## 🎯 Implementation Phases

### **PHASE 0: Activate & Verify Persona System** (1 hour)
*Prerequisites for everything else*

#### Tasks:
1. **Verify persona loading is working**
   - Test that `buildSystemPrompt()` actually loads persona files
   - Add console logging to confirm persona content is used
   - Verify default.md is loaded when no persona selected

2. **Add UI feedback**
   - Show current active persona in chat panel header
   - Add "(Using: Default Persona)" indicator
   - Visual confirmation that persona is loaded

3. **Test both personas**
   - Test default.md persona responses
   - Test fellowship.md persona responses
   - Verify FELLOWSHIP_GUIDE.md loads for fellowship mode
   - Confirm personality differences are observable

4. **Create verification checklist**
   - [ ] Persona dropdown works
   - [ ] Selection persists across page reloads
   - [ ] Responses match persona personality
   - [ ] Fellowship mode loads all characters
   - [ ] Console logs confirm persona loading

#### Files to Modify:
- `index.html` - Add persona indicator to chat header
- `editor.js` - Add console logging, UI updates
- `netlify/functions/chat.js` - Enhanced logging

#### Success Criteria:
- ✅ Dropdown selection changes AI personality observably
- ✅ User knows which persona is active at all times
- ✅ Console logs confirm persona loading on every request
- ✅ Both personas produce distinct response styles

---

### **PHASE 1: Agent Memory System** (3-4 hours)
*Prerequisite for multi-agent interactions*

#### Goal:
Each persona maintains persistent memory of past conversations, allowing them to:
- Remember previous interactions with the user
- Build context over multiple sessions
- Reference past decisions and discussions
- Develop evolving understanding

#### Architecture:

```javascript
// Memory Structure (localStorage + optional backend)
{
  "agentMemories": {
    "default": {
      "shortTermMemory": [
        {
          "timestamp": "2025-12-12T10:30:00Z",
          "role": "user",
          "content": "How do I optimize collision detection?",
          "summary": "User asked about collision detection optimization"
        },
        {
          "timestamp": "2025-12-12T10:30:15Z",
          "role": "assistant",
          "content": "...",
          "summary": "Explained spatial partitioning and quadtrees"
        }
      ],
      "longTermMemory": {
        "userPreferences": ["prefers code examples", "working on platformer game"],
        "keyTopics": ["collision detection", "level design", "performance"],
        "interactionCount": 47,
        "firstInteraction": "2025-12-01T08:00:00Z",
        "lastInteraction": "2025-12-12T10:30:15Z"
      }
    },
    "fellowship": {
      "shortTermMemory": [...],
      "longTermMemory": {...}
    }
  }
}
```

#### Components:

**1. AgentMemory Class** (`agent-memory.js` - NEW FILE)
```javascript
class AgentMemory {
  constructor(personaName) {
    this.personaName = personaName;
    this.shortTermLimit = 20; // Last 20 interactions
    this.load();
  }
  
  load() {
    // Load from localStorage
  }
  
  save() {
    // Save to localStorage
  }
  
  addInteraction(role, content, summary = null) {
    // Add to short-term memory
  }
  
  getRecentContext(limit = 10) {
    // Get last N interactions for context
  }
  
  updateLongTermMemory(insights) {
    // Update patterns, preferences, key topics
  }
  
  summarizeForPrompt() {
    // Generate memory context for system prompt
  }
}
```

**2. Memory Integration in Backend**
```javascript
// In buildSystemPrompt()
const memory = new AgentMemory(personaName);
const memoryContext = memory.summarizeForPrompt();

const systemPrompt = `
${personaContent}

## Your Memory Context
${memoryContext}

## Current Editor State
${editorContext}
`;
```

**3. Memory Management UI** (index.html)
- "View Memory" button in AI Settings
- Shows recent interactions summary
- "Clear Memory" option per persona
- Memory stats (interactions count, topics)

#### Implementation Steps:

1. **Create AgentMemory class** (1 hour)
   - Basic localStorage persistence
   - Add/retrieve interactions
   - Memory summarization

2. **Integrate with chat backend** (1 hour)
   - Load memory on each request
   - Include memory context in system prompt
   - Save interactions after responses

3. **Build Memory UI** (1 hour)
   - Memory viewer modal
   - Clear memory functionality
   - Memory stats display

4. **Testing & Refinement** (1 hour)
   - Test memory persistence across sessions
   - Verify memory affects responses
   - Test multiple personas maintain separate memories

#### Files to Create/Modify:
- **NEW**: `agent-memory.js` (200-300 lines)
- **MODIFY**: `netlify/functions/chat.js` - Integrate AgentMemory
- **MODIFY**: `index.html` - Add memory UI
- **MODIFY**: `editor.js` - Memory management functions

#### Success Criteria:
- ✅ Each persona remembers past conversations
- ✅ Memory persists across page reloads
- ✅ Memory context influences responses observably
- ✅ Users can view and clear memory
- ✅ Memory doesn't cause token limit issues

---

### **PHASE 2: LangGraph.js Multi-Agent Orchestration** (8-12 hours)
*The main event*

#### Goal:
Enable multiple personas to collaborate on complex questions through orchestrated workflows.

#### Interaction Modes:

**1. Panel Discussion** (Sequential)
```
User: "How should I structure my game's save system?"
    ↓
Orchestrator: Analyzes question → Selects relevant personas
    ↓
Gandalf: "Consider the architecture holistically..."
    ↓
Samwise: "Think about the player's perspective..."
    ↓
Aragorn: "Make it reliable and battle-tested..."
    ↓
Synthesis Agent: Combines perspectives → Final answer
```

**2. Debate Mode** (Multi-turn)
```
User: "Should I use OOP or ECS for my game?"
    ↓
Persona A: "Object-oriented is clearer..."
    ↓
Persona B: "Entity-component is more flexible..."
    ↓
Persona A: "But OOP is easier to debug..."
    ↓
[3 rounds of debate]
    ↓
Moderator: Synthesizes both viewpoints
```

**3. Consensus Mode** (Parallel + Voting)
```
User: "Is this level design balanced?"
    ↓
[All personas analyze simultaneously]
    ↓
Gandalf: 8/10 - "Good flow but..."
Samwise: 9/10 - "Player-friendly and..."
Aragorn: 7/10 - "Needs more challenge..."
    ↓
Consensus Agent: Aggregates scores + reasons
```

#### LangGraph.js Architecture:

```javascript
// State definition
const AgentState = {
  userQuestion: String,
  selectedPersonas: Array<String>,
  personaResponses: Array<{persona, response, timestamp}>,
  synthesizedAnswer: String,
  mode: String // 'panel', 'debate', 'consensus'
};

// Graph definition
import { StateGraph } from "@langchain/langgraph";

const graph = new StateGraph(AgentState)
  // Routing
  .addNode("router", routerAgent)          // Decides which personas + mode
  .addNode("orchestrator", orchestratorAgent) // Manages conversation flow
  
  // Persona agents (dynamically created from personas/*.md)
  .addNode("gandalf", createPersonaAgent("fellowship"))
  .addNode("samwise", createPersonaAgent("fellowship"))
  .addNode("default", createPersonaAgent("default"))
  
  // Synthesis
  .addNode("synthesizer", synthesizerAgent)
  .addNode("moderator", moderatorAgent)
  
  // Define edges based on mode
  .addConditionalEdges("router", routeBasedOnMode)
  .addEdge("orchestrator", ["gandalf", "samwise"]) // Parallel
  .addEdge(["gandalf", "samwise"], "synthesizer")
  .setEntryPoint("router")
  .setFinishPoint("synthesizer")
  .compile();

// Execute
const result = await graph.invoke({
  userQuestion: "How do I optimize my collision detection?",
  selectedPersonas: [],
  mode: "auto" // Let router decide
});
```

#### Implementation Steps:

**Step 1: Install Dependencies** (10 minutes)
```bash
npm install @langchain/langgraph @langchain/core @langchain/anthropic @langchain/openai
```

**Step 2: Create Agent Wrapper** (2 hours)
- `langgraph-agents.js` - NEW FILE (400-500 lines)
- Wrap existing personas as LangGraph agents
- Create agent factory that loads persona files
- Implement state management

**Step 3: Build Orchestrator Agents** (3 hours)
- **Router Agent**: Analyzes question → selects personas + mode
- **Orchestrator Agent**: Manages conversation flow
- **Synthesizer Agent**: Combines multiple perspectives
- **Moderator Agent**: Facilitates debates

**Step 4: Implement Interaction Modes** (2 hours)
- Panel discussion workflow
- Debate workflow with rounds
- Consensus workflow with voting

**Step 5: Backend Integration** (2 hours)
- Create `/api/multi-agent` endpoint
- Integrate with existing chat.js
- Handle streaming responses (show agents as they respond)

**Step 6: Frontend UI** (2 hours)
- Multi-agent mode toggle in settings
- "Who should respond?" persona selector
- Live agent status (Gandalf is typing...)
- Collapsible agent responses
- Final synthesis prominently displayed

**Step 7: Testing & Refinement** (1-2 hours)
- Test all three modes
- Verify persona personalities maintained
- Test memory integration
- Performance optimization

#### Files to Create:

**NEW FILES**:
1. **`langgraph-agents.js`** (400-500 lines)
   - Agent factory
   - State management
   - Graph definitions
   - Workflow implementations

2. **`netlify/functions/multi-agent.js`** (300-400 lines)
   - Multi-agent endpoint
   - LangGraph execution
   - Streaming support

3. **`multi-agent-ui.js`** (200-300 lines)
   - Frontend multi-agent logic
   - Live agent status
   - Response aggregation

**MODIFIED FILES**:
1. **`index.html`**
   - Multi-agent mode UI
   - Agent response containers
   - Settings for mode selection

2. **`editor.js`**
   - Multi-agent API calls
   - Response handling
   - UI updates

3. **`package.json`**
   - Add LangGraph dependencies

#### Success Criteria:
- ✅ Multiple personas can respond to single question
- ✅ Panel discussion shows sequential responses
- ✅ Debate mode creates back-and-forth exchanges
- ✅ Consensus mode aggregates viewpoints
- ✅ Synthesis provides coherent final answer
- ✅ Each persona maintains distinct personality
- ✅ Memory integrates with multi-agent responses
- ✅ UI clearly shows which agent is speaking
- ✅ Performance acceptable (< 30 seconds for full discussion)

---

## 📋 Technical Specifications

### LangGraph.js Integration Details

**Installation**:
```json
// package.json dependencies
{
  "@langchain/langgraph": "^0.2.0",
  "@langchain/core": "^0.3.0",
  "@langchain/anthropic": "^0.3.0",
  "@langchain/openai": "^0.3.0"
}
```

**State Graph Pattern**:
```javascript
import { StateGraph, END } from "@langchain/langgraph";
import { ChatAnthropic } from "@langchain/anthropic";

// Define agent state structure
const AgentState = Annotation.Root({
  question: Annotation<string>,
  responses: Annotation<Array<{persona: string, content: string}>>,
  synthesis: Annotation<string>
});

// Create graph
const workflow = new StateGraph(AgentState)
  .addNode("router", routerNode)
  .addNode("agent1", agentNode1)
  .addNode("agent2", agentNode2)
  .addNode("synthesizer", synthesizerNode)
  .addEdge(START, "router")
  .addConditionalEdges("router", shouldContinue, {
    continue: ["agent1", "agent2"],
    end: END
  })
  .addEdge(["agent1", "agent2"], "synthesizer")
  .addEdge("synthesizer", END);

const app = workflow.compile();
```

**Memory Integration**:
```javascript
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();
const app = workflow.compile({ checkpointer });

// Execute with memory
const config = { configurable: { thread_id: "conversation-123" } };
const result = await app.invoke(input, config);
```

### API Endpoints

**Existing**: `/netlify/functions/chat.js`
- Single-agent responses
- Current persona system
- Memory integration (after Phase 1)

**New**: `/netlify/functions/multi-agent.js`
- Multi-agent orchestration
- LangGraph execution
- Streaming agent responses

### Data Flow

```
User Message (Frontend)
    ↓
Multi-Agent Toggle? 
    ↓ YES
    ↓
/api/multi-agent
    ↓
LangGraph Router Agent
    ↓
[Analyzes question → Selects personas + mode]
    ↓
Orchestrator Agent
    ↓
[Manages workflow based on mode]
    ↓
Persona Agents (Parallel/Sequential)
    ↓
[Each loads persona.md + memory context]
    ↓
AgentMemory System
    ↓
[Adds context from past interactions]
    ↓
LLM API Calls (Anthropic/OpenAI)
    ↓
Responses Stream Back
    ↓
Synthesis Agent
    ↓
[Combines all perspectives]
    ↓
Frontend Display
    ↓
Update UI with all agent responses + synthesis
    ↓
Save to Memory
```

---

## 🎨 UI/UX Design

### Multi-Agent Mode Indicator

```
┌─────────────────────────────────────┐
│  AI Assistant [🤖 Multi-Agent Mode] │
│  Using: Gandalf, Samwise, Aragorn   │
└─────────────────────────────────────┘
```

### Agent Response Display

```
┌─────────────────────────────────────┐
│ 🧙 Gandalf                          │
│ "Consider the architecture..."      │
│ [2s response time]                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🌱 Samwise                          │
│ "From a player's perspective..."    │
│ [1.8s response time]                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 🎯 SYNTHESIS                        │
│ Combining these perspectives:       │
│ [Final combined answer]             │
└─────────────────────────────────────┘
```

### Settings Panel

```
AI Settings
├── Provider: [Anthropic ▼]
├── Model: [claude-sonnet-4-5 ▼]
├── Mode: 
│   ○ Single Agent
│   ● Multi-Agent Discussion
├── Interaction Style:
│   ▼ Panel Discussion (sequential)
│     Debate Mode (back-and-forth)
│     Consensus Building (voting)
└── Active Personas:
    ☑ Gandalf (Wise Architect)
    ☑ Samwise (User Advocate)
    ☑ Aragorn (Practical Warrior)
    ☐ Default (General Assistant)
```

---

## 🧪 Testing Strategy

### Phase 0 Tests (Persona Activation)
- [ ] Dropdown changes active persona
- [ ] Persona indicator shows in UI
- [ ] Response style matches persona
- [ ] Fellowship loads all characters
- [ ] Console logs confirm loading

### Phase 1 Tests (Memory)
- [ ] Memory persists across page reloads
- [ ] Each persona has separate memory
- [ ] Memory context appears in responses
- [ ] "View Memory" shows accurate data
- [ ] "Clear Memory" works correctly
- [ ] Token limits not exceeded with memory

### Phase 2 Tests (Multi-Agent)
- [ ] Panel discussion: Sequential responses
- [ ] Debate mode: Back-and-forth exchanges
- [ ] Consensus mode: Parallel + aggregation
- [ ] Synthesis combines perspectives coherently
- [ ] Each agent maintains personality
- [ ] Memory integrates with multi-agent
- [ ] UI shows agent status clearly
- [ ] Performance < 30s for full discussion
- [ ] Error handling for agent failures
- [ ] Token limits respected per agent

### Integration Tests
- [ ] Single → Multi-agent transition seamless
- [ ] Multi → Single agent transition works
- [ ] Memory syncs across modes
- [ ] All 10 models work with multi-agent
- [ ] Both providers (Anthropic/OpenAI) work
- [ ] Streaming responses display correctly

---

## 📚 Documentation Updates Required

### Files to Update:

1. **README.md**
   - Add multi-agent system to features
   - Update version to v2.0.0
   - Add LangGraph.js to tech stack

2. **docs/technical/ARCHITECTURE.md**
   - Add multi-agent system diagram
   - Document LangGraph integration
   - Explain state management

3. **docs/technical/API_REFERENCE.md**
   - Document AgentMemory class
   - Document multi-agent API endpoint
   - Add LangGraph graph definitions

4. **personas/README.md**
   - Add section on multi-agent interactions
   - Explain how personas collaborate
   - Usage examples for each mode

5. **CHANGELOG.md**
   - Add v2.0.0 with multi-agent system
   - Document all new features
   - Migration guide from Phase 3

### New Documentation:

1. **MULTI_AGENT_GUIDE.md** (NEW)
   - Complete user guide for multi-agent mode
   - Examples of panel, debate, consensus
   - Best practices for orchestration
   - Troubleshooting common issues

2. **LANGGRAPH_TECHNICAL.md** (NEW)
   - Deep dive into LangGraph.js integration
   - Graph definitions and workflows
   - State management patterns
   - Performance optimization

---

## ⚡ Performance Considerations

### Token Usage:
- **Single Agent**: ~2,000-4,000 tokens per request
- **Panel (3 agents)**: ~8,000-12,000 tokens per request
- **Debate (5 rounds)**: ~15,000-20,000 tokens per request
- **Memory Context**: +500-1,000 tokens per agent

### Optimizations:
1. **Parallel execution** where possible (Panel mode)
2. **Response streaming** for perceived speed
3. **Memory summarization** to keep context small
4. **Caching** for persona definitions
5. **Token limits** per agent (e.g., max 1,000 tokens each)

### Cost Estimates (Claude Sonnet 4.5):
- Single agent: ~$0.01 per interaction
- Panel (3 agents): ~$0.04 per interaction
- Debate (5 rounds): ~$0.08 per interaction

---

## 🚀 Deployment Strategy

### Phase 0 (Immediate):
1. Fix persona system in dev environment
2. Test thoroughly on localhost
3. Deploy to Netlify once verified
4. Monitor console logs for issues

### Phase 1 (Week 1):
1. Develop memory system locally
2. Test with multiple personas
3. Deploy to staging branch on Netlify
4. User testing with memory enabled
5. Deploy to production after validation

### Phase 2 (Week 2-3):
1. Develop LangGraph integration locally
2. Test each interaction mode
3. Deploy to staging with feature flag
4. Beta testing with select users
5. Gradual rollout to production
6. Monitor performance and costs

### Feature Flags:
```javascript
// In config
const FEATURE_FLAGS = {
  multiAgentEnabled: true,
  maxConcurrentAgents: 5,
  allowedModes: ['panel', 'debate', 'consensus'],
  memoryEnabled: true
};
```

---

## 🎯 Success Metrics

### Phase 0:
- ✅ Persona dropdown functional
- ✅ Responses match persona style
- ✅ User satisfaction with personality

### Phase 1:
- ✅ Memory recall accuracy > 90%
- ✅ Token usage stays under limits
- ✅ Users report better contextual responses

### Phase 2:
- ✅ Multi-agent discussions feel natural
- ✅ Synthesis quality > single agent
- ✅ Response time < 30 seconds
- ✅ Cost per interaction acceptable
- ✅ User engagement increases

---

## 🔮 Future Enhancements (Post-Phase 2)

1. **Agent Skills/Tools**
   - Agents can manipulate editor directly
   - Load/save files
   - Run code analysis
   - Generate game assets

2. **Custom Agent Creation**
   - UI for creating new personas
   - Template-based agent builder
   - Agent personality testing tool

3. **Agent Learning**
   - Agents improve based on user feedback
   - Long-term memory evolution
   - Personalization per user

4. **Voice Integration**
   - Text-to-speech for agent responses
   - Different voices per persona
   - Speech-to-text for user input

5. **Visual Agent Representation**
   - Avatar/icon for each agent
   - Animation during "thinking"
   - Visual conversation thread

---

## 📞 Support & Resources

### LangGraph.js Documentation:
- **[LANGGRAPH_TECHNICAL_REFERENCE.md](LANGGRAPH_TECHNICAL_REFERENCE.md)** - Complete technical guide with code examples (NEW!)
- Official Docs: https://docs.langchain.com/oss/javascript/langgraph/overview
- Quickstart: https://docs.langchain.com/oss/javascript/langgraph/quickstart
- Persistence: https://docs.langchain.com/oss/javascript/langgraph/persistence
- Examples: https://github.com/langchain-ai/langgraphjs/tree/main/examples/multi_agent
- Discord: LangChain community

### Related Research:
- Anthropic "Building Effective Agents": https://www.anthropic.com/research/building-effective-agents
- Multi-agent patterns and best practices

### Internal Resources:
- This document (LANGGRAPH_MULTIAGENT_PLAN.md)
- personas/README.md
- FELLOWSHIP_GUIDE.md (multi-character example)

---

## ✅ Pre-Implementation Checklist

Before starting Phase 0:
- [ ] All team members have reviewed this plan
- [ ] Existing persona system understood
- [ ] LangGraph.js documentation reviewed
- [ ] Budget approved for API costs
- [ ] Timeline agreed upon

Before starting Phase 1:
- [ ] Phase 0 complete and verified
- [ ] Memory architecture approved
- [ ] Storage strategy decided (localStorage vs. database)

Before starting Phase 2:
- [ ] Phase 1 complete and verified
- [ ] LangGraph.js dependencies installed
- [ ] All interaction modes designed
- [ ] UI mockups approved

---

## 🏁 Next Immediate Steps

1. **Review this plan** with stakeholders (15 min)
2. **Start Phase 0** - Activate persona system (1 hour)
3. **Test personas** thoroughly before moving to Phase 1
4. **Update package.json** with planned dependencies
5. **Create feature branch**: `feature/multi-agent-system`

---

**Created**: December 12, 2025  
**Last Updated**: December 12, 2025  
**Author**: AI Assistant (Claude Sonnet 4.5)  
**Status**: Ready for Implementation 🚀
