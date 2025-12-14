# Phase 6 Implementation Plan: Deep Research Engine

**Project**: Universal Cognitive Amplification System (UCAS)  
**Phase**: 6 - Deep Research Capabilities  
**Status**: 📋 Ready to Implement  
**Duration**: 2-3 days of focused work (with AI assistance)  
**Dependencies**: Phase 5 complete ✅

---

## 🎯 Phase 6 Goal

Transform UCAS into a **world-class research assistant** that:
- Searches multiple sources simultaneously (Google, Scholar, ArXiv, YouTube)
- Extracts and processes content intelligently
- Uses multi-agent analysis for deep insights
- Saves research to memory for future reference
- Exports to multiple formats (Markdown, PDF, citations)

**Target**: Replace Perplexity Pro and Sintra.ai with superior multi-agent research

---

## 📦 What We'll Build (Day-by-Day)

### Day 1: Search Foundation (6-8 hours)

#### Morning: Search Integration (3-4 hours)

**Task 1.1: Set Up Search APIs** (1 hour)
```bash
# Sign up for API keys
1. SerpAPI (https://serpapi.com/) - Google/Bing search
   - Free tier: 100 searches/month
   - Paid: $50/month for 5,000 searches
   
2. Tavily AI (https://tavily.com/) - AI-optimized search
   - Free tier: 1,000 searches/month
   - Paid: $30/month for 10,000 searches

# Install packages
npm install serpapi tavily

# Add to .env
SERP_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
```

**Task 1.2: Create Search Module** (2-3 hours)

File: `research/search-orchestrator.js`

```javascript
import { GoogleSearch } from 'serpapi';
import { TavilyClient } from 'tavily';

/**
 * Orchestrates searches across multiple providers
 */
export class SearchOrchestrator {
  constructor() {
    this.providers = {
      google: new GoogleSearch(process.env.SERP_API_KEY),
      tavily: new TavilyClient(process.env.TAVILY_API_KEY)
    };
  }

  /**
   * Search multiple providers in parallel
   */
  async search(query, options = {}) {
    const {
      providers = ['google', 'tavily'],
      maxResults = 10,
      includeAcademic = false
    } = options;

    console.log(`🔍 Searching for: "${query}"`);
    console.log(`📡 Providers: ${providers.join(', ')}`);

    // Execute searches in parallel
    const searchPromises = providers.map(provider =>
      this.searchProvider(provider, query, maxResults)
    );

    const results = await Promise.all(searchPromises);

    // Flatten and deduplicate
    const allResults = results.flat();
    const deduplicated = this.deduplicateByURL(allResults);
    const ranked = this.rankResults(deduplicated);

    console.log(`✅ Found ${ranked.length} unique results`);

    return {
      query,
      results: ranked,
      metadata: {
        providers,
        totalResults: ranked.length,
        searchTime: new Date()
      }
    };
  }

  async searchProvider(provider, query, maxResults) {
    try {
      switch (provider) {
        case 'google':
          return await this.searchGoogle(query, maxResults);
        case 'tavily':
          return await this.searchTavily(query, maxResults);
        default:
          console.warn(`Unknown provider: ${provider}`);
          return [];
      }
    } catch (error) {
      console.error(`Error searching ${provider}:`, error.message);
      return [];
    }
  }

  async searchGoogle(query, maxResults) {
    const results = await this.providers.google.json({
      q: query,
      num: maxResults
    });

    return (results.organic_results || []).map(result => ({
      title: result.title,
      url: result.link,
      snippet: result.snippet,
      source: 'google',
      rank: result.position
    }));
  }

  async searchTavily(query, maxResults) {
    const results = await this.providers.tavily.search({
      query,
      max_results: maxResults
    });

    return (results.results || []).map((result, index) => ({
      title: result.title,
      url: result.url,
      snippet: result.content,
      source: 'tavily',
      rank: index + 1,
      score: result.score
    }));
  }

  deduplicateByURL(results) {
    const seen = new Set();
    return results.filter(result => {
      if (seen.has(result.url)) {
        return false;
      }
      seen.add(result.url);
      return true;
    });
  }

  rankResults(results) {
    // Score by: source reliability + rank + snippet length
    return results
      .map(result => ({
        ...result,
        finalScore: this.calculateScore(result)
      }))
      .sort((a, b) => b.finalScore - a.finalScore);
  }

  calculateScore(result) {
    let score = 0;

    // Source reliability
    if (result.source === 'tavily') score += 10; // AI-optimized
    if (result.source === 'google') score += 8;

    // Rank (inverse - lower rank = higher score)
    score += (20 - (result.rank || 10));

    // Snippet quality
    if (result.snippet && result.snippet.length > 100) score += 5;

    // Tavily native score
    if (result.score) score += result.score * 10;

    return score;
  }
}
```

