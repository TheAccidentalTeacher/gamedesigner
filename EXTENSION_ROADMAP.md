# UCAS Browser Extension - Implementation Roadmap

**Start Date**: December 16, 2025  
**Target Launch**: February 1, 2026 (6 weeks)  
**Goal**: Chrome extension with YouTube intelligence + Google Docs integration

---

## 🎯 Phase Overview

**Phase 1** (Weeks 1-3): Browser Extension Foundation  
**Phase 2** (Weeks 4-5): Google Docs Integration  
**Phase 3** (Week 6): Polish & Launch

---

## 📅 Week 1: Extension Setup & YouTube Detection (Dec 16-22)

### Day 1-2: Environment Setup & Research
- [x] Analyze Brisk Teaching (COMPLETE)
- [ ] Install Brisk extension and test extensively
- [ ] Document all Brisk features and UX patterns
- [ ] Set up Chrome Extension development environment
- [ ] Review Chrome Extension Manifest V3 documentation
- [ ] Create project structure for extension

### Day 3-4: Basic Extension Structure
- [ ] Create `extension/` directory structure:
  ```
  extension/
    manifest.json          # Manifest V3 config
    background.js          # Service worker
    content-script.js      # Page injection
    popup.html             # Extension popup
    popup.js               # Popup logic
    widget.html            # Floating widget
    widget.js              # Widget logic
    widget.css             # Widget styling
    icons/                 # Extension icons
    lib/                   # Shared utilities
  ```
- [ ] Write `manifest.json` with required permissions:
  * `activeTab` (current page access)
  * `storage` (save settings)
  * `identity` (OAuth)
  * Host permissions for YouTube, Google Docs
- [ ] Create basic service worker (`background.js`)
- [ ] Test extension loading in Chrome

### Day 5-6: Content Script & Widget UI
- [ ] Implement content script injection
- [ ] Create floating widget UI (bottom-right corner)
- [ ] Add UCAS branding (logo, colors)
- [ ] Implement widget show/hide toggle
- [ ] Add keyboard shortcut (Ctrl+Shift+U)
- [ ] Test on multiple websites

### Day 7: YouTube Detection
- [ ] Implement URL pattern matching for YouTube
- [ ] Extract video ID from URL
- [ ] Detect when video page loads
- [ ] Show YouTube-specific tools in widget
- [ ] Test on various YouTube URLs:
  * `youtube.com/watch?v=...`
  * `youtu.be/...`
  * `youtube.com/embed/...`
  * `youtube.com/playlist?...`

**Week 1 Deliverable**: Extension that loads on any page, shows widget, detects YouTube videos

---

## 📅 Week 2: Backend Connection & Video Tools (Dec 23-29)

### Day 1-2: Connect to Existing UCAS APIs
- [ ] Update `server.cjs` to accept extension requests
- [ ] Add CORS headers for extension origin
- [ ] Implement extension authentication:
  * Generate API key for extension
  * Store in extension storage
  * Send with each request
- [ ] Test connection from extension to server

### Day 3-4: YouTube Video Tools in Extension
- [ ] Add "Summarize Video" button to widget
- [ ] Connect to existing `/api/youtube-transcript` endpoint
- [ ] Connect to existing `/api/video-analyze` endpoint
- [ ] Show loading state during analysis (30-60 seconds)
- [ ] Display results in widget (scrollable)
- [ ] Add "Copy to Clipboard" button
- [ ] Add "Export to Google Docs" button (prep for Week 4)

### Day 5-6: Enhanced Widget UI
- [ ] Create tabbed interface:
  * **Tools** tab (available tools)
  * **Results** tab (generated content)
  * **History** tab (recent generations)
  * **Settings** tab (preferences)
- [ ] Add tool categories:
  * 📹 Video Tools (when on YouTube)
  * 📄 Content Tools (when on article)
  * 💬 Feedback Tools (when on Google Doc)
  * 🎨 Create Tools (always available)
- [ ] Implement tool search/filter
- [ ] Add keyboard navigation

### Day 7: Testing & Bug Fixes
- [ ] Test on multiple YouTube videos
- [ ] Test long videos (2+ hours)
- [ ] Test videos without transcripts (error handling)
- [ ] Test rapid tool switching
- [ ] Performance optimization
- [ ] Fix any bugs found

