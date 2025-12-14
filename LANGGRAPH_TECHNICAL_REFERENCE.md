# LangGraph.js Technical Reference
**Complete Implementation Guide from Official Documentation**

**Last Updated**: December 12, 2025  
**Sources**: 
- https://docs.langchain.com/oss/javascript/langgraph/overview
- https://docs.langchain.com/oss/javascript/langgraph/quickstart
- https://docs.langchain.com/oss/javascript/langgraph/persistence
- https://github.com/langchain-ai/langgraphjs (examples)

---

## 📦 Installation

```bash
npm install @langchain/langgraph @langchain/core
```

**For our multi-agent system** (additional packages):
```bash
npm install @langchain/anthropic @langchain/openai
```

**Optional (for production):**
```bash
# PostgreSQL checkpointer for production persistence
npm install @langchain/langgraph-checkpoint-postgres

# SQLite checkpointer for local development
npm install @langchain/langgraph-checkpoint-sqlite
```

---

## 🎯 Core Concepts

### StateGraph Architecture

LangGraph uses a **state machine** pattern where:
- **Nodes** = Functions that process state
- **Edges** = Transitions between nodes
- **State** = Shared data that flows through the graph
- **Checkpointer** = Persists state at each step

### Basic Hello World Example

```typescript
import { MessagesAnnotation, StateGraph, START, END } from "@langchain/langgraph";

const mockLlm = (state: typeof MessagesAnnotation.State) => {
  return { messages: [{ role: "ai", content: "hello world" }] };
};

const graph = new StateGraph(MessagesAnnotation)
  .addNode("mock_llm", mockLlm)
  .addEdge(START, "mock_llm")
  .addEdge("mock_llm", END)
  .compile();

await graph.invoke({ messages: [{ role: "user", content: "hi!" }] });
```

---

## 🏗️ State Definition

### Using Zod for State Schema

```typescript
import { StateGraph, Annotation } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod";
import * as z from "zod";
import { type BaseMessage } from "@langchain/core/messages";

// Define state with reducers
const MessagesState = z.object({
  messages: z
    .array(z.custom<BaseMessage>())
    .register(registry, MessagesZodMeta),
  llmCalls: z.number().optional(),
});

// Alternative: Using Annotation API
const State = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y), // Append new messages
    default: () => [],
  }),
  next: Annotation<string>({
    reducer: (x, y) => y ?? x ?? END,
    default: () => END,
  }),
});
```

### Reducers Explained

**Reducers** control how state updates are applied:
- **Without reducer**: Value is replaced
- **With reducer**: New value is combined with old value

```typescript
const State = Annotation.Root({
  foo: Annotation<number>(), // Replaces value
  bar: Annotation<string[]>({
    reducer: (x, y) => x.concat(y), // Appends values
    default: () => [],
  }),
});
```

---

## 🔗 Building Graphs

### Complete Calculator Agent Example

```typescript
import { ChatAnthropic } from "@langchain/anthropic";
import { tool } from "@langchain/core/tools";
import * as z from "zod";
import { StateGraph, START, END } from "@langchain/langgraph";

// 1. Define tools
const add = tool(({ a, b }) => a + b, {
  name: "add",
  description: "Add two numbers",
  schema: z.object({
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
});

const model = new ChatAnthropic({
  model: "claude-sonnet-4-5-20250929",
  temperature: 0,
});

const toolsByName = { [add.name]: add };
const tools = Object.values(toolsByName);
const modelWithTools = model.bindTools(tools);

// 2. Define state
const MessagesState = z.object({
  messages: z.array(z.custom<BaseMessage>()).register(registry, MessagesZodMeta),
  llmCalls: z.number().optional(),
});

// 3. Define nodes
async function llmCall(state: z.infer<typeof MessagesState>) {
  return {
    messages: await modelWithTools.invoke([
      new SystemMessage("You are a helpful assistant."),
      ...state.messages,
    ]),
    llmCalls: (state.llmCalls ?? 0) + 1,
  };
}

async function toolNode(state: z.infer<typeof MessagesState>) {
  const lastMessage = state.messages.at(-1);
  if (lastMessage == null || !isAIMessage(lastMessage)) {
    return { messages: [] };
  }

  const result: ToolMessage[] = [];
  for (const toolCall of lastMessage.tool_calls ?? []) {
    const tool = toolsByName[toolCall.name];
    const observation = await tool.invoke(toolCall);
    result.push(observation);
  }

  return { messages: result };
}

// 4. Define conditional edges
async function shouldContinue(state: z.infer<typeof MessagesState>) {
  const lastMessage = state.messages.at(-1);
  if (lastMessage == null || !isAIMessage(lastMessage)) return END;

  if (lastMessage.tool_calls?.length) {
    return "toolNode";
  }

  return END;
}

// 5. Build and compile graph
const agent = new StateGraph(MessagesState)
  .addNode("llmCall", llmCall)
  .addNode("toolNode", toolNode)
  .addEdge(START, "llmCall")
  .addConditionalEdges("llmCall", shouldContinue, ["toolNode", END])
  .addEdge("toolNode", "llmCall")
  .compile();

// 6. Invoke
const result = await agent.invoke({
  messages: [new HumanMessage("Add 3 and 4.")],
});
```

