const { executeConversation, PERSONAS } = require('../../langgraph-conversation.js');

exports.handler = async (event) => {
  const requestId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log('\n================================================================================');
  console.log('🎙️  CONVERSATION API INVOKED - Request ID: ' + requestId);
  console.log('================================================================================');
  console.log(`[API] Timestamp: ${new Date().toISOString()}`);
  console.log(`[API] HTTP Method: ${event.httpMethod}`);
  console.log(`[API] Path: ${event.path}`);

  try {
    // Parse request body
    console.log('[API] 📦 Parsing request body...');
    const body = JSON.parse(event.body || '{}');
    console.log('[API] ✓ Body parsed successfully');
    console.log('[API] Request keys:', Object.keys(body).join(', '));
    
    const {
      question,
      selectedPersonas = [],
      provider = 'anthropic',
      model = undefined,
      conversationHistory = [],
      userInterjection = null,
      expandOnPersona = null,
      roundLimit = 3
    } = body;

    console.log(`[API] Question: "${question?.substring(0, 50)}..."`);
    console.log(`[API] Provider: ${provider}`);
    console.log(`[API] Model: ${model || '(default)'}`);
    console.log(`[API] Personas selected: ${selectedPersonas.length}`);
    console.log(`[API] History length: ${conversationHistory.length}`);
    if (userInterjection) console.log(`[API] User interjection: "${userInterjection.substring(0, 50)}..."`);

    // Validate request
    console.log('[API] 🔍 Validating request...');
    if (!question || question.trim().length === 0) {
      throw new Error('Question is required');
    }
    if (selectedPersonas.length === 0) {
      console.log('[API] ⚠️  No personas selected, using all defaults');
    }
    console.log('[API] ✓ Request validation passed');

    // Execute conversation
    console.log('[API] 🚀 Executing conversation...');
    console.log('[API] ▶️ Starting agent orchestration');

    const result = await executeConversation({
      question,
      selectedPersonas,
      provider,
      model,
      conversationHistory,
      userInterjection,
      expandOnPersona,
      roundLimit
    });

    console.log('[API] ✅ Conversation completed in', new Date().toISOString());
    console.log(`[API] ✅ Messages: ${result.conversationHistory.length}`);
    console.log(`[API] ✅ New messages this turn: ${result.lastMessages.length}`);
    console.log(`[API] 📤 Returning response`);
    console.log('================================================================================\n');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: {
          conversationHistory: result.conversationHistory,
          lastMessages: result.lastMessages,
          roundCount: result.roundCount,
          nextSuggestedActions: result.nextSuggestedActions,
          stats: result.stats
        }
      })
    };

  } catch (error) {
    console.error('[API] ❌ Error:', error.message);
    console.log('================================================================================\n');

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
