# Phase 1: Agent Memory System - Implementation Plan

**Status**: 📋 PLANNED (Ready to Start)  
**Priority**: 🔥 HIGH - Foundation for Phase 2  
**Estimated Timeline**: 3-4 hours  
**Dependencies**: Phase 0 (✅ Complete)  
**Date**: December 12, 2025

---

## 🎯 Phase 1 Goals

Build a **persistent memory system** where each persona:
- Remembers past conversations
- Builds context over multiple sessions
- References previous decisions and discussions
- Develops evolving understanding of the user's project

**Critical for Phase 2**: Multi-agent systems need individual agent memories to function effectively.

---

## 📊 Architecture Overview

### Memory Structure

```javascript
{
  "agentMemories": {
    "default": {
      "shortTerm": [
        {
          "timestamp": "2025-12-12T10:30:00Z",
          "role": "user",
          "content": "How do I optimize collision detection?",
          "context": {
            "editorState": {...},
            "model": "claude-3-haiku-20240307"
          }
        },
        {
          "timestamp": "2025-12-12T10:30:15Z",
          "role": "assistant",
          "content": "...",
          "summary": "Explained spatial partitioning and quadtrees",
          "tokensUsed": 285
        }
      ],
      "longTerm": {
        "userProfile": {
          "preferences": ["prefers code examples", "working on platformer game"],
          "technicalLevel": "intermediate",
          "learningStyle": "visual + hands-on"
        },
        "projectContext": {
          "gameType": "2D platformer",
          "keyFeatures": ["collision detection", "level design"],
          "challenges": ["performance optimization"]
        },
        "interactionStats": {
          "totalConversations": 47,
          "firstSeen": "2025-12-01T08:00:00Z",
          "lastSeen": "2025-12-12T10:30:15Z",
          "topTopics": ["collision", "level design", "performance"]
        }
      }
    },
    "fellowship": {
      "shortTerm": [...],
      "longTerm": {
        "userProfile": {...},
        "projectContext": {...},
        "characterInsights": {
          "gandalf": "User appreciates strategic planning advice",
          "samwise": "User values encouragement and practical steps",
          "aragorn": "User implements technical suggestions quickly"
        }
      }
    }
  },
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2025-12-12T10:30:15Z",
    "storageType": "localStorage"
  }
}
```

---

## 🔨 Implementation Tasks

### Task 1: Create AgentMemory Class (1 hour)

**File**: `agent-memory.js` (NEW)

**Core Features**:
```javascript
class AgentMemory {
  constructor(personaName) {
    this.personaName = personaName;
    this.shortTermLimit = 20; // Last 20 interactions
    this.storageKey = 'agentMemories';
    this.memory = this.load();
  }
  
  // Core Methods
  load()                              // Load from localStorage
  save()                              // Save to localStorage
  addInteraction(role, content, meta) // Add to short-term
  getRecentContext(limit = 10)        // Get last N for context
  summarizeForPrompt()                // Generate memory section for system prompt
  
  // Long-term Memory
  updateUserProfile(insights)         // Extract user preferences
  updateProjectContext(projectInfo)   // Track project evolution
  recordTopic(topic)                  // Build topic frequency map
  
  // Memory Management
  pruneShortTerm()                    // Keep only last N interactions
  exportMemory()                      // Export for debugging/backup
  clearMemory()                       // Reset (user-initiated)
  getMemoryStats()                    // Usage statistics
}
```

**Key Implementation Details**:
- **Short-term memory**: Raw conversation history (20 interactions)
- **Long-term memory**: Extracted insights, patterns, preferences
- **Auto-summarization**: After N interactions, summarize and compress
- **Topic tracking**: Frequency map of discussed topics
- **Token awareness**: Track token usage to avoid context limits