---

## 💾 Persistence & Memory

### Checkpointers (State Persistence)

**MemorySaver** (Development):
```typescript
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();
const graph = workflow.compile({ checkpointer });

// Invoke with thread_id for persistence
const config = { configurable: { thread_id: "1" } };
await graph.invoke({ messages: [...] }, config);
```

**PostgresSaver** (Production):
```typescript
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const checkpointer = PostgresSaver.fromConnString(
  "postgresql://user:pass@localhost:5432/dbname"
);

await checkpointer.setup(); // Creates necessary tables

const graph = workflow.compile({ checkpointer });
```

### Thread Management

**Threads** = Unique conversation sessions

```typescript
// Thread 1 - First conversation
const config1 = { configurable: { thread_id: "user-123-conv-1" } };
await graph.invoke({ messages: [...] }, config1);

// Thread 2 - Separate conversation
const config2 = { configurable: { thread_id: "user-123-conv-2" } };
await graph.invoke({ messages: [...] }, config2);

// Resume Thread 1 later
await graph.invoke({ messages: [...] }, config1); // Has memory from earlier
```

### Get State & History

```typescript
// Get latest state
const config = { configurable: { thread_id: "1" } };
const state = await graph.getState(config);

console.log(state.values); // Current state values
console.log(state.next); // Next node to execute
console.log(state.metadata); // Step info

// Get full history
for await (const state of graph.getStateHistory(config)) {
  console.log(state.values); // State at this checkpoint
  console.log(state.createdAt); // Timestamp
}
```

### Update State (Human-in-the-Loop)

```typescript
// Update current state
await graph.updateState(
  { configurable: { thread_id: "1" } },
  {
    messages: [new HumanMessage("New user input")],
  }
);

// Fork from specific checkpoint
await graph.updateState(
  {
    configurable: {
      thread_id: "1",
      checkpoint_id: "1ef663ba-28fe-6528-8002-5a559208592c",
    },
  },
  {
    messages: [new HumanMessage("Alternative path")],
  }
);
```

### Time Travel (Replay from Checkpoint)

```typescript
// Replay from specific checkpoint
const config = {
  configurable: {
    thread_id: "1",
    checkpoint_id: "0c62ca34-ac19-445d-bbb0-5b4984975b2a",
  },
};

// Steps BEFORE checkpoint_id are replayed (not re-executed)
// Steps AFTER checkpoint_id are executed fresh (new fork)
await graph.invoke(null, config);
```

---

## 🤝 Multi-Agent Patterns

### Pattern 1: Supervisor Architecture

**Use Case**: Central coordinator delegates to specialized agents

