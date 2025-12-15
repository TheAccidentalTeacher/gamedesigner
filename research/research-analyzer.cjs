/**
 * ResearchAnalyzer - Phase 6 Day 3
 * 
 * Orchestrates multi-agent analysis of extracted research content.
 * Each persona analyzes the content from their unique expertise.
 */

class ResearchAnalyzer {
  constructor(apiKey, model = 'claude-sonnet-4-5') {
    this.apiKey = apiKey;
    this.model = model;
    this.anthropicUrl = 'https://api.anthropic.com/v1/messages';
    
    // Define analysis roles for each persona
    this.analysisRoles = {
      'master-teacher': {
        name: '👨‍🏫 Master Teacher',
        focus: 'Pedagogical Applications',
        prompt: 'Analyze how these tools could be used in teaching. Consider: ease of learning, student engagement, differentiation capabilities, assessment integration, and practical classroom/homeschool implementation.'
      },
      'classical-educator': {
        name: '📖 Classical Educator',
        focus: 'Educational Philosophy',
        prompt: 'Evaluate from a classical education perspective. Consider: alignment with trivium/quadrivium, development of critical thinking, exposure to primary sources, cultivation of wisdom and virtue.'
      },
      'strategist': {
        name: '📊 Strategist',
        focus: 'Strategic Opportunities',
        prompt: 'Analyze the competitive landscape and strategic opportunities. Consider: market positioning, unique value propositions, competitive advantages, pricing models, scalability, and business sustainability.'
      },
      'theologian': {
        name: '⛪ Theologian',
        focus: 'Worldview & Values',
        prompt: 'Examine from a biblical worldview (Reformed Baptist perspective). Consider: alignment with Christian values, potential theological concerns, opportunities for biblical integration, and impact on character formation.'
      },
      'technical-architect': {
        name: '🏗️ Technical Architect',
        focus: 'Technical Architecture',
        prompt: 'Evaluate technical implementation and architecture. Consider: technology stack, scalability, integration capabilities, API design, data security, and technical sustainability.'
      },
      'debugger': {
        name: '🐛 Debugger',
        focus: 'Problems & Gaps',
        prompt: 'Identify problems, limitations, contradictions, and gaps. Consider: what\'s missing, what doesn\'t make sense, potential pitfalls, oversights, and areas needing further research. Be critical and thorough.'
      },
      'writer': {
        name: '✍️ Writer',
        focus: 'Executive Summary',
        prompt: 'Create a clear, compelling executive summary. Distill key findings, highlight most important insights, and present actionable recommendations. Write for clarity and impact.'
      },
      'ux-designer': {
        name: '🎨 UX Designer',
        focus: 'User Experience',
        prompt: 'Analyze user experience and interface design. Consider: usability, accessibility, user flow, visual design, learning curve, and overall user satisfaction potential.'
      },
      'analyst': {
        name: '🔬 Analyst',
        focus: 'Data & Evidence',
        prompt: 'Examine data, evidence, and measurable outcomes. Consider: effectiveness metrics, research backing, user testimonials, comparative data, and quantifiable benefits.'
      },
      'gen-alpha-expert': {
        name: '🎮 Gen-Alpha Expert',
        focus: 'Engagement & Relevance',
        prompt: 'Evaluate appeal and effectiveness for Gen-Alpha learners. Consider: gamification, engagement mechanics, attention span accommodation, digital native preferences, and motivational design.'
      },
      'marketing-strategist': {
        name: '📢 Marketing Strategist',
        focus: 'Market Positioning',
        prompt: 'Analyze marketing approach and positioning. Consider: target audience fit, messaging effectiveness, brand differentiation, customer acquisition potential, and market messaging.'
      },
      'game-designer': {
        name: '🎯 Game Designer',
        focus: 'Engagement Mechanics',
        prompt: 'Evaluate engagement and gamification elements. Consider: motivation systems, feedback loops, progression mechanics, reward structures, and sustained engagement potential.'
      }
    };
  }