**Code Structure**:
```javascript
// agent-memory.js
class AgentMemory {
  constructor(personaName) { /* ... */ }
  
  // === STORAGE ===
  load() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return this.initializeMemory();
    const parsed = JSON.parse(stored);
    return parsed[this.personaName] || this.initializeMemory();
  }
  
  save() {
    const allMemories = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    allMemories[this.personaName] = this.memory;
    allMemories.metadata = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(allMemories));
  }
  
  // === SHORT-TERM MEMORY ===
  addInteraction(role, content, metadata = {}) {
    this.memory.shortTerm.push({
      timestamp: new Date().toISOString(),
      role,
      content,
      ...metadata
    });
    this.pruneShortTerm();
    this.save();
  }
  
  pruneShortTerm() {
    if (this.memory.shortTerm.length > this.shortTermLimit) {
      const removed = this.memory.shortTerm.splice(0, 
        this.memory.shortTerm.length - this.shortTermLimit
      );
      // Optionally: extract insights from removed items
      this.extractInsights(removed);
    }
  }
  
  // === CONTEXT GENERATION ===
  summarizeForPrompt() {
    const recent = this.getRecentContext(10);
    const summary = [];
    
    // User profile
    if (this.memory.longTerm.userProfile.preferences.length > 0) {
      summary.push("## What I Know About You");
      summary.push(this.memory.longTerm.userProfile.preferences.join(', '));
    }
    
    // Project context
    if (this.memory.longTerm.projectContext.gameType) {
      summary.push("\n## Your Project");
      summary.push(`Type: ${this.memory.longTerm.projectContext.gameType}`);
      summary.push(`Key Features: ${this.memory.longTerm.projectContext.keyFeatures.join(', ')}`);
    }
    
    // Recent interactions
    if (recent.length > 0) {
      summary.push("\n## Recent Conversations");
      recent.forEach((interaction, i) => {
        summary.push(`${i+1}. ${interaction.role}: ${interaction.content.substring(0, 100)}...`);
      });
    }
    
    return summary.join('\n');
  }
  
  // === LONG-TERM INSIGHTS ===
  extractInsights(interactions) {
    // Simple pattern detection
    interactions.forEach(interaction => {
      if (interaction.role === 'user') {
        // Extract topics (simple keyword matching)
        const keywords = this.extractKeywords(interaction.content);
        keywords.forEach(kw => this.recordTopic(kw));
      }
    });
  }
  
  recordTopic(topic) {
    const topics = this.memory.longTerm.interactionStats.topTopics;
    const existing = topics.find(t => t.topic === topic);
    if (existing) {
      existing.count++;
    } else {
      topics.push({ topic, count: 1 });
    }
    // Keep top 10
    topics.sort((a, b) => b.count - a.count);
    if (topics.length > 10) topics.length = 10;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AgentMemory;
}
```

**File Size**: ~200-300 lines

---

### Task 2: Backend Integration (1 hour)

**File**: `netlify/functions/chat.js` (MODIFY)

**Changes**:

1. **Import AgentMemory** (if using Node.js module system):
```javascript
// For serverless environment, inline the class or use require
const AgentMemory = require('../../agent-memory.js');
```

2. **Load Memory in buildSystemPrompt**:
```javascript
async function buildSystemPrompt(editorState, enableImages, personaName) {
  // ... existing persona loading code ...
  
  // NEW: Load agent memory
  const memory = new AgentMemory(personaName);
  const memoryContext = memory.summarizeForPrompt();
  
  return `${personaContent}

${memoryContext ? '## Your Memory\n' + memoryContext : ''}

## Current Editor State
${JSON.stringify(editorState, null, 2)}

## Additional Context
- Image generation: ${enableImages ? 'ENABLED' : 'DISABLED'}`;
}
```

3. **Save Interactions After Response**:
```javascript
// In main handler, after successful API response
exports.handler = async (event, context) => {
  // ... existing code ...
  
  // After getting response from API
  const { persona, messages } = parsedBody;
  const memory = new AgentMemory(persona || 'default');
  
  // Save user message
  const userMessage = messages[messages.length - 1];
  memory.addInteraction('user', userMessage.content, {
    editorState: editorState,
    timestamp: new Date().toISOString()
  });
  
  // Save assistant response
  memory.addInteraction('assistant', responseText, {
    model: model,
    tokensUsed: response.usage.output_tokens
  });
  
  // Return response as normal
  return { statusCode: 200, headers, body: JSON.stringify(response) };
};
```

**Challenge**: Serverless functions are stateless. Options:
- **Option A**: Use frontend (browser localStorage) - Simpler, works immediately
- **Option B**: Use backend database - More robust, requires setup

**Phase 1 Decision**: Use **localStorage (Option A)** for speed. Can migrate to database later.

---

### Task 3: Frontend Memory Management (1 hour)

**File**: `editor.js` (MODIFY)

**Changes**:

1. **Load memory on page init**:
```javascript
initializeAIPanel() {
  this.setupAIPanelListeners();
  this.loadAIConfig();
  
  // NEW: Initialize memory display
  this.updateMemoryIndicator();
  
  const config = JSON.parse(localStorage.getItem('ai_config') || '{}');
  this.updatePersonaIndicator(config.persona || 'default');
  
  console.log('✓ AI Panel initialized');
}

updateMemoryIndicator() {
  const config = loadAIConfig();
  const persona = config.persona || 'default';
  const memory = new AgentMemory(persona);
  const stats = memory.getMemoryStats();
  
  // Display memory count in UI (optional)
  console.log(`🧠 [Memory] ${stats.interactionCount} conversations stored`);
}
```