```typescript
import { StateGraph, MessagesAnnotation, Command } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({ model: "gpt-4o-mini" });

// Supervisor decides routing
const supervisor = async (state: typeof MessagesAnnotation.State) => {
  const response = await model
    .withStructuredOutput({
      name: "route",
      schema: z.object({
        next: z.enum(["agent1", "agent2", "__end__"]),
      }),
    })
    .invoke(state.messages);

  return new Command({
    goto: response.next,
  });
};

// Agent nodes
const agent1 = async (state: typeof MessagesAnnotation.State) => {
  const response = await model.invoke(state.messages);
  return new Command({
    goto: "supervisor",
    update: { messages: [response] },
  });
};

const agent2 = async (state: typeof MessagesAnnotation.State) => {
  const response = await model.invoke(state.messages);
  return new Command({
    goto: "supervisor",
    update: { messages: [response] },
  });
};

// Build graph
const graph = new StateGraph(MessagesAnnotation)
  .addNode("supervisor", supervisor, {
    ends: ["agent1", "agent2", "__end__"],
  })
  .addNode("agent1", agent1, {
    ends: ["supervisor"],
  })
  .addNode("agent2", agent2, {
    ends: ["supervisor"],
  })
  .addEdge("__start__", "supervisor")
  .compile();
```

### Pattern 2: Agent Teams (from examples)

**Hierarchical supervisor with specialized teams:**

```typescript
// Define team state
const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  next: Annotation<string>({
    reducer: (x, y) => y ?? x ?? END,
    default: () => END,
  }),
});

// Create team supervisor
async function createTeamSupervisor(
  llm: ChatOpenAI,
  systemPrompt: string,
  members: string[]
): Promise<Runnable> {
  const options = ["FINISH", ...members];
  
  const routeTool = {
    name: "route",
    description: "Select the next role.",
    schema: z.object({
      reasoning: z.string(),
      next: z.enum(["FINISH", ...members]),
      instructions: z.string().describe("Specific instructions for next role"),
    }),
  };

  let prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("messages"),
    [
      "system",
      "Given the conversation above, who should act next? Select one of: {options}",
    ],
  ]);

  prompt = await prompt.partial({
    options: options.join(", "),
    team_members: members.join(", "),
  });

  const supervisor = prompt
    .pipe(
      llm.bindTools([routeTool], {
        tool_choice: "route",
      })
    )
    .pipe((x) => ({
      next: x.tool_calls[0].args.next,
      instructions: x.tool_calls[0].args.instructions,
    }));

  return supervisor;
}

// Create research team
const researchTeam = new StateGraph(AgentState)
  .addNode("Search", searchNode)
  .addNode("WebScraper", webScraperNode)
  .addNode("supervisor", researchSupervisor)
  .addEdge("Search", "supervisor")
  .addEdge("WebScraper", "supervisor")
  .addConditionalEdges("supervisor", (x) => x.next, {
    Search: "Search",
    WebScraper: "WebScraper",
    FINISH: END,
  })
  .addEdge(START, "supervisor")
  .compile();

// Create top-level supervisor that coordinates teams
const topSupervisor = new StateGraph(State)
  .addNode("ResearchTeam", researchTeam)
  .addNode("WritingTeam", writingTeam)
  .addNode("supervisor", topSupervisorNode)
  .addEdge("ResearchTeam", "supervisor")
  .addEdge("WritingTeam", "supervisor")
  .addConditionalEdges("supervisor", (x) => x.next, {
    ResearchTeam: "ResearchTeam",
    WritingTeam: "WritingTeam",
    FINISH: END,
  })
  .addEdge(START, "supervisor")
  .compile();
```

### Pattern 3: Agent Node Helper (from examples)

```typescript
// Helper for running agents as nodes
async function runAgentNode(params: {
  state: any;
  agent: Runnable;
  name: string;
}) {
  const { state, agent, name } = params;
  const result = await agent.invoke({
    ...state,
    messages: state.messages,
  });

  const lastMessage = result.messages[result.messages.length - 1];
  
  return {
    messages: [new HumanMessage({ 
      content: lastMessage.content, 
      name 
    })],
  };
}

// Usage
const gandalfAgent = createReactAgent({
  llm: model,
  tools: [searchTool],
  prompt: "You are Gandalf, wise and thoughtful...",
});

async function gandalfNode(state: any) {
  return runAgentNode({ 
    state, 
    agent: gandalfAgent, 
    name: "Gandalf" 
  });
}
```

---

## 🗄️ Memory Store (Cross-Thread Memory)

**Use Case**: Store information that persists across multiple threads

