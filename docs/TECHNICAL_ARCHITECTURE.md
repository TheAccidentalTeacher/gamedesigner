# Technical Architecture Documentation

**Project**: Universal Cognitive Amplification System (UCAS)  
**Version**: 2.0 (Phase 6+ Architecture)  
**Last Updated**: December 14, 2025

---

## 🏗️ System Overview

UCAS is built as a **modular, extensible cognitive platform** that combines multi-agent AI, research capabilities, content generation, and development tools into a unified system.

### Core Design Principles

1. **Modularity**: Each capability is an independent module
2. **Extensibility**: Easy to add new agents, tools, and integrations
3. **Scalability**: Serverless architecture scales automatically
4. **Maintainability**: Clean separation of concerns
5. **Cost-Efficiency**: Pay only for what you use

---

## 🎯 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Multi-   │  │ Research │  │ Creative │  │ Dev      │    │
│  │ Agent    │  │ Panel    │  │ Studio   │  │ Workspace│    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Route Manager (Express/Fastify)                     │   │
│  │  - Authentication & Authorization                    │   │
│  │  - Rate Limiting                                     │   │
│  │  - Request Validation                                │   │
│  │  - Error Handling                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                    Service Orchestration                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Multi-   │  │ Research │  │ Creative │  │ Dev      │    │
│  │ Agent    │  │ Engine   │  │ Engine   │  │ Engine   │    │
│  │ Service  │  │          │  │          │  │          │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                    Core Services Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ LLM      │  │ Search   │  │ Content  │  │ Memory   │    │
│  │ Provider │  │ Provider │  │ Processor│  │ Manager  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                   Data & Storage Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Session  │  │ Research │  │ Knowledge│  │ Vector   │    │
│  │ DB       │  │ DB       │  │ Graph    │  │ Store    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Anthropic│  │ OpenAI   │  │ Search   │  │ Content  │    │
│  │ Claude   │  │ GPT      │  │ APIs     │  │ APIs     │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Module Architecture

### 1. Multi-Agent Module (Current)

**Purpose**: Orchestrate conversations between specialized AI personas

```typescript
// Module structure
multi-agent/
  ├── index.ts                 // Module entry point
  ├── orchestrator.ts          // Conversation management
  ├── personas/
  │   ├── loader.ts            // Load persona files
  │   ├── registry.ts          // Persona registry
  │   └── validator.ts         // Validate persona configs
  ├── modes/
  │   ├── panel.ts             // Panel discussion
  │   ├── consensus.ts         // Voting & consensus
  │   ├── conversation.ts      // Turn-taking conversation
  │   └── debate.ts            // Adversarial discussion
  ├── synthesis/
  │   ├── synthesizer.ts       // Combine responses
  │   └── strategies.ts        // Synthesis strategies
  └── utils/
      ├── speaker-selection.ts // Smart speaker picking
      └── context-builder.ts   // Build conversation context
```

**Key Classes:**

```typescript
class MultiAgentOrchestrator {
  constructor(
    private llmProvider: LLMProvider,
    private personaRegistry: PersonaRegistry
  ) {}

  async executePanel(
    question: string,
    personas: string[]
  ): Promise<PanelResult> {
    // 1. Load personas
    const agents = await this.personaRegistry.load(personas);
    
    // 2. Generate responses in parallel
    const responses = await Promise.all(
      agents.map(agent => this.generateResponse(agent, question))
    );
    
    // 3. Synthesize
    const synthesis = await this.synthesize(responses);
    
    return { responses, synthesis };
  }

  async executeConversation(
    question: string,
    personas: string[],
    numTurns: number
  ): Promise<ConversationResult> {
    const agents = await this.personaRegistry.load(personas);
    const conversation = [];
    
    for (let i = 0; i < numTurns; i++) {
      // Select speaker
      const speaker = this.selectSpeaker(agents, conversation);
      
      // Build context
      const context = this.buildContext(conversation);
      
      // Generate response
      const response = await this.generateResponse(
        speaker, 
        question, 
        context
      );
      
      conversation.push({ speaker, response });
    }
    
    return { conversation };
  }
}
```

---

### 2. Research Module (Phase 6)

**Purpose**: Deep research with multi-source aggregation and analysis

