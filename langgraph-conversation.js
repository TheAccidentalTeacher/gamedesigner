import { Anthropic } from '@anthropic-ai/sdk';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';

// Persona definitions with speaking styles
const PERSONAS = {
  'master-teacher': {
    name: 'Master Teacher',
    icon: '👨‍🏫',
    style: 'Authoritative educator who explains concepts deeply',
    tendency: 'detailed_first' // Often speaks in detail
  },
  'classical-educator': {
    name: 'Classical Educator',
    icon: '📖',
    style: 'Values tradition and foundational learning',
    tendency: 'balanced'
  },
  'strategist': {
    name: 'Strategist',
    icon: '📊',
    style: 'Big-picture thinker focused on outcomes',
    tendency: 'brief_first'
  },
  'theologian': {
    name: 'Theologian',
    icon: '⛪',
    style: 'Brings ethical and philosophical perspective',
    tendency: 'detailed_first'
  },
  'technical-architect': {
    name: 'Technical Architect',
    icon: '🏗️',
    style: 'Systematic problem solver, implementation-focused',
    tendency: 'balanced'
  },
  'debugger': {
    name: 'Debugger',
    icon: '🐛',
    style: 'Finds flaws and edge cases in thinking',
    tendency: 'challenge'
  },
  'writer': {
    name: 'Writer',
    icon: '✍️',
    style: 'Clear communicator who values narrative',
    tendency: 'balanced'
  },
  'ux-designer': {
    name: 'UX Designer',
    icon: '🎨',
    style: 'User-centric, focuses on experience',
    tendency: 'brief_first'
  },
  'analyst': {
    name: 'Analyst',
    icon: '🔬',
    style: 'Data-driven, evidence-based',
    tendency: 'detailed_first'
  },
  'gen-alpha-expert': {
    name: 'Gen-Alpha Expert',
    icon: '🎮',
    style: 'Modern, trend-aware, relatable to younger audiences',
    tendency: 'brief_first'
  },
  'marketing-strategist': {
    name: 'Marketing Strategist',
    icon: '📢',
    style: 'Persuasive, outcome-focused, market-aware',
    tendency: 'balanced'
  },
  'game-designer': {
    name: 'Game Designer',
    icon: '🎯',
    style: 'Thinks about engagement, progression, and motivation',
    tendency: 'balanced'
  }
};

// Utility to create LLM client
function createLLMClient(model, provider) {
  if (provider === 'openai') {
    return new ChatOpenAI({
      modelName: model || 'gpt-4-turbo',
      temperature: 0.7,
      maxTokens: 1000
    });
  } else {
    return new ChatAnthropic({
      modelName: model || 'claude-3-5-sonnet-20241022',
      temperature: 0.7,
      maxTokens: 1000
    });
  }
}

// Main conversation orchestrator
export async function executeConversation(input) {
  const {
    question,
    selectedPersonas = [],
    provider = 'anthropic',
    model = undefined,
    conversationHistory = [],
    userInterjection = null,
    expandOnPersona = null,
    roundLimit = 3
  } = input;

  // Use all personas if none selected
  const activePersonas = selectedPersonas.length > 0 
    ? selectedPersonas 
    : Object.keys(PERSONAS);

  console.log('\n═══════════════════════════════════════');
  console.log('🎙️  CONVERSATION INITIALIZED');
  console.log('═══════════════════════════════════════');
  console.log(`❓ Topic: "${question.substring(0, 100)}..."`);
  console.log(`👥 Participants: ${activePersonas.length} personas`);
  console.log(`🔄 Rounds: ${roundLimit}`);
  console.log(`💬 Current exchanges: ${conversationHistory.length}`);
  if (userInterjection) console.log(`👤 User interjection: "${userInterjection}"`);
  if (expandOnPersona) console.log(`🔍 Expanding on: ${expandOnPersona}`);
  console.log('═══════════════════════════════════════\n');

  const allMessages = [];
  let currentRound = Math.floor(conversationHistory.length / activePersonas.length) + 1;

  try {
    // Process user interjection if present
    if (userInterjection) {
      allMessages.push({
        speaker: 'You',
        role: 'user',
        message: userInterjection,
        timestamp: new Date().toISOString(),
        responseType: 'user_input'
      });
      console.log(`\n👤 [You]: ${userInterjection}`);
    }

    // Generate next speaker responses
    const speakersForRound = selectNextSpeakers(
      activePersonas,
      conversationHistory,
      expandOnPersona,
      userInterjection
    );

    for (const speakerId of speakersForRound) {
      if (currentRound > roundLimit) break;

      const persona = PERSONAS[speakerId];
      const response = await generateResponse({
        speakerId,
        persona,
        question,
        conversationHistory: [...conversationHistory, ...allMessages],
        userInterjection,
        expandOnPersona,
        provider,
        model
      });

      allMessages.push({
        speaker: persona.name,
        speakerId,
        role: 'assistant',
        message: response.message,
        responseType: response.type,
        timestamp: new Date().toISOString(),
        icon: persona.icon
      });

      console.log(`\n${persona.icon} [${persona.name}]: ${response.message.substring(0, 100)}...`);
    }

    // Compile full conversation history
    const fullHistory = [...conversationHistory, ...allMessages];

    return {
      success: true,
      conversationHistory: fullHistory,
      lastMessages: allMessages,
      roundCount: currentRound,
      nextSuggestedActions: suggestNextActions(fullHistory, activePersonas),
      stats: {
        totalExchanges: fullHistory.length,
        uniqueSpeakers: new Set(fullHistory.map(m => m.speakerId || 'You')).size,
        currentRound
      }
    };

  } catch (error) {
    console.error('❌ Conversation error:', error.message);
    throw error;
  }
}