2. **Save interactions locally** (browser-side backup):
```javascript
async sendAIMessage(userMessage) {
  // ... existing code ...
  
  // NEW: Save to memory locally (immediate feedback)
  const config = this.loadAIConfig();
  const memory = new AgentMemory(config.persona || 'default');
  
  memory.addInteraction('user', userMessage, {
    editorState: this.getEditorState(),
    timestamp: new Date().toISOString()
  });
  
  // After receiving response
  memory.addInteraction('assistant', assistantResponse, {
    model: config.model,
    tokensUsed: responseData.usage?.output_tokens
  });
  
  this.updateMemoryIndicator();
}
```

3. **Add Memory UI Controls**:
- "View Memory" button in AI Settings
- Memory stats display
- "Clear Memory" button

---

### Task 4: Memory UI (1 hour)

**File**: `index.html` (MODIFY)

**Add Memory Section to AI Settings Modal**:

```html
<!-- In AI Settings Modal, after persona dropdown -->
<div class="form-group">
    <label>Agent Memory</label>
    <div class="memory-stats" id="memory-stats">
        <p><strong>Conversations:</strong> <span id="memory-count">0</span></p>
        <p><strong>Topics:</strong> <span id="memory-topics">None</span></p>
        <p><strong>Since:</strong> <span id="memory-since">Never</span></p>
    </div>
    <div class="button-group">
        <button id="view-memory" class="btn btn-secondary">👁️ View Memory</button>
        <button id="clear-memory" class="btn btn-danger">🗑️ Clear Memory</button>
    </div>
</div>
```

**Add Memory Viewer Modal**:

```html
<!-- Memory Viewer Modal -->
<div id="memory-modal" class="modal" style="display: none;">
    <div class="modal-content" style="max-width: 800px;">
        <h2>🧠 Agent Memory - <span id="memory-persona-name"></span></h2>
        
        <div class="memory-section">
            <h3>Short-Term Memory (Recent Conversations)</h3>
            <div id="memory-short-term" class="memory-list"></div>
        </div>
        
        <div class="memory-section">
            <h3>Long-Term Insights</h3>
            <div id="memory-long-term">
                <h4>User Profile</h4>
                <ul id="memory-profile"></ul>
                
                <h4>Project Context</h4>
                <ul id="memory-project"></ul>
                
                <h4>Top Topics</h4>
                <ul id="memory-topics-list"></ul>
            </div>
        </div>
        
        <div class="modal-actions">
            <button id="export-memory" class="btn btn-secondary">📥 Export</button>
            <button id="close-memory-modal" class="btn btn-primary">Close</button>
        </div>
    </div>
</div>
```

**Add CSS** (in `<style>` or separate file):

```css
.memory-stats {
    background: #2a2a2a;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;
}

.memory-stats p {
    margin: 4px 0;
    font-size: 0.9em;
}

.memory-section {
    margin: 20px 0;
}

.memory-list {
    max-height: 300px;
    overflow-y: auto;
    background: #2a2a2a;
    padding: 12px;
    border-radius: 4px;
}

.memory-item {
    margin: 8px 0;
    padding: 8px;
    background: #333;
    border-radius: 4px;
    border-left: 3px solid #4CAF50;
}

.memory-item.user {
    border-left-color: #2196F3;
}

.button-group {
    display: flex;
    gap: 8px;
}

.btn-danger {
    background: #f44336;
}

.btn-danger:hover {
    background: #d32f2f;
}
```

**JavaScript Event Handlers** (in `editor.js`):

```javascript
// In setupAIPanelListeners() or similar
document.getElementById('view-memory').addEventListener('click', () => {
    this.showMemoryViewer();
});

document.getElementById('clear-memory').addEventListener('click', () => {
    if (confirm('Clear all memory for this persona? This cannot be undone.')) {
        const config = this.loadAIConfig();
        const memory = new AgentMemory(config.persona || 'default');
        memory.clearMemory();
        this.updateMemoryStats();
        this.updateStatus('Memory cleared');
    }
});

showMemoryViewer() {
    const config = this.loadAIConfig();
    const memory = new AgentMemory(config.persona || 'default');
    const memoryData = memory.exportMemory();
    
    // Populate modal
    document.getElementById('memory-persona-name').textContent = config.persona || 'default';
    
    // Short-term
    const shortTermDiv = document.getElementById('memory-short-term');
    shortTermDiv.innerHTML = memoryData.shortTerm.map(item => `
        <div class="memory-item ${item.role}">
            <strong>${item.role}:</strong> ${item.content.substring(0, 200)}...
            <br><small>${new Date(item.timestamp).toLocaleString()}</small>
        </div>
    `).join('');
    
    // Long-term insights
    const profileList = document.getElementById('memory-profile');
    profileList.innerHTML = memoryData.longTerm.userProfile.preferences.map(p => 
        `<li>${p}</li>`
    ).join('');
    
    // Show modal
    document.getElementById('memory-modal').style.display = 'flex';
}
```