```typescript
// Module structure
research/
  ├── index.ts
  ├── orchestrator.ts          // Research workflow
  ├── search/
  │   ├── providers/
  │   │   ├── google.ts        // Google search
  │   │   ├── scholar.ts       // Google Scholar
  │   │   ├── arxiv.ts         // ArXiv papers
  │   │   ├── pubmed.ts        // Medical research
  │   │   └── general.ts       // Bing, DuckDuckGo
  │   ├── aggregator.ts        // Combine results
  │   ├── ranker.ts            // Quality scoring
  │   └── deduplicator.ts      // Remove duplicates
  ├── extraction/
  │   ├── web.ts               // Web page content
  │   ├── pdf.ts               // PDF processing
  │   ├── document.ts          // Word, etc.
  │   ├── video.ts             // YouTube transcripts
  │   └── chunker.ts           // Intelligent chunking
  ├── analysis/
  │   ├── multi-agent.ts       // Multi-agent analysis
  │   ├── summarizer.ts        // Various summary levels
  │   ├── fact-checker.ts      // Cross-source validation
  │   └── synthesizer.ts       // Combine insights
  ├── memory/
  │   ├── storage.ts           // Save research sessions
  │   ├── vector-search.ts     // Semantic search
  │   └── knowledge-graph.ts   // Build concept network
  └── export/
      ├── markdown.ts          // Export to MD
      ├── pdf.ts               // PDF generation
      └── citations.ts         // Citation management
```

**Key Classes:**

```typescript
class ResearchOrchestrator {
  constructor(
    private searchAggregator: SearchAggregator,
    private contentExtractor: ContentExtractor,
    private multiAgent: MultiAgentOrchestrator,
    private memory: ResearchMemory
  ) {}

  async research(topic: string, options: ResearchOptions): Promise<ResearchResult> {
    // 1. Generate search queries
    const queries = await this.generateQueries(topic);
    
    // 2. Search multiple providers
    const searchResults = await this.searchAggregator.search(queries);
    
    // 3. Extract content from top results
    const contents = await Promise.all(
      searchResults.top10.map(r => 
        this.contentExtractor.extract(r.url)
      )
    );
    
    // 4. Multi-agent analysis
    const analysis = await this.multiAgent.analyzeResearch(
      topic,
      contents
    );
    
    // 5. Store in memory
    const sessionId = await this.memory.store({
      topic,
      sources: contents,
      analysis
    });
    
    return {
      sessionId,
      sources: contents,
      analysis,
      relatedResearch: await this.memory.findRelated(topic)
    };
  }
}

class SearchAggregator {
  private providers: SearchProvider[];

  async search(queries: string[]): Promise<SearchResults> {
    // Search all providers in parallel
    const allResults = await Promise.all(
      this.providers.flatMap(provider =>
        queries.map(query => provider.search(query))
      )
    );
    
    // Deduplicate and rank
    const deduplicated = this.deduplicate(allResults.flat());
    const ranked = this.rank(deduplicated);
    
    return {
      all: ranked,
      top10: ranked.slice(0, 10),
      byProvider: this.groupByProvider(ranked)
    };
  }
}
```

---

### 3. Creative Module (Phase 8)

**Purpose**: Generate images, videos, audio

```typescript
// Module structure
creative/
  ├── index.ts
  ├── image/
  │   ├── generators/
  │   │   ├── dalle.ts         // DALL-E 3
  │   │   ├── midjourney.ts    // Midjourney
  │   │   └── stable-diff.ts   // Stable Diffusion
  │   ├── editor.ts            // Image manipulation
  │   ├── diagram.ts           // Diagrams & charts
  │   └── prompt-optimizer.ts  // Multi-agent prompting
  ├── video/
  │   ├── generators/
  │   │   ├── runway.ts        // RunwayML
  │   │   └── synthesia.ts     // Avatar videos
  │   ├── editor.ts            // Video editing
  │   └── animator.ts          // Animations
  ├── audio/
  │   ├── voice/
  │   │   └── elevenlabs.ts    // Voice generation
  │   ├── music/
  │   │   └── aiva.ts          // Music generation
  │   └── editor.ts            // Audio editing
  └── orchestrator.ts          // Coordinate creation
```

**Key Classes:**

