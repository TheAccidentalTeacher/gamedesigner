# 🚀 SPRINT 4 QUICK START GUIDE
## Frontend UI Integration for Multi-Agent Orchestration

**Duration**: 5-7 days
**Start Date**: December 14, 2025
**Goal**: Build and integrate multi-agent UI components
**Status**: ✅ Ready to begin

---

## 📋 Before You Start

### Prerequisites Check
- [x] Phase 2 backend complete (backend API working)
- [x] `langgraph-agents.js` tested and validated
- [x] `/api/multi-agent` endpoint functional
- [x] `MultiAgentClient` library ready
- [x] Development environment set up (npm install, .env configured)

### Start Dev Server
```bash
cd "C:\Users\scoso\WEBSITES\Game Editor"
npm run dev
# Server runs at http://localhost:8888
# API available at http://localhost:8888/api/multi-agent
```

---

## 🎯 Sprint 4 Tasks (Priority Order)

### Task 1: Create HTML Structure (30 min)
**File**: `index.html` (modify AI panel section)

**Add**:
```html
<!-- Multi-Agent Section in AI Panel -->
<div id="multi-agent-section" class="section">
  <!-- Mode Selector -->
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

  <!-- Persona Selector -->
  <div class="multi-agent-persona-selector">
    <h3>Select Personas</h3>
    <div class="persona-categories">
      <div class="category">
        <h4>Core Council</h4>
        <label><input type="checkbox" value="master-teacher"> 👨‍🏫 Master Teacher</label>
        <label><input type="checkbox" value="strategist"> 📊 Strategist</label>
        <label><input type="checkbox" value="theologian"> ⛪ Theologian</label>
        <label><input type="checkbox" value="classical-educator"> 📖 Classical Educator</label>
      </div>
      <div class="category">
        <h4>Specialists</h4>
        <label><input type="checkbox" value="technical-architect"> 🏗️ Technical Architect</label>
        <label><input type="checkbox" value="writer"> ✍️ Writer</label>
        <label><input type="checkbox" value="analyst"> 🔬 Analyst</label>
        <label><input type="checkbox" value="debugger"> 🐛 Debugger</label>
        <label><input type="checkbox" value="gen-alpha-expert"> 🎮 Gen-Alpha Expert</label>
        <label><input type="checkbox" value="ux-designer"> 🎨 UX Designer</label>
        <label><input type="checkbox" value="marketing-strategist"> 📢 Marketing Strategist</label>
        <label><input type="checkbox" value="game-designer"> 🎯 Game Designer</label>
      </div>
    </div>
  </div>

  <!-- Input Area -->
  <div class="multi-agent-input-area">
    <textarea class="question-input" placeholder="Ask your question..." rows="4"></textarea>
    <div class="input-controls">
      <span class="char-count">0 / 2000</span>
      <button class="execute-btn" disabled>▶️ Execute Workflow</button>
    </div>
  </div>

  <!-- Results Display -->
  <div class="multi-agent-results"></div>
</div>
```

**Reference**: See `SPRINT_4_UI_INTEGRATION_PLAN.md` (Section 2) for full details

---

### Task 2: Create CSS Styling (1-2 hours)
**File**: `style.css` (add multi-agent styles)

**Add** (copy from `SPRINT_4_UI_INTEGRATION_PLAN.md` Section 3):
- Mode selector styles
- Persona selector styles  
- Input area styles
- Results display styles
- Animation styles
- Responsive design styles

**Key Classes**:
```css
.multi-agent-mode-selector { ... }
.mode-btn { ... }
.mode-btn.active { ... }
.multi-agent-persona-selector { ... }
.persona-categories { ... }
.multi-agent-input-area { ... }
.multi-agent-results { ... }
.response-card { ... }
.loading-spinner { ... }
```

**Reference**: See `SPRINT_4_UI_INTEGRATION_PLAN.md` (Section 3)

---

### Task 3: Create JavaScript Controller (2-3 hours)
**File**: `multi-agent-ui.js` (NEW - create this file)