---

## 🧪 Testing Plan

### Test 1: Memory Persistence
1. Start fresh conversation
2. Ask 3-5 questions
3. Refresh page
4. Ask related question
5. ✅ Agent should reference previous conversation

### Test 2: Persona-Specific Memory
1. Use Default persona, discuss topic A
2. Switch to Fellowship persona, discuss topic B
3. Switch back to Default
4. ✅ Should remember topic A, not topic B

### Test 3: Memory UI
1. Open AI Settings
2. Check memory stats (conversation count)
3. Click "View Memory"
4. ✅ Should show conversation history
5. Click "Clear Memory"
6. ✅ Stats should reset to 0

### Test 4: Context Integration
1. Have conversation about "collision detection"
2. Later ask "how do I improve what we discussed?"
3. ✅ Agent should reference collision detection without being told

### Test 5: Token Limits
1. Have 30+ message conversation
2. Check that old messages are pruned
3. ✅ Should keep only last 20 interactions
4. ✅ Should extract insights before pruning

---

## ⚠️ Potential Issues & Solutions

### Issue 1: localStorage Size Limits
**Problem**: Browser localStorage limited to ~5-10MB  
**Solution**: 
- Aggressive pruning (keep last 20 interactions)
- Compress old data
- Move to IndexedDB if needed (Phase 1.5)

### Issue 2: Token Context Limits
**Problem**: Including all memory might exceed model context  
**Solution**:
- Summarize aggressively
- Include only relevant recent context
- Use memory.summarizeForPrompt() with smart filtering

### Issue 3: Serverless Statelessness
**Problem**: Each function call is independent  
**Solution**: 
- Phase 1 uses browser localStorage (client-side persistence)
- Phase 2 can add backend database if needed

### Issue 4: Memory Between Devices
**Problem**: localStorage is per-browser  
**Solution**:
- Export/Import memory feature
- Future: Backend sync (requires auth)

---

## 📏 Success Criteria

Phase 1 is complete when:

- ✅ AgentMemory class implemented and tested
- ✅ Memory persists across page reloads
- ✅ Each persona has separate memory
- ✅ Memory context appears in system prompts
- ✅ Memory UI shows stats and allows viewing
- ✅ Clear memory function works
- ✅ Agent responses reference past conversations
- ✅ No performance degradation (response time < 5s)
- ✅ No localStorage quota exceeded errors
- ✅ All 5 test cases pass

---

## 📦 Deliverables

**New Files**:
1. `agent-memory.js` (200-300 lines) - Core memory system
2. `PHASE_1_VERIFICATION.md` (testing checklist)

**Modified Files**:
1. `index.html` - Memory UI elements
2. `editor.js` - Memory integration, event handlers
3. `netlify/functions/chat.js` - Memory loading/saving
4. `styles.css` (or inline) - Memory UI styling

**Documentation**:
1. Memory architecture diagram
2. API documentation for AgentMemory class
3. User guide for memory features

---

## 🚀 Implementation Order

**Recommended Sequence**:

1. **Hour 1**: Build `AgentMemory` class
   - Core storage methods
   - Short-term memory management
   - Basic summarization

2. **Hour 2**: Frontend integration
   - Load memory on init
   - Save interactions locally
   - Basic console logging

3. **Hour 3**: Backend integration
   - Modify `buildSystemPrompt()`
   - Test memory context in responses

4. **Hour 4**: UI polish
   - Memory viewer modal
   - Stats display
   - Clear memory button
   - Testing and debugging

---

## 🎯 Ready to Start?

**Prerequisites Met**:
- ✅ Phase 0 complete
- ✅ Persona system working
- ✅ localStorage available
- ✅ Development environment ready

**Next Action**: 
```bash
# Start implementation
cd "c:\Users\scoso\WEBSITES\Game Editor"
# Create agent-memory.js
# Follow Task 1 implementation plan
```

---

**Created**: December 12, 2025  
**Status**: 📋 READY TO START  
**Estimated Time**: 3-4 hours  
**Complexity**: Medium  
**Risk**: Low (localStorage is well-supported)