// Select who speaks next based on context
function selectNextSpeakers(activePersonas, history, expandOnPersona, userInterjection) {
  // If expanding on a persona, they speak first
  if (expandOnPersona && PERSONAS[expandOnPersona]) {
    // Then add 1-2 complementary speakers
    const complement = activePersonas
      .filter(p => p !== expandOnPersona && !history.some(m => m.speakerId === p))
      .slice(0, 2);
    return [expandOnPersona, ...complement];
  }

  // If user just spoke, pick 2-3 speakers to respond
  if (userInterjection) {
    // Prefer personas who haven't spoken recently
    const recentSpeakers = history.slice(-6).map(m => m.speakerId);
    const fresh = activePersonas.filter(p => !recentSpeakers.includes(p));
    
    if (fresh.length >= 2) {
      return fresh.slice(0, 3);
    }
    return activePersonas.slice(0, 3);
  }

  // Normal case: pick 2 speakers who haven't spoken recently
  const recentSpeakers = history.slice(-4).map(m => m.speakerId);
  const candidates = activePersonas.filter(p => !recentSpeakers.includes(p));
  
  if (candidates.length >= 2) {
    return shuffleArray(candidates).slice(0, 2);
  }
  return shuffleArray(activePersonas).slice(0, 2);
}

// Generate response from a persona
async function generateResponse({
  speakerId,
  persona,
  question,
  conversationHistory,
  userInterjection,
  expandOnPersona,
  provider,
  model
}) {
  const llm = createLLMClient(model, provider);

  // Build conversation context
  const historyText = conversationHistory
    .map(m => `${m.speaker}: ${m.message}`)
    .join('\n\n');

  // Determine response instruction
  let responseInstruction = '';
  if (expandOnPersona === speakerId) {
    responseInstruction = 'Provide a DETAILED, comprehensive response (5-8 sentences). Go deep on this topic.';
  } else if (userInterjection) {
    responseInstruction = 'RESPOND TO what was just said. Keep it conversational but substantive (2-4 sentences).';
  } else if (persona.tendency === 'brief_first') {
    responseInstruction = 'Lead with a concise take (1-2 sentences) then expand if needed.';
  } else if (persona.tendency === 'detailed_first') {
    responseInstruction = 'Provide thoughtful, detailed response (3-5 sentences).';
  } else {
    responseInstruction = 'Provide a balanced response (2-4 sentences).';
  }

  const prompt = `You are ${persona.name}, a ${persona.style}.

Your speaking style: You tend to be ${persona.tendency.replace('_', ' ')}.

CONVERSATION SO FAR:
${historyText || '(First message)'}

ORIGINAL QUESTION: ${question}

${userInterjection ? `LATEST COMMENT: "${userInterjection}"` : ''}

${expandOnPersona === speakerId ? 'KEY INSTRUCTION: The group wants to flesh out your idea further. Provide rich detail.' : ''}

RESPONSE INSTRUCTION: ${responseInstruction}

Respond naturally, as if in a conversation. Be your authentic persona. Don't start with "As a [role]..." Just speak.
Keep response under 200 words.`;

  try {
    const response = await llm.invoke([{ role: 'user', content: prompt }]);
    const message = response.content;

    // Determine response type
    let responseType = 'standard';
    if (message.length > 300) responseType = 'detailed';
    if (message.length < 100) responseType = 'brief';
    if (expandOnPersona === speakerId) responseType = 'expansion';

    return {
      message,
      type: responseType
    };

  } catch (error) {
    console.error(`Error generating response for ${persona.name}:`, error.message);
    throw error;
  }
}

// Suggest next actions for UI
function suggestNextActions(history, activePersonas) {
  const actions = [];

  // Find ideas mentioned in last exchange
  const lastMessage = history[history.length - 1]?.message || '';
  const ideaMatches = lastMessage.match(/\b(idea|point|concept|approach|strategy)\b/gi);
  
  if (ideaMatches) {
    actions.push({
      type: 'expand',
      label: 'Expand on that idea',
      description: 'Have the last speaker elaborate further'
    });
  }

  // Suggest steering options
  actions.push({
    type: 'steer',
    label: 'Steer conversation',
    description: 'Guide discussion in a new direction'
  });

  // Suggest next speaker
  actions.push({
    type: 'next',
    label: 'Continue conversation',
    description: 'Next speakers respond'
  });

  // Suggest summary
  actions.push({
    type: 'summarize',
    label: 'Summarize',
    description: 'Get a synthesis of discussion so far'
  });

  return actions;
}

// Helper: shuffle array
function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export { PERSONAS };