**Key Code**:
```javascript
// Import client library
import MultiAgentClient from './multi-agent-client.js';

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

    // Question input
    document.querySelector('.question-input').addEventListener('input', 
      (e) => this.updateCharCount(e.target.value));
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

  updateCharCount(text) {
    const count = text.length;
    document.querySelector('.char-count').textContent = `${count} / 2000`;
    document.querySelector('.execute-btn').disabled = count === 0 || this.isLoading;
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
      console.error('Workflow error:', error);
    } finally {
      this.setLoading(false);
    }
  }

  displayResults(result) {
    const resultsHTML = this.formatResults(result);
    document.querySelector('.multi-agent-results').innerHTML = resultsHTML;
  }

  formatResults(result) {
    // Build HTML for results
    return `
      <div class="synthesis-section">
        <h3>📊 Synthesis</h3>
        <div class="synthesis-content">${this.formatMarkdown(result.synthesis)}</div>
      </div>
      <div class="individual-responses">
        <h3>Individual Perspectives</h3>
        ${result.responses.map(r => `
          <div class="response-card">
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
    if (savedMode) this.selectMode(savedMode);
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

export default MultiAgentUIController;
```

**Reference**: See `SPRINT_4_UI_INTEGRATION_PLAN.md` (Section 4)

---

### Task 4: Import and Initialize (15 min)
**File**: `index.html` (add script import)

**Add** to `<head>` or before `</body>`:
```html
<script type="module">
  import MultiAgentUIController from './multi-agent-ui.js';
</script>
```

**Or** add to existing script section if present.

---

### Task 5: Test End-to-End (1-2 hours)
**Tests**:
1. [ ] Mode selector buttons work (switch between modes)
2. [ ] Persona checkboxes can be checked/unchecked
3. [ ] Question input updates character count
4. [ ] Execute button enables/disables correctly
5. [ ] Click Execute → Loading state appears
6. [ ] Wait for API response → Results display
7. [ ] Results show synthesis + individual responses
8. [ ] Persona icons display correctly
9. [ ] Local storage saves mode preference
10. [ ] Works on mobile (responsive)

**Test Commands**:
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Keep watching for file changes
# (VS Code should auto-refresh browser)

# Terminal 3 (optional): Monitor API calls
# Check browser DevTools Network tab
```

---

### Task 6: Polish & Optimization (1 hour)
- [ ] Responsive design tested on mobile
- [ ] Loading animations smooth
- [ ] Error messages helpful
- [ ] Performance optimized
- [ ] Accessibility check (tab navigation, screen readers)
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)

---

## 🔧 Development Workflow

### 1. Set Up
```bash
cd "C:\Users\scoso\WEBSITES\Game Editor"
npm install
npm run dev
```

### 2. Make Changes
- Edit `index.html` for HTML
- Edit `style.css` for styles  
- Create/edit `multi-agent-ui.js` for JavaScript

### 3. Test
- Browser auto-refreshes on save (if configured)
- Check DevTools for errors
- Run manual tests from checklist above

### 4. Debug
```javascript
// Add console logging
console.log('Debug info:', variable);

// Check API responses in DevTools → Network tab
// Check browser console for JS errors
// Check page for HTML/CSS issues
```

### 5. Commit
```bash
git add -A
git commit -m "Sprint 4: UI Integration - Components, styling, controller"
git push origin main
```

---

## 📚 Reference Documentation

| Document | Purpose | Size |
|----------|---------|------|
| `SPRINT_4_UI_INTEGRATION_PLAN.md` | Complete specifications | 600+ lines |
| `multi-agent-client.js` | API client code | 108 lines |
| `netlify/functions/multi-agent.js` | API endpoint | 145 lines |
| `langgraph-agents.js` | Core orchestration | 726 lines |
| `PHASE_2_COMPLETION_SUMMARY.md` | Architecture overview | 400+ lines |

---

## ✅ Definition of Done

**Sprint 4 is complete when**:
- [x] All 5 components built and styled
- [x] All event handlers connected and working
- [x] API integration tested end-to-end
- [x] All three modes work (panel, consensus, debate)
- [x] Results display correctly
- [x] Loading states visible and smooth
- [x] Error handling works
- [x] Mobile responsive
- [x] No console errors
- [x] Documentation updated
- [x] Code committed to git

---

## 🐛 Common Issues & Solutions

### Issue: "MultiAgentClient is not defined"
**Solution**: Import it in multi-agent-ui.js:
```javascript
import MultiAgentClient from './multi-agent-client.js';
```

### Issue: API returns 404
**Solution**: Make sure dev server is running:
```bash
npm run dev
```

### Issue: Styles not applying
**Solution**: 
1. Check class names match between HTML and CSS
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check CSS file path in index.html

### Issue: Results don't display
**Solution**:
1. Check browser console for JS errors
2. Check Network tab for API response
3. Verify API endpoint URL: `http://localhost:8888/api/multi-agent`

---

## 🚀 Deployment (Post-Testing)

### When Ready for Production:
```bash
# 1. Test locally thoroughly
npm run dev
# ... run through all manual tests ...

# 2. Commit to git
git add -A
git commit -m "Sprint 4 Complete: Multi-Agent UI Integration

- Built 5 major UI components
- Integrated with backend API
- All three modes functional
- Mobile responsive
- Full end-to-end testing complete
- Ready for production deployment"

# 3. Push to Netlify
git push origin main

# 4. Verify deployment
# Check: https://yourdomain.netlify.app
# Test: /api/multi-agent endpoint
# Monitor: Netlify Functions logs
```

---

## 📞 Need Help?

1. **API Not Working?**
   - Check that dev server is running: `npm run dev`
   - Check `.env` file has API keys
   - Check DevTools Network tab for 500 errors
   - Review `netlify/functions/multi-agent.js`

2. **Styles Not Working?**
   - Check `style.css` has all classes
   - Clear browser cache
   - Check for CSS syntax errors
   - Review `SPRINT_4_UI_INTEGRATION_PLAN.md` Section 3

3. **JavaScript Errors?**
   - Check DevTools Console
   - Review `multi-agent-ui.js` implementation
   - Check HTML element IDs/classes match
   - Review `SPRINT_4_UI_INTEGRATION_PLAN.md` Section 4

4. **Questions About Architecture?**
   - Review `PHASE_2_COMPLETION_SUMMARY.md`
   - Check git commit history
   - Review existing code in `langgraph-agents.js`

---

## 📅 Timeline

**Day 1-2**: HTML + CSS (Tasks 1-2)
**Day 2-3**: JavaScript Controller (Task 3)
**Day 3-4**: Integration & Testing (Tasks 4-5)
**Day 4-5**: Polish & Optimization (Task 6)
**Day 5**: Final testing & deployment prep

---

## ✨ Success Looks Like

When Sprint 4 is complete:

```
🎉 SPRINT 4 COMPLETE 🎉

✅ Mode Selector: Users can choose panel, consensus, or debate
✅ Persona Selector: Users can pick which experts participate
✅ Input Area: Users can ask questions with character count
✅ Results Display: Results show synthesis and individual perspectives
✅ Loading State: Clear feedback during execution
✅ Error Handling: Helpful error messages
✅ Mobile: Works on all devices
✅ Performance: Sub-30 second responses
✅ Polish: Professional appearance

🚀 PHASE 2 COMPLETE - SYSTEM READY FOR PRODUCTION
```

---

**Status**: ✅ Ready to begin Sprint 4
**Start Date**: December 14, 2025
**Estimated Duration**: 5-7 days
**Priority**: High (completes Phase 2)

Good luck! 🚀

---

*For detailed specifications, see `SPRINT_4_UI_INTEGRATION_PLAN.md`*
*For architecture overview, see `PHASE_2_COMPLETION_SUMMARY.md`*
*For current status, see `PROJECT_STATUS.md`*