**Week 2 Deliverable**: Extension can summarize YouTube videos with full UI

---

## 📅 Week 3: More Tools & Context Detection (Dec 30 - Jan 5)

### Day 1-2: Article/Webpage Tools
- [ ] Detect when on article/blog post
- [ ] Add "Summarize Article" tool
- [ ] Add "Create Quiz from Article" tool
- [ ] Add "Create Lesson Plan from Article" tool
- [ ] Connect to existing research API
- [ ] Show article-specific tools in widget

### Day 3-4: PDF & Document Detection
- [ ] Detect PDF in browser
- [ ] Extract PDF content (via existing content extractor)
- [ ] Add "Analyze PDF" tool
- [ ] Add "Create Study Guide from PDF" tool
- [ ] Test with various PDFs

### Day 5-6: Universal Tools (Work Anywhere)
- [ ] Add "Create Lesson Plan" tool (with custom prompt)
- [ ] Add "Generate Quiz" tool (with custom topic)
- [ ] Add "Write Discussion Questions" tool
- [ ] Add "Create Rubric" tool
- [ ] These work without page context (user provides topic)

### Day 7: Polish & Testing
- [ ] Add tool icons/emoji
- [ ] Improve loading states
- [ ] Add progress indicators
- [ ] Error handling for all scenarios
- [ ] End-to-end testing
- [ ] User experience polish

**Week 3 Deliverable**: Extension works on YouTube, articles, PDFs, with 8-10 tools

---

## 📅 Week 4: Google OAuth & Docs API (Jan 6-12)

### Day 1-2: Google OAuth Setup
- [ ] Create Google Cloud Project
- [ ] Enable Google Docs API
- [ ] Enable Google Drive API  
- [ ] Configure OAuth 2.0 consent screen
- [ ] Create OAuth 2.0 credentials (Web application)
- [ ] Add authorized redirect URIs:
  * `https://<extension-id>.chromiumapp.org/`
  * `http://localhost:8888/oauth/callback`
- [ ] Store client ID and secret securely

### Day 3-4: OAuth Flow in Extension
- [ ] Implement `chrome.identity.launchWebAuthFlow()`
- [ ] Handle OAuth callback in extension
- [ ] Store access token in extension storage
- [ ] Implement token refresh logic
- [ ] Add "Sign in with Google" button to settings
- [ ] Show user profile when signed in

### Day 5-6: Google Docs API Integration
- [ ] Create `google-docs-api.js` wrapper
- [ ] Implement document creation:
  ```javascript
  async createDocument(title, content)
  ```
- [ ] Implement content insertion:
  ```javascript
  async insertText(docId, text, index)
  ```
- [ ] Implement formatting (headings, lists, bold)
- [ ] Test creating simple document
- [ ] Test inserting formatted text

### Day 7: Testing & Error Handling
- [ ] Test OAuth flow end-to-end
- [ ] Test token refresh
- [ ] Handle expired tokens
- [ ] Handle API rate limits
- [ ] Handle network errors
- [ ] Error messages for users

**Week 4 Deliverable**: Extension can authenticate with Google and create Docs

---

## 📅 Week 5: Live Document Generation (Jan 13-19)

### Day 1-2: Streaming Document Generator
- [ ] Implement Server-Sent Events (SSE) on backend:
  ```javascript
  // server.cjs
  app.get('/api/generate-stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    // Stream chunks to client
  });
  ```
- [ ] Create streaming client in extension:
  ```javascript
  // extension/streaming.js
  async function generateDocumentLive(tool, params, docId)
  ```
- [ ] Test streaming plain text
- [ ] Test streaming with formatting

### Day 3-4: "Live Creation" Feature
- [ ] Implement "Create in Google Docs" button for each tool
- [ ] On click:
  1. Create blank Google Doc
  2. Open Google Doc in new tab
  3. Start streaming content to doc
  4. User sees text appearing live
- [ ] Add progress indicator in extension
- [ ] Allow user to stop generation
- [ ] Handle errors gracefully