```typescript
import { MemoryStore } from "@langchain/langgraph";

const memoryStore = new MemoryStore();

// Store memories namespaced by user
const userId = "1";
const namespace = [userId, "memories"];

// Save memory
const memoryId = uuidv4();
const memory = { food_preference: "I like pizza" };
await memoryStore.put(namespace, memoryId, memory);

// Retrieve memories
const memories = await memoryStore.search(namespace);
console.log(memories[memories.length - 1].value); // { food_preference: 'I like pizza' }

// Use in graph
const checkpointer = new MemorySaver();

const graph = workflow.compile({ 
  checkpointer, 
  store: memoryStore 
});

// Access in nodes
async function callModel(
  state: any,
  runtime: Runtime<{ user_id: string }>
) {
  const userId = runtime.context?.user_id;
  const namespace = [userId, "memories"];

  // Search memories
  const memories = await runtime.store?.search(namespace, {
    query: state.messages[state.messages.length - 1].content,
    limit: 3,
  });

  const info = memories.map((d) => d.value.memory).join("\n");
  
  // Use memories in prompt
  const response = await model.invoke([
    new SystemMessage(`Context: ${info}`),
    ...state.messages,
  ]);

  return { messages: [response] };
}
```

### Semantic Search in Memory Store

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";

const store = new InMemoryStore({
  index: {
    embeddings: new OpenAIEmbeddings({ model: "text-embedding-3-small" }),
    dims: 1536,
    fields: ["food_preference", "$"], // Fields to embed
  },
});

// Store with embedding
await store.put(
  namespace,
  uuidv4(),
  { food_preference: "I love Italian cuisine" },
  { index: ["food_preference"] } // Only embed this field
);

// Semantic search
const memories = await store.search(namespace, {
  query: "What does the user like to eat?", // Natural language query
  limit: 3,
});
```

---

## 🔧 Best Practices (from Official Docs)

### 1. **Start Simple**
- Use single LLM calls first
- Add complexity only when needed
- Workflows before agents

### 2. **Debugging**
- Use LangSmith for tracing
- Console log state at each node
- Test nodes individually

### 3. **State Management**
- Use reducers wisely (append vs replace)
- Keep state minimal
- Use Annotation.Root for type safety

### 4. **Error Handling**
```typescript
async function safeNode(state: State) {
  try {
    const result = await riskyOperation();
    return { messages: [result] };
  } catch (error) {
    console.error("Node failed:", error);
    return { 
      messages: [new AIMessage({ 
        content: "I encountered an error. Let me try another approach." 
      })]
    };
  }
}
```

### 5. **Conditional Routing**
```typescript
async function shouldContinue(state: State) {
  const lastMessage = state.messages.at(-1);
  
  // Complex routing logic
  if (lastMessage.content.includes("done")) {
    return END;
  }
  
  if (lastMessage.tool_calls?.length) {
    return "tool_node";
  }
  
  if (state.agentCalls > 10) {
    return "error_handler";
  }
  
  return "next_agent";
}
```

---

## 🚀 Production Deployment

### LangSmith Integration

```typescript
// Set environment variables
process.env.LANGCHAIN_TRACING_V2 = "true";
process.env.LANGCHAIN_API_KEY = "your-api-key";
process.env.LANGCHAIN_PROJECT = "my-project";

// That's it! Auto-traces all LangGraph execution
```

### PostgreSQL Checkpointer Setup

```typescript
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const checkpointer = PostgresSaver.fromConnString(
  process.env.DATABASE_URL
);

await checkpointer.setup();

const graph = workflow.compile({ checkpointer });
```

---

## 📊 Performance Optimization

### 1. **Parallel Execution**
```typescript
// Run multiple agents in parallel
.addEdge("router", ["agent1", "agent2", "agent3"]) // All run simultaneously
.addEdge(["agent1", "agent2", "agent3"], "aggregator")
```

### 2. **Streaming**
```typescript
// Stream results as they arrive
for await (const event of await graph.stream(input, config)) {
  console.log(event); // Incremental updates
}
```

### 3. **Batch Processing**
```typescript
// Process multiple inputs
const results = await graph.batch([
  { messages: [new HumanMessage("Query 1")] },
  { messages: [new HumanMessage("Query 2")] },
  { messages: [new HumanMessage("Query 3")] },
]);
```

---

## 🎓 Complete Multi-Agent Example (from official examples)

```typescript
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";
import { ChatAnthropic } from "@langchain/anthropic";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

