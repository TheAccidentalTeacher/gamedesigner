/**
 * Multi-Agent API Client
 * Sprint 3: Frontend integration with backend multi-agent orchestration
 * 
 * Provides utilities to call the multi-agent API endpoint and handle responses
 */

class MultiAgentClient {
  constructor(apiBaseUrl = '/api') {
    this.apiBaseUrl = apiBaseUrl;
    this.endpoint = `${apiBaseUrl}/multi-agent`;
  }

  /**
   * Execute a multi-agent workflow
   * 
   * @param {string} question - The question to discuss
   * @param {string} mode - 'panel', 'consensus', or 'debate'
   * @param {string[]} personas - Optional array of persona names to use
   * @returns {Promise<object>} Response with synthesis and individual responses
   */
  async executeWorkflow(question, mode = 'panel', personas = null, options = {}) {
    try {
      const { provider = 'anthropic', model } = options;
      
      console.log(`%c🤖 Multi-Agent API Call`, 'color: #FF8800; font-weight: bold');
      console.log(`   📨 Mode: ${mode}`);
      console.log(`   🤖 Provider: ${provider}`);
      console.log(`   🤖 Model: ${model || '(default)'}`);
      console.log(`   ❓ Question: ${question.substring(0, 100)}${question.length > 100 ? '...' : ''}`);
      console.log(`   👥 Personas: ${personas?.length || 'auto-select'}`);
      console.log(`   🔗 Endpoint: ${this.endpoint}`);
      
      const payload = {
        question,
        mode,
        provider,
        ...(model && { model }),
        ...(personas && { personas })
      };

      console.log(`   📦 Payload:`, payload);

      console.log(`   📡 Fetching from: ${this.endpoint}`);
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      console.log(`   ✓ Response status: ${response.status}`);

      if (!response.ok) {
        console.log(`   ❌ HTTP Error: ${response.status}`);
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`   ✓ Response received, keys:`, Object.keys(data));
      
      if (!data.success) {
        console.log(`   ❌ API returned success=false`);
        throw new Error(data.error || 'Unknown error');
      }

      console.log(`   ✅ Success! Responses received:`, data.responses?.length || 0);
      return data;

      console.log(`✅ Multi-Agent Response received`);
      console.log(`   Mode: ${data.data.mode}`);
      console.log(`   Agents: ${data.data.personas.join(', ')}`);
      console.log(`   Time: ${data.data.metadata.executionTime}ms`);

      return data.data;

    } catch (error) {
      console.error('❌ Multi-Agent API Error:', error);
      throw error;
    }
  }

  /**
   * Execute a panel discussion
   * 
   * @param {string} question - The question to discuss
   * @param {string[]} personas - Optional personas for the panel
   * @returns {Promise<object>} Panel discussion results
   */
  async panelDiscussion(question, personas = null) {
    return this.executeWorkflow(question, 'panel', personas);
  }

  /**
   * Execute consensus voting
   * 
   * @param {string} question - The question to vote on
   * @param {string[]} personas - Optional personas for voting
   * @returns {Promise<object>} Consensus results
   */
  async consensusVoting(question, personas = null) {
    return this.executeWorkflow(question, 'consensus', personas);
  }

  /**
   * Execute a debate
   * 
   * @param {string} question - The question to debate
   * @param {string[]} personas - Optional personas for debate
   * @returns {Promise<object>} Debate results
   */
  async debate(question, personas = null) {
    return this.executeWorkflow(question, 'debate', personas);
  }

  /**
   * Format response for display
   * 
   * @param {object} data - Response data from API
   * @returns {object} Formatted response for UI
   */
  formatForDisplay(data) {
    return {
      question: data.question,
      mode: data.mode.charAt(0).toUpperCase() + data.mode.slice(1),
      personas: data.personas,
      synthesis: data.synthesis,
      responses: data.responses,
      timing: {
        executionTime: `${data.metadata.executionTime}ms`,
        timestamp: new Date(data.metadata.timestamp).toLocaleString()
      }
    };
  }
}

// Export for ES6 modules
export default MultiAgentClient;

// Also export as named export
export { MultiAgentClient };

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.MultiAgentClient = MultiAgentClient;
}