```typescript
class CreativeOrchestrator {
  async generateImage(
    description: string,
    options: ImageOptions
  ): Promise<Image> {
    // 1. Multi-agent prompt optimization
    const optimizedPrompt = await this.multiAgent.optimizeImagePrompt(
      description,
      options.style
    );
    
    // 2. Generate with selected provider
    const image = await this.imageGenerator.generate(
      optimizedPrompt,
      options
    );
    
    // 3. Multi-agent selection if multiple variants
    if (options.variants > 1) {
      const best = await this.multiAgent.selectBestImage(
        image.variants
      );
      return best;
    }
    
    return image;
  }

  async createVideo(
    script: string,
    options: VideoOptions
  ): Promise<Video> {
    // 1. Break script into scenes
    const scenes = await this.scriptAnalyzer.breakdown(script);
    
    // 2. Generate visuals for each scene
    const visuals = await Promise.all(
      scenes.map(scene => this.generateSceneVisual(scene))
    );
    
    // 3. Generate voiceover
    const audio = await this.voiceGenerator.generate(
      script,
      options.voice
    );
    
    // 4. Combine into video
    return await this.videoComposer.compose(
      visuals,
      audio,
      options
    );
  }
}
```

---

### 4. Development Module (Phase 9)

**Purpose**: Code development environment with AI assistance

```typescript
// Module structure
development/
  ├── index.ts
  ├── editor/
  │   ├── monaco.ts            // Monaco editor integration
  │   ├── intellisense.ts      // Smart completions
  │   └── formatting.ts        // Code formatting
  ├── filesystem/
  │   ├── virtual-fs.ts        // In-browser file system
  │   ├── git.ts               // Git operations
  │   └── search.ts            // File search
  ├── ai-features/
  │   ├── completion.ts        // AI code completion
  │   ├── review.ts            // Multi-agent review
  │   ├── refactor.ts          // Refactoring assistant
  │   └── explain.ts           // Code explanation
  ├── project/
  │   ├── scaffolder.ts        // Project generation
  │   ├── builder.ts           // Build automation
  │   └── tester.ts            // Test generation/running
  └── deployment/
      ├── netlify.ts           // Netlify deploy
      ├── vercel.ts            // Vercel deploy
      └── aws.ts               // AWS deploy
```

**Key Classes:**

```typescript
class DevelopmentOrchestrator {
  async reviewCode(
    code: string,
    filePath: string
  ): Promise<CodeReview> {
    // Multi-agent code review
    const reviews = await this.multiAgent.executePanel(
      `Review this ${filePath} code:\n${code}`,
      ['technical-architect', 'debugger', 'strategist']
    );
    
    return {
      architecture: reviews.technicalArchitect,
      bugs: reviews.debugger,
      scalability: reviews.strategist,
      synthesis: reviews.synthesis
    };
  }

  async scaffoldProject(
    requirements: string
  ): Promise<Project> {
    // 1. Multi-agent discussion of architecture
    const architecture = await this.multiAgent.discussArchitecture(
      requirements
    );
    
    // 2. Generate file structure
    const structure = await this.projectScaffolder.generate(
      architecture
    );
    
    // 3. Create files
    await this.filesystem.createStructure(structure);
    
    // 4. Install dependencies
    await this.packageManager.install(structure.dependencies);
    
    return { structure, path: structure.root };
  }
}
```

---

## 🔌 Integration Architecture

### External Service Abstractions

**LLM Provider Interface:**

```typescript
interface LLMProvider {
  name: string;
  models: string[];
  
  invoke(params: {
    model: string;
    messages: Message[];
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  }): Promise<LLMResponse>;
  
  stream(params: LLMParams): AsyncIterable<LLMChunk>;
}

class AnthropicProvider implements LLMProvider {
  // Implementation
}

class OpenAIProvider implements LLMProvider {
  // Implementation
}

// Usage
const llm: LLMProvider = config.provider === 'anthropic' 
  ? new AnthropicProvider()
  : new OpenAIProvider();
```

**Search Provider Interface:**

```typescript
interface SearchProvider {
  name: string;
  
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
  
  supports: {
    academic?: boolean;
    images?: boolean;
    videos?: boolean;
    news?: boolean;
  };
}

class GoogleSearchProvider implements SearchProvider {
  // Implementation via SerpAPI
}

class ScholarSearchProvider implements SearchProvider {
  // Academic papers
}
```

---

## 💾 Data Architecture

### Database Schema

**Research Sessions:**

