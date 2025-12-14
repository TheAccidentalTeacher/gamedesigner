# Sprint 4: Frontend UI Integration
## Multi-Agent Orchestration User Interface

**Status**: 📋 PLANNED
**Target**: December 20-27, 2025
**Goal**: Integrate multi-agent orchestration into Game Editor UI

---

## Overview

Sprint 4 builds the user-facing components for multi-agent orchestration, allowing editors to use panel discussions, consensus voting, and debates directly within the AI panel interface. This completes the Phase 2 implementation.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│   Game Editor UI (index.html)               │
├─────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐ │
│  │  AI Panel (existing)                   │ │
│  ├────────────────────────────────────────┤ │
│  │  New: Multi-Agent Interface            │ │
│  │  ├─ Mode Selector                      │ │
│  │  ├─ Persona Selector                   │ │
│  │  ├─ Input Area                         │ │
│  │  └─ Results Display                    │ │
│  └────────────────────────────────────────┘ │
│           ↓                                   │
│  MultiAgentClient (multi-agent-client.js)   │
│           ↓                                   │
│  /api/multi-agent (Netlify Function)        │
│           ↓                                   │
│  LangGraph Orchestration (langgraph-agents) │
│           ↓                                   │
│  12 Expert Personas                         │
└─────────────────────────────────────────────┘
```

---

## UI Components

### 1. Mode Selector
**Component**: MultiAgentModeSelector

**Features**:
- Three buttons: Panel, Consensus, Debate
- Visual feedback for selected mode
- Icons/emojis for clarity
- Keyboard shortcuts (P, C, D)

**HTML Structure**:
```html
<div class="multi-agent-mode-selector">
  <button class="mode-btn panel-btn" data-mode="panel">
    📋 Panel Discussion
  </button>
  <button class="mode-btn consensus-btn" data-mode="consensus">
    🗳️ Consensus Voting
  </button>
  <button class="mode-btn debate-btn" data-mode="debate">
    💬 Debate
  </button>
</div>
```

### 2. Persona Selector
**Component**: MultiAgentPersonaSelector

**Features**:
- Checkbox list of all 12 personas
- "Select All" / "Clear All" buttons
- Search/filter functionality
- Visual persona badges with colors
- Personas grouped by category (Core Council vs Specialists)

**HTML Structure**:
```html
<div class="multi-agent-persona-selector">
  <h3>Select Personas</h3>
  <div class="persona-categories">
    <div class="category core-council">
      <h4>Core Council</h4>
      <div class="persona-list">
        <label>
          <input type="checkbox" value="master-teacher">
          👨‍🏫 Master Teacher
        </label>
        <!-- ... -->
      </div>
    </div>
    <div class="category specialists">
      <h4>Specialists</h4>
      <div class="persona-list">
        <!-- ... -->
      </div>
    </div>
  </div>
</div>
```

### 3. Input Area
**Component**: MultiAgentInputArea

**Features**:
- Large textarea for question input
- Character count display
- Execute/Send button
- Loading spinner during execution
- Quick-question templates/suggestions

**HTML Structure**:
```html
<div class="multi-agent-input-area">
  <textarea 
    class="question-input" 
    placeholder="Ask your question..."
    rows="4"
  ></textarea>
  <div class="input-controls">
    <span class="char-count">0 / 2000</span>
    <button class="execute-btn" disabled>
      ▶️ Execute Workflow
    </button>
  </div>
</div>
```

### 4. Results Display
**Component**: MultiAgentResultsDisplay

**Features**:
- Synthesis at top (main result)
- Individual persona responses in collapsible cards
- Response timing/metadata
- Copy/export buttons
- Response comparison view
- Animation for response loading

**HTML Structure**:
```html
<div class="multi-agent-results">
  <div class="synthesis-section">
    <h3>Synthesis</h3>
    <div class="synthesis-content">
      <!-- Synthesis result -->
    </div>
  </div>
  
  <div class="individual-responses">
    <h3>Individual Perspectives</h3>
    <div class="response-card" data-persona="technical-architect">
      <header>
        <h4>🏗️ Technical Architect</h4>
        <span class="response-time">2.3s</span>
      </header>
      <div class="response-content">
        <!-- Response content -->
      </div>
      <footer class="response-actions">
        <button class="copy-btn">Copy</button>
        <button class="highlight-btn">Highlight</button>
      </footer>
    </div>
    <!-- ... more response cards -->
  </div>
</div>
```

### 5. Loading State
**Component**: MultiAgentLoadingState

**Features**:
- Animated progress indicator
- Current stage display
- Estimated time remaining
- Cancel button
- Agent execution visualization

**HTML Structure**:
```html
<div class="multi-agent-loading">
  <div class="loading-spinner"></div>
  <div class="loading-info">
    <h3>Orchestrating Agents...</h3>
    <p class="stage">Stage: Persona Selection (1/4)</p>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 25%;"></div>
    </div>
    <p class="est-time">Estimated: 15 seconds</p>
    <button class="cancel-btn">Cancel</button>
  </div>