### Day 5-6: Templates & Formatting
- [ ] Create document templates for each tool:
  * Lesson Plan (sections: Objectives, Materials, Procedure, Assessment)
  * Quiz (header, questions, answer key)
  * Rubric (criteria table)
  * Discussion Questions (numbered list)
- [ ] Implement template application
- [ ] Add formatting (headings, bold, lists, tables)
- [ ] Test with all tools

### Day 7: Integration Testing
- [ ] Test end-to-end flow:
  1. Open YouTube video
  2. Click "Create Lesson Plan in Google Docs"
  3. Watch document generate live
  4. Verify formatting is correct
  5. Check auto-save to Drive
- [ ] Test with different tools
- [ ] Test with different content types
- [ ] Performance optimization
- [ ] Bug fixes

**Week 5 Deliverable**: Extension can generate Google Docs live from any tool

---

## 📅 Week 6: Polish, Testing & Launch (Jan 20-26)

### Day 1-2: UI/UX Polish
- [ ] Refine widget design (colors, spacing, fonts)
- [ ] Add animations (smooth transitions)
- [ ] Improve loading states (skeleton screens)
- [ ] Add tooltips for all buttons
- [ ] Keyboard shortcuts documentation
- [ ] Accessibility improvements (ARIA labels)

### Day 3: Documentation
- [ ] Create user guide (with screenshots)
- [ ] Create video tutorial (3-5 minutes)
- [ ] Write Chrome Store description
- [ ] Create promotional images (5 screenshots)
- [ ] Write README for GitHub
- [ ] API documentation for developers

### Day 4: Testing
- [ ] Cross-browser testing (Chrome, Edge)
- [ ] Test on different screen sizes
- [ ] Test with slow internet connection
- [ ] Test error scenarios
- [ ] Security audit
- [ ] Performance profiling

### Day 5: Packaging & Submission
- [ ] Create promotional tile (440x280)
- [ ] Create small tile (128x128)
- [ ] Create screenshots for Chrome Store
- [ ] Write detailed description
- [ ] Set privacy policy URL
- [ ] Submit to Chrome Web Store for review
- [ ] Submit to Edge Add-ons for review

### Day 6: Beta Testing
- [ ] Recruit 10-20 beta testers
- [ ] Create feedback form
- [ ] Send extension to testers (unpacked)
- [ ] Gather feedback
- [ ] Make critical fixes

### Day 7: Launch Preparation
- [ ] Finalize marketing website
- [ ] Write launch blog post
- [ ] Prepare social media posts
- [ ] Set up analytics (usage tracking)
- [ ] Create support email/forum
- [ ] Plan launch announcement

**Week 6 Deliverable**: UCAS Chrome Extension v1.0 published to Chrome Store

---

## 🎉 Launch Day (Feb 1, 2026)

### Morning:
- [ ] Verify extension is live in Chrome Store
- [ ] Test installation from store
- [ ] Publish launch blog post
- [ ] Post to social media (Twitter, Facebook, LinkedIn)
- [ ] Email newsletter to subscribers
- [ ] Post in relevant communities:
  * Classical education forums
  * Homeschool Facebook groups
  * Reformed church education leaders
  * r/Teachers on Reddit

### Afternoon:
- [ ] Monitor Chrome Store reviews
- [ ] Respond to user questions
- [ ] Track analytics (installs, active users)
- [ ] Fix critical bugs if found
- [ ] Celebrate! 🎉

---

## 📊 Success Metrics (First Week)

**Target Goals**:
- 500 installations
- 100 active daily users
- 50 tools generated
- 10 Google Docs created
- 4.5+ star rating (if reviews)
- 3+ testimonials

**Monitoring**:
- Google Analytics for extension
- Server logs for API usage
- Chrome Store stats
- User feedback form responses

---

## 🚀 Post-Launch Roadmap (Feb - Mar 2026)

### Week 7-8: More Tools (Tier 2)
- Math Word Problems
- Science Lab Worksheet
- Inquiry Worksheet
- Teacher Exemplar
- Unit Plan Generator
- Assessment Maker
- Vocabulary Builder
- Graphic Organizer Generator

### Week 9-10: Feedback Tools
- Glow & Grow Feedback
- Next Steps Feedback
- Rubric Criteria Feedback
- Targeted Feedback (inline comments)
- Batch Feedback (multiple documents)