```sql
CREATE TABLE research_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  topic TEXT NOT NULL,
  query TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  sources JSONB,        -- Array of source objects
  analyses JSONB,       -- Agent analyses
  synthesis TEXT,
  tags TEXT[],
  embedding VECTOR(1536)  -- For similarity search
);

CREATE INDEX idx_research_sessions_embedding 
  ON research_sessions 
  USING ivfflat (embedding vector_cosine_ops);
```

**Sources:**

```sql
CREATE TABLE sources (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES research_sessions(id),
  url TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  content_markdown TEXT,
  extracted_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB,
  embedding VECTOR(1536)
);
```

**Knowledge Graph:**

```sql
CREATE TABLE knowledge_nodes (
  id UUID PRIMARY KEY,
  label TEXT NOT NULL,
  type TEXT,  -- 'concept', 'person', 'place', 'event', etc.
  properties JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE knowledge_edges (
  id UUID PRIMARY KEY,
  from_node UUID REFERENCES knowledge_nodes(id),
  to_node UUID REFERENCES knowledge_nodes(id),
  relationship TEXT,  -- 'related-to', 'causes', 'part-of', etc.
  weight FLOAT DEFAULT 1.0,
  metadata JSONB
);
```

**Conversations:**

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  mode TEXT,  -- 'panel', 'consensus', 'conversation'
  question TEXT,
  personas TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  turns JSONB,  -- Conversation history
  metadata JSONB
);
```

### Vector Storage

**For semantic search of research sessions:**

```typescript
class VectorStore {
  async store(
    id: string,
    content: string,
    metadata: any
  ): Promise<void> {
    // Generate embedding
    const embedding = await this.embeddings.generate(content);
    
    // Store in database
    await this.db.insert({
      id,
      content,
      embedding,
      metadata
    });
  }

  async search(
    query: string,
    limit: number = 10,
    threshold: number = 0.7
  ): Promise<SearchResult[]> {
    // Generate query embedding
    const queryEmbedding = await this.embeddings.generate(query);
    
    // Similarity search
    return await this.db.query(`
      SELECT id, content, metadata,
             1 - (embedding <=> $1) AS similarity
      FROM research_sessions
      WHERE 1 - (embedding <=> $1) > $2
      ORDER BY similarity DESC
      LIMIT $3
    `, [queryEmbedding, threshold, limit]);
  }
}
```

---

## 🌐 API Design

### RESTful Endpoints

```typescript
// Multi-Agent
POST   /api/multi-agent          // Execute workflow
POST   /api/conversation          // Start conversation
POST   /api/conversation/turn     // Continue conversation

// Research
POST   /api/research              // Start research
GET    /api/research/:id          // Get session
GET    /api/research/search       // Search past research
POST   /api/research/:id/export   // Export as PDF/Markdown

// Creative
POST   /api/creative/image        // Generate image
POST   /api/creative/video        // Generate video
POST   /api/creative/audio        // Generate audio
GET    /api/creative/:id          // Get creation

// Development
POST   /api/dev/review            // Code review
POST   /api/dev/scaffold          // Scaffold project
POST   /api/dev/deploy            // Deploy project

// Memory & Knowledge
GET    /api/knowledge/graph       // Get knowledge graph
GET    /api/knowledge/related     // Find related concepts
POST   /api/knowledge/query       // Query knowledge base
```

### WebSocket for Real-Time

```typescript
// WebSocket connection for streaming responses
ws://localhost:3000/api/stream

// Messages
{
  type: 'research-progress',
  data: {
    stage: 'searching' | 'extracting' | 'analyzing',
    progress: 0.45,
    message: 'Analyzing 7 of 10 sources...'
  }
}

{
  type: 'conversation-turn',
  data: {
    speaker: 'technical-architect',
    response: 'Based on the previous point...',
    complete: false
  }
}

{
  type: 'image-generation',
  data: {
    stage: 'generating' | 'complete',
    progress: 0.8,
    imageUrl: '...'
  }
}
```

---

## 🚀 Deployment Architecture

### Serverless Functions (Netlify)

```
netlify/
  functions/
    ├── multi-agent.ts           // Multi-agent orchestration
    ├── research.ts              // Research workflows
    ├── creative.ts              // Creative generation
    ├── dev.ts                   // Development tools
    └── shared/
        ├── llm.ts               // LLM provider logic
        ├── database.ts          // DB connection
        └── auth.ts              // Authentication