#### Afternoon: Research UI (3-4 hours)

**Task 1.3: Add Research Tab to Modal** (2 hours)

Update: `multi-agent-ui.js`

```javascript
// Add research tab to modal
const modalHTML = `
<div class="multi-agent-modal" id="multiAgentModal">
  <div class="modal-content">
    <div class="modal-header">
      <div class="modal-tabs">
        <button class="modal-tab active" data-tab="consortium">
          🤖 Consortium
        </button>
        <button class="modal-tab" data-tab="research">
          🔍 Research
        </button>
      </div>
      <button class="modal-close" id="closeModal">×</button>
    </div>

    <!-- Existing consortium tab -->
    <div class="tab-content active" id="tab-consortium">
      <!-- Existing consortium UI -->
    </div>

    <!-- New research tab -->
    <div class="tab-content" id="tab-research">
      <div class="research-panel">
        <div class="research-input-area">
          <label>Research Topic:</label>
          <input 
            type="text" 
            id="researchTopic" 
            placeholder="What would you like to research?"
          >

          <div class="research-options">
            <label>
              <input type="checkbox" id="includeAcademic" checked>
              Include academic sources (Scholar, ArXiv)
            </label>
            <label>
              <input type="checkbox" id="includeYouTube">
              Include YouTube videos
            </label>
            <label>
              Max sources:
              <select id="maxSources">
                <option value="5">5</option>
                <option value="10" selected>10</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>

          <button id="startResearch" class="btn-primary">
            🔍 Start Research
          </button>
        </div>

        <div class="research-results" id="researchResults">
          <!-- Results will be inserted here -->
        </div>
      </div>
    </div>
  </div>
</div>
`;
```

**Task 1.4: Wire Up Research UI** (1 hour)

Add to `multi-agent-ui.js`:

```javascript
function initResearchTab() {
  const startButton = document.getElementById('startResearch');
  const topicInput = document.getElementById('researchTopic');
  const resultsDiv = document.getElementById('researchResults');

  startButton.addEventListener('click', async () => {
    const topic = topicInput.value.trim();
    if (!topic) {
      alert('Please enter a research topic');
      return;
    }

    // Show loading
    resultsDiv.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Searching multiple sources...</p>
      </div>
    `;

    try {
      // Call research API
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          maxSources: parseInt(document.getElementById('maxSources').value),
          includeAcademic: document.getElementById('includeAcademic').checked
        })
      });

      const data = await response.json();
      displayResearchResults(data);

    } catch (error) {
      resultsDiv.innerHTML = `
        <div class="error">
          <h3>Error</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  });
}

function displayResearchResults(data) {
  const resultsDiv = document.getElementById('researchResults');
  
  resultsDiv.innerHTML = `
    <div class="research-complete">
      <h3>Research Complete</h3>
      <p>Found ${data.results.length} sources</p>

      <div class="sources-list">
        ${data.results.map((result, i) => `
          <div class="source-card">
            <div class="source-number">${i + 1}</div>
            <div class="source-content">
              <h4>
                <a href="${result.url}" target="_blank">
                  ${result.title}
                </a>
              </h4>
              <p class="source-snippet">${result.snippet}</p>
              <div class="source-meta">
                <span class="source-provider">${result.source}</span>
                <span class="source-score">Score: ${result.finalScore.toFixed(1)}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
```

**Task 1.5: Create Research API Endpoint** (1 hour)

File: `netlify/functions/research.js`

```javascript
import { SearchOrchestrator } from '../../research/search-orchestrator.js';

export async function handler(event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { topic, maxSources = 10, includeAcademic = false } = JSON.parse(event.body);

    console.log('🔍 Research request:', { topic, maxSources, includeAcademic });

    // Initialize search orchestrator
    const searcher = new SearchOrchestrator();

    // Determine providers
    const providers = ['google', 'tavily'];
    // TODO: Add academic providers if includeAcademic

    // Execute search
    const searchResults = await searcher.search(topic, {
      providers,
      maxResults: maxSources
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: searchResults
      })
    };

  } catch (error) {
    console.error('❌ Research error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}
```

---

### Day 2: Content Extraction (6-8 hours)

#### Morning: Web Content Extraction (3-4 hours)

**Task 2.1: Install Dependencies** (15 min)

```bash
npm install cheerio turndown mozilla-readability jsdom
```

**Task 2.2: Create Content Extractor** (2-3 hours)

File: `research/content-extractor.js`

```javascript
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';

/**
 * Extracts clean content from web pages
 */
export class ContentExtractor {
  constructor() {
    this.turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
  }

  /**
   * Extract content from URL
   */
  async extractFromURL(url) {
    console.log(`📄 Extracting content from: ${url}`);

    try {
      // Fetch page
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (research bot)'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();

      // Parse with Readability
      const dom = new JSDOM(html, { url });
      const reader = new Readability(dom.window.document);
      const article = reader.parse();

      if (!article) {
        throw new Error('Could not extract content');
      }

      // Convert to markdown
      const markdown = this.turndown.turndown(article.content);

      // Calculate stats
      const wordCount = this.countWords(markdown);
      const readingTime = Math.ceil(wordCount / 200); // 200 wpm

      console.log(`✅ Extracted ${wordCount} words (${readingTime} min read)`);

      return {
        url,
        title: article.title,
        author: article.byline,
        excerpt: article.excerpt,
        content: markdown,
        wordCount,
        readingTime,
        extractedAt: new Date()
      };

    } catch (error) {
      console.error(`❌ Extraction failed for ${url}:`, error.message);
      return {
        url,
        error: error.message,
        extractedAt: new Date()
      };
    }
  }

  /**
   * Extract content from multiple URLs in parallel
   */
  async extractMultiple(urls, options = {}) {
    const { batchSize = 5 } = options;

    console.log(`📦 Extracting ${urls.length} URLs (batch size: ${batchSize})`);

    const results = [];

    // Process in batches to avoid overwhelming servers
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}...`);

      const batchResults = await Promise.all(
        batch.map(url => this.extractFromURL(url))
      );

      results.push(...batchResults);
    }

    const successful = results.filter(r => !r.error);
    console.log(`✅ Successfully extracted ${successful.length}/${urls.length} sources`);

    return results;
  }

  countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
}
```

#### Afternoon: Content Processing & Chunking (3-4 hours)

**Task 2.3: Create Chunking Strategy** (2 hours)

File: `research/content-chunker.js`

```javascript
/**
 * Intelligently chunk content for LLM processing
 */
export class ContentChunker {
  constructor(options = {}) {
    this.maxChunkSize = options.maxChunkSize || 4000; // tokens
    this.overlapSize = options.overlapSize || 200;
  }

  /**
   * Chunk markdown content by sections
   */
  chunkBySections(markdown) {
    const chunks = [];
    
    // Split by headings
    const sections = this.splitAtHeadings(markdown);

    let currentChunk = '';
    let currentSize = 0;

    for (const section of sections) {
      const sectionSize = this.estimateTokens(section);

      if (currentSize + sectionSize > this.maxChunkSize && currentChunk) {
        // Save current chunk
        chunks.push({
          content: currentChunk,
          tokenEstimate: currentSize
        });

        // Start new chunk with overlap
        const overlap = this.getOverlap(currentChunk);
        currentChunk = overlap + section;
        currentSize = this.estimateTokens(currentChunk);
      } else {
        currentChunk += '\n\n' + section;
        currentSize += sectionSize;
      }
    }

    // Add final chunk
    if (currentChunk) {
      chunks.push({
        content: currentChunk,
        tokenEstimate: currentSize
      });
    }

    return chunks;
  }