  /**
   * Analyze research results with multi-agent consortium
   */
  async analyze(query, extractedContent, chunks, selectedPersonas = null) {
    console.log(`[ResearchAnalyzer] Starting analysis for query: "${query}"`);
    console.log(`[ResearchAnalyzer] Extracted content: ${extractedContent.length} sources`);
    console.log(`[ResearchAnalyzer] Chunks: ${chunks.length}`);
    console.log(`[ResearchAnalyzer] selectedPersonas parameter:`, selectedPersonas);
    
    // Use all personas if none selected, otherwise use selected ones
    const personasToUse = selectedPersonas || Object.keys(this.analysisRoles);
    console.log(`[ResearchAnalyzer] Analyzing with ${personasToUse.length} personas`);
    if (selectedPersonas && selectedPersonas.length > 0) {
      console.log(`[ResearchAnalyzer] Using selected personas: ${selectedPersonas.join(', ')}`);
    } else {
      console.log(`[ResearchAnalyzer] Using all 12 personas (none selected)`);
    }

    const startTime = Date.now();

    // Prepare content summary for analysis
    const contentSummary = this.prepareContentSummary(extractedContent, chunks);

    // Run analyses SEQUENTIALLY with delays to avoid rate limits
    // Parallel execution can hit 450k tokens/min limit with large content
    console.log(`[ResearchAnalyzer] Starting ${personasToUse.length} analyses sequentially (rate limit safety)...`);
    
    const analyses = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < personasToUse.length; i++) {
      const personaId = personasToUse[i];
      const role = this.analysisRoles[personaId];
      
      if (!role) {
        console.warn(`[ResearchAnalyzer] Unknown persona: ${personaId}`);
        continue;
      }

      try {
        console.log(`[ResearchAnalyzer] 🔄 [${i + 1}/${personasToUse.length}] ${role.name} starting...`);
        const analysis = await this.analyzeWithPersona(query, contentSummary, personaId);
        console.log(`[ResearchAnalyzer] ✓ [${i + 1}/${personasToUse.length}] ${role.name} complete`);
        
        analyses.push({
          persona: personaId,
          name: role.name,
          focus: role.focus,
          analysis: analysis,
          timestamp: new Date().toISOString()
        });
        
        successCount++;
        
        // Add 1.5 second delay between requests to stay under rate limits
        if (i < personasToUse.length - 1) {
          console.log(`[ResearchAnalyzer] ⏳ Waiting 1.5s before next request...`);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
      } catch (error) {
        console.error(`[ResearchAnalyzer] ✗ [${i + 1}/${personasToUse.length}] ${role.name} failed:`, error.message);
        
        // If it's a rate limit error, wait longer
        if (error.message.includes('rate_limit') || error.message.includes('429')) {
          console.log(`[ResearchAnalyzer] 🛑 Rate limit hit, waiting 5 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        
        analyses.push({
          persona: personaId,
          name: role.name,
          focus: role.focus,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        failCount++;
      }
    }

    const analysisDuration = Date.now() - startTime;
    console.log(`[ResearchAnalyzer] ✅ All ${analyses.length} analyses complete in ${analysisDuration}ms (${successCount} succeeded, ${failCount} failed)`);

    // Only synthesize if we have at least one successful analysis
    let synthesis = null;
    if (successCount > 0) {
      console.log(`[ResearchAnalyzer] Synthesizing ${successCount} successful analyses...`);
      synthesis = await this.synthesizeAnalyses(query, analyses, contentSummary);
    } else {
      console.warn(`[ResearchAnalyzer] No successful analyses to synthesize`);
      synthesis = "# Analysis Failed\n\nAll analyses failed due to rate limits or errors. Please try again with fewer personas or wait a moment before retrying.";
    }

    return {
      query,
      analyses,
      synthesis,
      metadata: {
        analysisDuration,
        personaCount: personasToUse.length,
        successfulAnalyses: successCount,
        failedAnalyses: failCount,
        successfulAnalyses: analyses.filter(a => !a.error).length,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Prepare content summary for analysis
   */
  prepareContentSummary(extractedContent, chunks) {
    const sources = extractedContent
      .filter(c => !c.error)
      .map((content, index) => ({
        number: index + 1,
        title: content.title,
        url: content.url,
        wordCount: content.wordCount,
        excerpt: content.excerpt || content.content?.substring(0, 500) + '...',
        author: content.author,
        date: content.publishedDate
      }));

    // CRITICAL: Claude has 200K token limit, system prompt + user prompt + response must fit
    // ALSO: 450K tokens/min rate limit means sequential execution is safer
    // Strategy: Use LESS content per analysis to stay well under limits
    
    let fullContent = '';
    const maxContentChars = 150000; // ~37.5K tokens for content (more conservative for rate limits)
    
    if (chunks.length <= 6) {
      // Very few chunks: use them all
      fullContent = chunks.map(chunk => chunk.content).join('\n\n---\n\n');
    } else {
      // Many chunks: sample more aggressively (only 6 chunks total)
      const sampled = [];
      sampled.push(...chunks.slice(0, 2)); // Beginning (2 chunks)
      
      if (chunks.length > 6) {
        const middleIdx = Math.floor(chunks.length / 2);
        sampled.push(...chunks.slice(middleIdx, middleIdx + 2)); // Middle (2 chunks)
      }
      
      sampled.push(...chunks.slice(-2)); // End (2 chunks)
      
      fullContent = sampled.map((chunk, idx) => {
        const chunkNum = chunks.indexOf(chunk) + 1;
        return `[Chunk ${chunkNum}/${chunks.length}]\n${chunk.content}`;
      }).join('\n\n---\n\n');
      
      console.log(`[ResearchAnalyzer] Sampled ${sampled.length}/${chunks.length} chunks for analysis`);
    }
    
    // Final safety: hard truncate if still too large
    if (fullContent.length > maxContentChars) {
      fullContent = fullContent.substring(0, maxContentChars) + '\n\n[Content truncated due to length...]';
      console.log(`[ResearchAnalyzer] Content truncated to ${maxContentChars} chars`);
    }

    return {
      sources,
      fullContent,
      totalWords: extractedContent.reduce((sum, c) => sum + (c.wordCount || 0), 0),
      totalChunks: chunks.length,
      sampledChunks: chunks.length > 10 ? 12 : chunks.length
    };
  }

  /**
   * Analyze content with a specific persona
   */
  async analyzeWithPersona(query, contentSummary, personaId) {
    const role = this.analysisRoles[personaId];
    
    const systemPrompt = `You are ${role.name}, an expert analyst specializing in ${role.focus}.

Your task: ${role.prompt}

You are analyzing research content related to this query: "${query}"

Be thorough, specific, and actionable. Cite specific examples from the sources when relevant.`;

    const userPrompt = `# Research Query
"${query}"

# Sources Analyzed
${contentSummary.sources.map(s => `
**Source ${s.number}: ${s.title}**
- URL: ${s.url}
- Word Count: ${s.wordCount}
${s.author ? `- Author: ${s.author}` : ''}
${s.date ? `- Published: ${s.date}` : ''}
- Excerpt: ${s.excerpt}
`).join('\n')}

# Full Extracted Content
${contentSummary.totalChunks > 10 ? `Note: Large content (${contentSummary.totalChunks} chunks total). Analyzed ${contentSummary.sampledChunks} representative samples.\n\n` : ''}${contentSummary.fullContent}

---

Please provide your analysis focusing on ${role.focus}. Be specific, cite sources by number when relevant, and provide actionable insights.`;

    const response = await this.callClaude(systemPrompt, userPrompt);
    return response;
  }

  /**
   * Synthesize all analyses into coherent report
   */
  async synthesizeAnalyses(query, analyses, contentSummary) {
    console.log(`[ResearchAnalyzer] Synthesizing ${analyses.length} analyses...`);

    const successfulAnalyses = analyses.filter(a => !a.error);
    
    if (successfulAnalyses.length === 0) {
      return {
        error: 'No successful analyses to synthesize',
        timestamp: new Date().toISOString()
      };
    }

    const systemPrompt = `You are a research synthesis expert. Your task is to combine multiple expert analyses into a single, coherent, comprehensive research report.

Create a well-structured report that:
1. Starts with an executive summary
2. Organizes findings by theme/category
3. Highlights key insights and patterns across analyses
4. Provides clear, actionable recommendations
5. Notes areas of consensus and disagreement among experts
6. Identifies gaps for further research

Be thorough, clear, and actionable.`;

    const userPrompt = `# Research Query
"${query}"

# Sources Analyzed
${contentSummary.sources.map(s => `- **Source ${s.number}**: ${s.title} (${s.wordCount} words)`).join('\n')}

# Expert Analyses

${successfulAnalyses.map(a => `
## ${a.name} - ${a.focus}

${a.analysis}

---
`).join('\n')}

Please synthesize these expert analyses into a comprehensive research report with:
- Executive Summary
- Key Findings (organized by theme)
- Recommendations
- Areas for Further Research
- Source Citations

Format in clear Markdown with appropriate headings.`;

    const synthesis = await this.callClaude(systemPrompt, userPrompt);
    
    return {
      report: synthesis,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Call Claude API
   */
  async callClaude(systemPrompt, userPrompt) {
    const response = await fetch(this.anthropicUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }
}

module.exports = ResearchAnalyzer;