```

**Function Structure:**

```typescript
// netlify/functions/research.ts
import { Handler } from '@netlify/functions';
import { ResearchOrchestrator } from '../../src/research';

export const handler: Handler = async (event, context) => {
  // Parse request
  const { topic, options } = JSON.parse(event.body);
  
  // Initialize services
  const orchestrator = new ResearchOrchestrator(/* ... */);
  
  // Execute research
  try {
    const result = await orchestrator.research(topic, options);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: result
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
```

### Database Hosting

**Options:**

1. **Supabase** (Recommended for MVP)
   - PostgreSQL with vector support
   - Built-in auth
   - Real-time subscriptions
   - Generous free tier

2. **Neon** (Alternative)
   - Serverless PostgreSQL
   - Auto-scaling
   - Branch-based dev

3. **MongoDB Atlas** (For document-heavy)
   - Vector search support
   - Flexible schema
   - Good free tier

### Environment Variables

```env
# LLM Providers
ANTHROPIC_API_KEY=sk-...
OPENAI_API_KEY=sk-...

# Search Providers
SERP_API_KEY=...
TAVILY_API_KEY=...

# Creative Providers
DALLE_API_KEY=...
ELEVENLABS_API_KEY=...
RUNWAY_API_KEY=...

# Database
DATABASE_URL=postgresql://...
VECTOR_DB_URL=...

# Auth
JWT_SECRET=...
AUTH_DOMAIN=...

# Feature Flags
ENABLE_RESEARCH=true
ENABLE_CREATIVE=true
ENABLE_DEV=false
```

---

## 🔒 Security Architecture

### Authentication

```typescript
class AuthService {
  async authenticate(token: string): Promise<User> {
    // JWT verification
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Load user from DB
    return await db.users.findById(payload.userId);
  }

  async authorize(user: User, action: string): Promise<boolean> {
    // Role-based access control
    return user.permissions.includes(action);
  }
}

// Middleware
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    req.user = await authService.authenticate(token);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Rate Limiting

```typescript
class RateLimiter {
  async checkLimit(userId: string, action: string): Promise<boolean> {
    const key = `rate:${userId}:${action}`;
    const limit = this.getLimitForAction(action);
    
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, 3600); // 1 hour window
    }
    
    return current <= limit;
  }

  private getLimitForAction(action: string): number {
    const limits = {
      'research': 100,     // 100 research sessions/hour
      'creative': 50,      // 50 generations/hour
      'conversation': 200  // 200 conversation turns/hour
    };
    return limits[action] || 10;
  }
}
```

### API Key Management

```typescript
class APIKeyManager {
  async validateKey(apiKey: string): Promise<User | null> {
    // Hash the key
    const hash = crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');
    
    // Look up in database
    const key = await db.apiKeys.findByHash(hash);
    
    if (!key || key.revoked || key.expiresAt < new Date()) {
      return null;
    }
    
    // Update last used
    await db.apiKeys.updateLastUsed(key.id);
    
    return await db.users.findById(key.userId);
  }

  async createKey(userId: string, name: string): Promise<string> {
    // Generate random key
    const apiKey = `ucas_${crypto.randomBytes(32).toString('hex')}`;
    
    // Hash it
    const hash = crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');
    
    // Store hash (never store plain key)
    await db.apiKeys.create({
      userId,
      hash,
      name,
      createdAt: new Date()
    });
    
    // Return plain key (only time it's visible)
    return apiKey;
  }
}
```

---

## 📊 Monitoring & Observability

### Logging

```typescript
class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, data?: any) {
    console.log(JSON.stringify({
      level: 'info',
      context: this.context,
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  }

  error(message: string, error: Error, data?: any) {
    console.error(JSON.stringify({
      level: 'error',
      context: this.context,
      message,
      error: {
        message: error.message,
        stack: error.stack
      },
      data,
      timestamp: new Date().toISOString()
    }));
  }
}

// Usage
const logger = new Logger('ResearchOrchestrator');
logger.info('Starting research', { topic });
```

### Metrics

```typescript
class Metrics {
  async track(metric: string, value: number, tags?: Record<string, string>) {
    // Send to metrics service (e.g., Datadog, CloudWatch)
    await metricsClient.gauge(metric, value, tags);
  }

  async increment(metric: string, tags?: Record<string, string>) {
    await metricsClient.increment(metric, tags);
  }

  async timing(metric: string, duration: number, tags?: Record<string, string>) {
    await metricsClient.timing(metric, duration, tags);
  }
}

// Usage
const metrics = new Metrics();
const start = Date.now();

// ... do work ...

metrics.timing('research.duration', Date.now() - start, {
  topic: topic,
  sources: sources.length
});
```

### Error Tracking

```typescript
// Sentry integration
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
});

// Error handler
function handleError(error: Error, context?: any) {
  Sentry.captureException(error, {
    extra: context
  });
  
  logger.error('Unhandled error', error, context);
}
```

---

## 🧪 Testing Strategy

### Unit Tests

```typescript
// Example: Testing search aggregator
describe('SearchAggregator', () => {
  let aggregator: SearchAggregator;

  beforeEach(() => {
    const providers = [
      new MockGoogleProvider(),
      new MockScholarProvider()
    ];
    aggregator = new SearchAggregator(providers);
  });

  it('deduplicates results from multiple providers', async () => {
    const results = await aggregator.search(['test query']);
    
    const urls = results.all.map(r => r.url);
    const uniqueUrls = new Set(urls);
    
    expect(urls.length).toBe(uniqueUrls.size);
  });

  it('ranks results by quality score', async () => {
    const results = await aggregator.search(['test query']);
    
    // Check that results are in descending order of score
    for (let i = 0; i < results.all.length - 1; i++) {
      expect(results.all[i].score).toBeGreaterThanOrEqual(
        results.all[i + 1].score
      );
    }
  });
});
```

### Integration Tests

```typescript
// Example: Testing research workflow
describe('Research Workflow', () => {
  it('completes full research flow', async () => {
    const orchestrator = new ResearchOrchestrator(
      realSearchAggregator,
      realContentExtractor,
      realMultiAgent,
      testMemory
    );

    const result = await orchestrator.research('quantum computing', {
      maxSources: 5
    });

    expect(result.sources.length).toBeLessThanOrEqual(5);
    expect(result.analysis).toBeDefined();
    expect(result.analysis.synthesis).toBeTruthy();
  });
});
```

### End-to-End Tests

```typescript
// Example: Testing UI to API to result
describe('E2E: Research Flow', () => {
  it('user can research topic from UI', async () => {
    await page.goto('http://localhost:3000');
    
    // Open research panel
    await page.click('[data-testid="research-button"]');
    
    // Enter topic
    await page.type('[data-testid="research-input"]', 'machine learning');
    
    // Start research
    await page.click('[data-testid="research-submit"]');
    
    // Wait for results
    await page.waitForSelector('[data-testid="research-results"]');
    
    // Verify results displayed
    const results = await page.$('[data-testid="research-results"]');
    expect(results).toBeTruthy();
  });
});
```

---

## 🔄 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

---

## 📈 Performance Optimization

### Caching Strategy

```typescript
class CacheManager {
  private redis: Redis;

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttl: number = 3600) {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async getCached<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    // Try cache first
    const cached = await this.get<T>(key);
    if (cached) return cached;

    // Generate and cache
    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }
}

// Usage
const searchResults = await cache.getCached(
  `search:${query}`,
  () => searchProvider.search(query),
  3600 // Cache for 1 hour
);
```

### Parallel Processing

```typescript
async function processSourcesInParallel(urls: string[]) {
  // Process in batches of 5 to avoid overwhelming services
  const batchSize = 5;
  const results = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    
    const batchResults = await Promise.all(
      batch.map(url => contentExtractor.extract(url))
    );
    
    results.push(...batchResults);
  }

  return results;
}
```

---

## 🎯 Next Steps

1. **Implement Phase 6 (Research)**
   - See `RESEARCH_CAPABILITIES_SPEC.md`
   - Start with search integration
   - Build incrementally

2. **Set Up Infrastructure**
   - Provision database (Supabase)
   - Configure Redis for caching
   - Set up monitoring (Sentry, metrics)

3. **Security Hardening**
   - Implement authentication
   - Add rate limiting
   - API key system

4. **Performance Testing**
   - Load testing
   - Optimize bottlenecks
   - Cache tuning

---

**This architecture supports the full vision while remaining maintainable and scalable.**