// 1. Define state
const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  next: Annotation<string>({
    reducer: (x, y) => y ?? x ?? END,
    default: () => END,
  }),
});

// 2. Create specialized agents
const researcherAgent = createReactAgent({
  llm: new ChatAnthropic({ model: "claude-sonnet-4-5" }),
  tools: [webSearchTool],
  prompt: "You are a web researcher. Find accurate information.",
});

const writerAgent = createReactAgent({
  llm: new ChatAnthropic({ model: "claude-sonnet-4-5" }),
  tools: [writeFileTool],
  prompt: "You are a writer. Create clear, engaging content.",
});

// 3. Create supervisor
const supervisor = async (state: typeof AgentState.State) => {
  const prompt = `You are a supervisor managing researcher and writer agents.
Current conversation: ${state.messages.map(m => m.content).join('\n')}

Who should act next? Options: researcher, writer, FINISH`;

  const response = await llm.invoke(prompt);
  
  return {
    next: extractNextAgent(response), // Parse response for next agent
  };
};

// 4. Create agent nodes
async function researcherNode(state: typeof AgentState.State) {
  const result = await researcherAgent.invoke(state);
  return {
    messages: [new HumanMessage({ 
      content: result.messages.at(-1).content, 
      name: "Researcher" 
    })],
  };
}

async function writerNode(state: typeof AgentState.State) {
  const result = await writerAgent.invoke(state);
  return {
    messages: [new HumanMessage({ 
      content: result.messages.at(-1).content, 
      name: "Writer" 
    })],
  };
}

// 5. Build graph
const workflow = new StateGraph(AgentState)
  .addNode("researcher", researcherNode)
  .addNode("writer", writerNode)
  .addNode("supervisor", supervisor)
  .addEdge("researcher", "supervisor")
  .addEdge("writer", "supervisor")
  .addConditionalEdges("supervisor", (x) => x.next, {
    researcher: "researcher",
    writer: "writer",
    FINISH: END,
  })
  .addEdge(START, "supervisor");

// 6. Compile with persistence
const checkpointer = new MemorySaver();
const graph = workflow.compile({ checkpointer });

// 7. Execute
const config = { configurable: { thread_id: "1" } };
const result = await graph.invoke({
  messages: [new HumanMessage("Research AI trends and write a summary")],
}, config);
```

---

## 📚 Key Takeaways for Our Implementation

### What We Need to Use:

1. **State Definition**:
   - Use `Annotation.Root` for our persona multi-agent state
   - Include: `messages`, `selectedPersonas`, `personaResponses`, `mode`

2. **Checkpointer**:
   - Start with `MemorySaver` for development
   - Upgrade to `PostgresSaver` for production

3. **Memory Store**:
   - Use for persona memories across threads
   - Namespace by `[userId, personaName, "memories"]`

4. **Multi-Agent Pattern**:
   - Use supervisor architecture
   - Each persona = specialized agent node
   - Orchestrator node decides which personas respond

5. **Tool Integration**:
   - `createReactAgent` for persona agents with tools
   - Load persona.md files as system prompts

6. **Persistence**:
   - Thread IDs for conversations
   - Memory store for cross-conversation knowledge

---

## 🔗 Additional Resources

- **Official Docs**: https://docs.langchain.com/oss/javascript/langgraph/overview
- **Quickstart**: https://docs.langchain.com/oss/javascript/langgraph/quickstart
- **Multi-Agent Examples**: https://github.com/langchain-ai/langgraphjs/tree/main/examples/multi_agent
- **API Reference**: https://reference.langchain.com/javascript/modules/_langchain_langgraph.html
- **LangSmith**: https://docs.langchain.com/langsmith/trace-with-langgraph

---

**Created**: December 12, 2025  
**Purpose**: Technical supplement to LANGGRAPH_MULTIAGENT_PLAN.md  
**Status**: Ready for implementation reference 🚀