</div>
```

---

## CSS Styling

### 1. Mode Selector Styles
```css
.multi-agent-mode-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.mode-btn {
  padding: 10px 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.mode-btn:hover {
  border-color: #4285f4;
  background: #f0f7ff;
}

.mode-btn.active {
  border-color: #4285f4;
  background: #4285f4;
  color: white;
}
```

### 2. Persona Selector Styles
```css
.multi-agent-persona-selector {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.persona-categories {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.category h4 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.persona-list label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.persona-list input[type="checkbox"] {
  cursor: pointer;
}
```

### 3. Results Display Styles
```css
.multi-agent-results {
  margin-top: 30px;
}

.synthesis-section {
  background: #f0f7ff;
  border-left: 4px solid #4285f4;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.synthesis-section h3 {
  margin: 0 0 15px 0;
  color: #4285f4;
}

.response-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.response-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-color: #4285f4;
}

.response-card header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.response-card h4 {
  margin: 0;
  font-size: 14px;
}

.response-time {
  font-size: 12px;
  color: #999;
}

.response-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 10px;
}

.response-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.response-actions button {
  padding: 5px 10px;
  font-size: 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.response-actions button:hover {
  background: #f5f5f5;
}
```

### 4. Animation Styles
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.response-card {
  animation: fadeIn 0.3s ease-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top-color: #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.multi-agent-results {
  animation: slideIn 0.3s ease-out;
}
```

---

## JavaScript Implementation

### Main Multi-Agent UI Controller

```javascript
/**
 * MultiAgentUIController
 * Orchestrates UI components and API communication
 */
class MultiAgentUIController {
  constructor() {
    this.client = new MultiAgentClient();
    this.currentMode = 'panel';
    this.selectedPersonas = [];
    this.isLoading = false;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadStoredPreferences();
  }

  setupEventListeners() {
    // Mode selector
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.selectMode(e.target.dataset.mode));
    });

    // Execute button
    document.querySelector('.execute-btn').addEventListener('click', 
      () => this.executeWorkflow());

    // Persona selection
    document.querySelectorAll('.persona-list input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => this.updateSelectedPersonas());
    });
  }

  selectMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    localStorage.setItem('multiAgentMode', mode);
  }

  updateSelectedPersonas() {
    this.selectedPersonas = Array.from(
      document.querySelectorAll('.persona-list input[type="checkbox"]:checked')
    ).map(cb => cb.value);
    localStorage.setItem('multiAgentPersonas', JSON.stringify(this.selectedPersonas));
  }

  async executeWorkflow() {
    const question = document.querySelector('.question-input').value;
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    try {
      this.setLoading(true);
      
      const result = await this.client.executeWorkflow(
        question,
        this.currentMode,
        this.selectedPersonas.length > 0 ? this.selectedPersonas : null
      );

      this.displayResults(result);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      this.setLoading(false);
    }
  }

  displayResults(result) {
    // Format and display results in the UI
    const resultsHTML = this.formatResults(result);
    document.querySelector('.multi-agent-results').innerHTML = resultsHTML;
  }

  formatResults(result) {
    // Build HTML for results display
    return `
      <div class="synthesis-section">
        <h3>📊 Synthesis</h3>
        <div class="synthesis-content">${this.formatMarkdown(result.synthesis)}</div>
      </div>
      <div class="individual-responses">
        <h3>Individual Perspectives</h3>
        ${result.responses.map(r => `
          <div class="response-card" data-persona="${r.persona}">
            <header>
              <h4>${this.getPersonaIcon(r.persona)} ${this.formatPersonaName(r.persona)}</h4>
            </header>
            <div class="response-content">${this.formatMarkdown(r.content)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  setLoading(loading) {
    this.isLoading = loading;
    document.querySelector('.execute-btn').disabled = loading;
    document.querySelector('.execute-btn').textContent = 
      loading ? '⏳ Orchestrating...' : '▶️ Execute Workflow';
  }

  loadStoredPreferences() {
    const savedMode = localStorage.getItem('multiAgentMode');
    if (savedMode) {
      this.selectMode(savedMode);
    }
  }

  getPersonaIcon(personaName) {
    const icons = {
      'master-teacher': '👨‍🏫',
      'technical-architect': '🏗️',
      'strategist': '📊',
      'theologian': '⛪',
      'writer': '✍️',
      'analyst': '🔬',
      'debugger': '🐛',
      'classical-educator': '📖',
      'gen-alpha-expert': '🎮',
      'ux-designer': '🎨',
      'marketing-strategist': '📢',
      'game-designer': '🎯'
    };
    return icons[personaName] || '👤';
  }

  formatPersonaName(personaName) {
    return personaName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  formatMarkdown(content) {
    // Simple markdown formatting (can be enhanced with markdown-it library)
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.multiAgentUI = new MultiAgentUIController();
});
```

---

## Integration with Existing AI Panel

### Modifications to index.html

```html
<!-- Add Multi-Agent Section to AI Panel -->
<div id="ai-panel" class="ai-panel resizable">
  <div class="panel-header">
    <h2>🤖 AI Consortium</h2>
    <button class="close-btn">✕</button>
  </div>
  
  <div class="panel-content">
    <!-- Existing Single-Agent Interface -->
    <div id="single-agent-section" class="section">
      <!-- Current chat interface -->
    </div>
    
    <!-- NEW: Multi-Agent Interface -->
    <div id="multi-agent-section" class="section">
      <div class="tab-selector">
        <button class="tab-btn active" data-tab="single">Single Agent</button>
        <button class="tab-btn" data-tab="multi">Consortium</button>
      </div>
      
      <!-- Multi-Agent UI Components -->
      <div class="multi-agent-mode-selector">
        <!-- Mode buttons here -->
      </div>
      
      <div class="multi-agent-persona-selector">
        <!-- Persona checkboxes here -->
      </div>
      
      <div class="multi-agent-input-area">
        <!-- Input and execute button here -->
      </div>
      
      <div class="multi-agent-results">
        <!-- Results display here -->
      </div>
    </div>
  </div>
</div>
```

---

## Features Priority

### Phase 1 (MVP)
- ✅ Mode selector (panel, consensus, debate)
- ✅ Basic question input
- ✅ Results display (synthesis + individual responses)
- ✅ Execute button
- ✅ Loading state
- ✅ Error handling

### Phase 2
- ✅ Persona selector with checkboxes
- ✅ Response copy/share buttons
- ✅ Persona icons and styling
- ✅ Keyboard shortcuts
- ✅ Local preferences storage

### Phase 3
- ✅ Response comparison view
- ✅ Response highlighting
- ✅ Export to PDF/Markdown
- ✅ Response history/favorites
- ✅ Conversation threading

---

## Testing Strategy

### Unit Tests
- Component rendering
- Event handling
- State management
- API client methods

### Integration Tests
- End-to-end workflow
- API communication
- Result display
- Error handling

### UI Tests
- Responsive design
- Accessibility (a11y)
- Cross-browser compatibility
- Performance

---

## Deployment Checklist

- [ ] All components styled and responsive
- [ ] All event handlers connected
- [ ] API integration tested
- [ ] Error handling implemented
- [ ] Loading states polished
- [ ] Accessibility reviewed
- [ ] Performance optimized
- [ ] Cross-browser tested
- [ ] Mobile responsive
- [ ] Documentation updated

---

## Files to Create/Modify

**Sprint 4 Files**:
- `multi-agent-ui.js` - Main UI controller (NEW)
- `multi-agent-styles.css` - All styling (NEW)
- `index.html` - Add multi-agent section (MODIFIED)
- `SPRINT_4_UI_INTEGRATION.md` - Documentation (NEW)

**Estimated Lines of Code**: 500-700 lines

---

## Success Criteria

✅ **Functional**:
- Users can select mode (panel/consensus/debate)
- Users can input questions
- Results display correctly
- All three modes work end-to-end

✅ **Usable**:
- UI is intuitive and responsive
- Loading states are clear
- Error messages are helpful
- Results are easy to read

✅ **Performant**:
- Page loads quickly
- API responses under 30 seconds
- No memory leaks
- Smooth animations

✅ **Accessible**:
- Keyboard navigation works
- Screen reader compatible
- Color contrast meets WCAG standards
- Mobile responsive

---

## Post-Sprint 4

**Phase 2 Complete**: ✅
- Sprint 1: LangGraph foundation ✅
- Sprint 2: Multi-agent orchestration ✅
- Sprint 3: Backend API ✅
- Sprint 4: Frontend UI ✅

**Next Phases**:
- Phase 3: Advanced Features (memory, persistence, analytics)
- Phase 4: Production Hardening (monitoring, scaling, optimization)
- Phase 5: Expansion (new personas, modes, integrations)

---

## Summary

Sprint 4 transforms the multi-agent system from a backend API into a polished, user-friendly interface. Users will be able to leverage the entire Consortium of expert personas through an intuitive web UI, selecting discussion modes, personas, and questions to generate comprehensive, multi-perspective guidance.

**Timeline**: 5-7 days
**Status**: Ready to begin
**Priority**: High (completes Phase 2)