### Week 11-12: Advanced Features
- Text Leveling (adjust reading level)
- Translation (50+ languages)
- Standards Integration (Common Core, NGSS)
- Podcast Generator (text-to-speech)

### Month 4+: Premium Features
- Student-facing AI (Boost alternative)
- Admin Dashboard (for schools)
- Custom tool creation
- Advanced analytics
- Mobile apps (iOS/Android)

---

## 🛠️ Technical Stack

### Extension Frontend:
- **Framework**: Vanilla JavaScript (lightweight, fast)
- **Build Tool**: Webpack (bundling)
- **CSS**: Tailwind CSS (utility-first)
- **Icons**: Lucide Icons
- **State**: LocalStorage + Chrome Storage API

### Backend (Existing):
- **Server**: Node.js + Express (`server.cjs`)
- **AI**: Claude Sonnet 3.5 (Anthropic API)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (OAuth with Google/GitHub)
- **Video**: YouTube Data API v3, youtube-transcript-plus
- **Research**: Tavily API, Brave Search

### New Integrations:
- **Google Docs API**: Document creation and editing
- **Google Drive API**: File storage and management
- **Google OAuth 2.0**: User authentication

---

## 📋 Development Checklist

### Setup:
- [ ] Create `extension/` directory
- [ ] Initialize Git repository
- [ ] Set up Webpack build process
- [ ] Configure ESLint and Prettier
- [ ] Create development documentation

### Core Extension:
- [ ] Manifest V3 configuration
- [ ] Service worker (background.js)
- [ ] Content script injection
- [ ] Floating widget UI
- [ ] Popup UI
- [ ] Options page (settings)

### Features:
- [ ] YouTube video detection
- [ ] Article/webpage detection
- [ ] PDF detection
- [ ] Tool registry system
- [ ] Results display
- [ ] History tracking
- [ ] Settings management

### Google Integration:
- [ ] OAuth 2.0 setup
- [ ] Google Docs API wrapper
- [ ] Google Drive API wrapper
- [ ] Document creation
- [ ] Live streaming generation
- [ ] Template system

### Testing:
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] End-to-end tests (Playwright)
- [ ] Manual testing checklist
- [ ] Beta testing program

### Launch:
- [ ] Chrome Store listing
- [ ] Edge Add-ons listing
- [ ] Marketing website
- [ ] User documentation
- [ ] Video tutorials
- [ ] Launch announcement

---

## 💡 Key Design Decisions

### 1. **Why Manifest V3?**
Manifest V2 is being deprecated by Chrome. V3 is required for new extensions.

### 2. **Why Vanilla JavaScript?**
Lightweight and fast. No framework overhead. Easy to maintain. Quick load time.

### 3. **Why Floating Widget vs Full Page?**
Users want to stay on current page (YouTube video, article). Widget overlays without navigation.

### 4. **Why Google Docs vs PDF Export?**
Live generation is magical. Auto-saves to Drive. Easy to edit. Shareable links. Collaborative.

### 5. **Why YouTube First?**
We already have video intelligence working. Proven demand (Brisk does this). Easy to demo. High impact.

---

## 🎯 Success Factors

### Technical Excellence:
- Fast load time (< 100ms)
- Smooth animations
- Reliable API connections
- Graceful error handling
- Offline support (where possible)

### User Experience:
- One-click access (keyboard shortcut)
- Context-aware tools (right tools for current page)
- Clear loading states (never leave user wondering)
- Helpful error messages (what went wrong, how to fix)
- Beautiful design (classical aesthetic)

### Viral Growth:
- Easy to share (Chrome Store link)
- Word of mouth (teachers tell other teachers)
- Social proof (testimonials, reviews)
- Community engagement (Facebook groups, forums)
- Content marketing (blog posts, tutorials)

---

## 📝 Next Immediate Steps

### This Week (Dec 16-22):
1. **Today**: Test Brisk extension extensively
2. **Tomorrow**: Set up Chrome Extension dev environment
3. **Day 3-4**: Build basic extension structure
4. **Day 5-6**: Create floating widget UI
5. **Day 7**: Implement YouTube detection

### Let's Build! 🚀