  splitAtHeadings(markdown) {
    // Split on markdown headings (# ## ###)
    const sections = [];
    let current = '';

    for (const line of markdown.split('\n')) {
      if (line.match(/^#{1,6}\s/)) {
        if (current) {
          sections.push(current.trim());
        }
        current = line;
      } else {
        current += '\n' + line;
      }
    }

    if (current) {
      sections.push(current.trim());
    }

    return sections;
  }

  getOverlap(text) {
    const tokens = text.split(/\s+/);
    const overlapTokens = tokens.slice(-this.overlapSize);
    return overlapTokens.join(' ');
  }

  estimateTokens(text) {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}
```

**Task 2.4: Update Research API with Extraction** (1-2 hours)

Update `netlify/functions/research.js`:

```javascript
import { SearchOrchestrator } from '../../research/search-orchestrator.js';
import { ContentExtractor } from '../../research/content-extractor.js';

export async function handler(event, context) {
  try {
    const { topic, maxSources = 10, extractContent = true } = JSON.parse(event.body);

    // 1. Search
    const searcher = new SearchOrchestrator();
    const searchResults = await searcher.search(topic, {
      providers: ['google', 'tavily'],
      maxResults: maxSources
    });

    let contents = [];

    // 2. Extract content if requested
    if (extractContent) {
      console.log('📄 Extracting content from top results...');
      
      const extractor = new ContentExtractor();
      const urls = searchResults.results
        .slice(0, Math.min(5, maxSources)) // Top 5 for now
        .map(r => r.url);

      contents = await extractor.extractMultiple(urls, {
        batchSize: 3 // Conservative to avoid rate limits
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: {
          query: topic,
          searchResults: searchResults.results,
          extractedContent: contents,
          metadata: {
            totalSources: searchResults.results.length,
            extractedSources: contents.filter(c => !c.error).length,
            timestamp: new Date()
          }
        }
      })
    };

  } catch (error) {
    console.error('❌ Research error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}
```

---

### Day 3: Multi-Agent Analysis & Memory (6-8 hours)

#### Morning: Multi-Agent Research Analysis (3-4 hours)

**Task 3.1: Create Research Analyzer** (2-3 hours)

File: `research/research-analyzer.js`

```javascript
import { MultiAgentClient } from '../multi-agent-client.js';

/**
 * Analyzes research using multi-agent system
 */
export class ResearchAnalyzer {
  constructor() {
    this.client = new MultiAgentClient();
  }

  /**
   * Analyze extracted content with multiple agents
   */
  async analyzeResearch(topic, contents) {
    console.log(`🧠 Analyzing research on "${topic}"`);
    console.log(`📊 ${contents.length} sources to analyze`);

    // Prepare content summary for agents
    const contentSummary = contents
      .filter(c => !c.error)
      .map((c, i) => `
**Source ${i + 1}**: ${c.title}
URL: ${c.url}
Word Count: ${c.wordCount}

${c.content.substring(0, 2000)}${c.content.length > 2000 ? '...' : ''}
      `)
      .join('\n\n---\n\n');

    // Create research question for agents
    const researchQuestion = `
Analyze these research sources about "${topic}":

${contentSummary}

Provide your analysis focusing on:
1. Key findings and insights
2. Quality and reliability of sources
3. Gaps or contradictions
4. Main themes and patterns
5. Actionable takeaways

Respond from your area of expertise.
    `.trim();

    // Use panel discussion mode with research-focused personas
    const personas = [
      'analyst',           // Data and evidence
      'master-teacher',    // Educational perspective
      'debugger',          // Critical analysis, find gaps
      'strategist'         // Big picture implications
    ];

    const analysis = await this.client.panelDiscussion(
      researchQuestion,
      personas
    );

    return {
      topic,
      question: researchQuestion,
      agentAnalyses: analysis.responses,
      synthesis: analysis.synthesis,
      sources: contents,
      analyzedAt: new Date()
    };
  }

  /**
   * Generate executive summary
   */
  async generateSummary(analysisResult) {
    const summaryQuestion = `
Based on this research analysis about "${analysisResult.topic}", create a concise executive summary (3-5 paragraphs) that captures:
- Main findings
- Key insights
- Practical implications
- Recommended actions

Research synthesis:
${analysisResult.synthesis}
    `.trim();

    const summary = await this.client.panelDiscussion(
      summaryQuestion,
      ['writer'] // Use writer for clear communication
    );

    return summary.responses[0].response;
  }
}
```

**Task 3.2: Update Research API with Analysis** (1 hour)

Update `netlify/functions/research.js`:

```javascript
import { SearchOrchestrator } from '../../research/search-orchestrator.js';
import { ContentExtractor } from '../../research/content-extractor.js';
import { ResearchAnalyzer } from '../../research/research-analyzer.js';

export async function handler(event, context) {
  try {
    const { 
      topic, 
      maxSources = 10, 
      extractContent = true,
      analyzeWithAgents = true 
    } = JSON.parse(event.body);

    console.log('🔍 Research request:', { topic, maxSources, extractContent, analyzeWithAgents });

    // 1. Search
    const searcher = new SearchOrchestrator();
    const searchResults = await searcher.search(topic, {
      providers: ['google', 'tavily'],
      maxResults: maxSources
    });

    let contents = [];
    let analysis = null;

    // 2. Extract content
    if (extractContent) {
      const extractor = new ContentExtractor();
      const urls = searchResults.results.slice(0, 5).map(r => r.url);
      contents = await extractor.extractMultiple(urls, { batchSize: 3 });
    }

    // 3. Multi-agent analysis
    if (analyzeWithAgents && contents.length > 0) {
      const analyzer = new ResearchAnalyzer();
      analysis = await analyzer.analyzeResearch(topic, contents);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        data: {
          query: topic,
          searchResults: searchResults.results,
          extractedContent: contents,
          analysis,
          metadata: {
            totalSources: searchResults.results.length,
            extractedSources: contents.filter(c => !c.error).length,
            analyzed: !!analysis,
            timestamp: new Date()
          }
        }
      })
    };

  } catch (error) {
    console.error('❌ Research error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
}
```

#### Afternoon: Memory & Export (3-4 hours)

**Task 3.3: Simple File-Based Memory** (2 hours)

For now, skip database and use simple file storage:

File: `research/research-memory.js`

```javascript
import fs from 'fs/promises';
import path from 'path';

/**
 * Simple file-based research memory
 * (Will be replaced with database in Phase 7+)
 */
export class ResearchMemory {
  constructor() {
    this.storageDir = path.join(process.cwd(), '.research-memory');
  }

  async ensureStorageExists() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
    } catch (error) {
      // Directory exists, ignore
    }
  }

  /**
   * Save research session
   */
  async saveSession(topic, data) {
    await this.ensureStorageExists();

    const sessionId = this.generateSessionId(topic);
    const filename = `${sessionId}.json`;
    const filepath = path.join(this.storageDir, filename);

    await fs.writeFile(
      filepath,
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    console.log(`💾 Saved research session: ${sessionId}`);

    return sessionId;
  }

  /**
   * Load research session
   */
  async loadSession(sessionId) {
    const filepath = path.join(this.storageDir, `${sessionId}.json`);

    try {
      const data = await fs.readFile(filepath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load session ${sessionId}:`, error.message);
      return null;
    }
  }

  /**
   * List all sessions
   */
  async listSessions() {
    await this.ensureStorageExists();

    const files = await fs.readdir(this.storageDir);
    const sessions = files
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));

    return sessions;
  }

  generateSessionId(topic) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const topicSlug = topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .substring(0, 30);

    return `${topicSlug}-${timestamp}`;
  }
}
```

**Task 3.4: Add Export Functionality** (1-2 hours)

File: `research/research-exporter.js`

```javascript
/**
 * Export research to various formats
 */
export class ResearchExporter {
  /**
   * Export to Markdown
   */
  toMarkdown(researchData) {
    const { query, searchResults, extractedContent, analysis } = researchData;

    let markdown = `# Research Report: ${query}\n\n`;
    markdown += `**Generated**: ${new Date().toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    // Executive Summary
    if (analysis && analysis.synthesis) {
      markdown += `## Executive Summary\n\n`;
      markdown += `${analysis.synthesis}\n\n`;
      markdown += `---\n\n`;
    }

    // Key Findings
    if (analysis && analysis.agentAnalyses) {
      markdown += `## Key Findings\n\n`;
      for (const agentAnalysis of analysis.agentAnalyses) {
        markdown += `### ${agentAnalysis.persona}\n\n`;
        markdown += `${agentAnalysis.response}\n\n`;
      }
      markdown += `---\n\n`;
    }

    // Sources
    markdown += `## Sources\n\n`;
    if (extractedContent && extractedContent.length > 0) {
      extractedContent.forEach((content, i) => {
        if (!content.error) {
          markdown += `### ${i + 1}. ${content.title}\n\n`;
          markdown += `- **URL**: ${content.url}\n`;
          markdown += `- **Word Count**: ${content.wordCount}\n`;
          markdown += `- **Reading Time**: ${content.readingTime} min\n\n`;
        }
      });
    }

    return markdown;
  }

  /**
   * Export citations in APA format
   */
  toCitations(extractedContent, format = 'apa') {
    if (format === 'apa') {
      return extractedContent
        .filter(c => !c.error)
        .map(c => {
          const date = new Date(c.extractedAt);
          const year = date.getFullYear();
          const author = c.author || 'Author Unknown';
          
          return `${author}. (${year}). *${c.title}*. Retrieved from ${c.url}`;
        })
        .join('\n\n');
    }

    // TODO: Add MLA, Chicago, etc.
    return '';
  }
}
```

---

## 🧪 Testing Plan

### End-of-Day-1 Test
```bash
# Test search integration
node test-research-search.js

# Expected:
# - Returns results from Google and Tavily
# - Deduplicates properly
# - Ranks results by score
```

### End-of-Day-2 Test
```bash
# Test content extraction
node test-research-extraction.js

# Expected:
# - Extracts clean content from URLs
# - Converts to markdown
# - Handles errors gracefully
```

### End-of-Day-3 Test
```bash
# Test full research flow
node test-research-full.js

# Expected:
# - Search → Extract → Analyze → Save
# - Multi-agent analysis completes
# - Markdown export works
```

---

## 📋 Files to Create

```
research/
  ├── search-orchestrator.js        (Day 1, ~200 lines)
  ├── content-extractor.js          (Day 2, ~150 lines)
  ├── content-chunker.js            (Day 2, ~100 lines)
  ├── research-analyzer.js          (Day 3, ~150 lines)
  ├── research-memory.js            (Day 3, ~100 lines)
  └── research-exporter.js          (Day 3, ~100 lines)

netlify/functions/
  └── research.js                   (Day 1-3, ~200 lines)

multi-agent-ui.js                   (Update for research tab, +150 lines)
style.css                           (Research tab styles, +100 lines)
```

**Total New Code**: ~1,250 lines (very manageable!)

---

## ✅ Definition of Done

Phase 6 is complete when:

- [ ] Can search Google and Tavily simultaneously
- [ ] Can extract content from top 5-10 URLs
- [ ] Multi-agent analysis produces insights
- [ ] Research tab in UI works end-to-end
- [ ] Research saved to file system
- [ ] Can export to Markdown with citations
- [ ] All error cases handled gracefully
- [ ] Manual testing shows usable results

---

## 🚀 Beyond Phase 6

**Phase 7 Improvements** (not needed initially):
- Add academic search (Scholar, ArXiv, PubMed)
- YouTube transcript extraction
- PDF processing
- Database instead of file storage
- Vector search for related research
- Knowledge graph visualization

**For now**: Get the core working. Perfect later.

---

## 💰 Estimated Costs (per research session)

- **Search API**: $0.02 (10 searches)
- **Content extraction**: Free (our scraping)
- **LLM analysis**: $0.14 (4 agents × Claude Sonnet)
- **Total**: ~$0.16 per research session

**Monthly** (100 sessions): ~$16

---

## 🎯 Success Criteria

**User can**:
1. Enter topic in research tab
2. Click "Start Research"
3. Wait 30-60 seconds
4. See search results
5. See multi-agent analysis
6. Export to Markdown
7. Repeat with different topic

**Quality Bar**:
- Results more useful than Google search alone
- Multi-agent analysis adds unique insights
- Export is actually usable
- "This saved me time" feeling

---

**Ready to build? Let's start with Day 1! 🚀**
