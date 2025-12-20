/**
 * Diagram Renderers - Phase 8 Week 3: Visual Rendering
 * 
 * Professional diagram rendering using specialized JavaScript libraries.
 * Each diagram type uses the best library for that specific visualization.
 * 
 * Libraries used:
 * - Mermaid.js: Flowcharts, Cause & Effect diagrams
 * - d3-venn: Venn Diagrams with perfect overlapping circles
 * - vis-timeline: Professional interactive timelines
 * - Cytoscape.js: Network graphs for Concept Maps
 * - markmap: Markdown to Mind Maps
 * - Custom HTML/CSS: KWL Charts (tables)
 */

export class DiagramRenderers {
    
    /**
     * Render a Mermaid diagram (Cause & Effect flowcharts)
     */
    static async renderMermaidDiagram(container, mermaidCode) {
        try {
            if (typeof mermaid === 'undefined') {
                throw new Error('Mermaid.js not loaded');
            }

            console.log('🎨 Rendering Mermaid diagram...');
            
            // Generate unique ID for diagram
            const diagramId = 'mermaid-svg-' + Date.now();
            
            // Render the diagram
            const { svg } = await mermaid.render(diagramId, mermaidCode);
            
            // Insert SVG into container
            container.innerHTML = svg;
            container.style.textAlign = 'center';
            container.style.padding = '20px';
            
            console.log('✅ Mermaid diagram rendered');
            
        } catch (error) {
            console.error('❌ Mermaid rendering error:', error);
            container.innerHTML = `
                <div style="padding: 20px; color: #ff6b6b; background: rgba(255, 107, 107, 0.1); border-radius: 8px; border: 1px solid #ff6b6b;">
                    <strong>Diagram Rendering Error</strong><br>
                    ${error.message}<br><br>
                    <details style="margin-top: 10px;">
                        <summary style="cursor: pointer;">Show Mermaid Code</summary>
                        <pre style="margin-top: 10px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; overflow-x: auto;">${mermaidCode}</pre>
                    </details>
                </div>
            `;
        }
    }

    /**
     * Render a Venn Diagram using d3-venn
     */
    static async renderVennDiagram(container, data) {
        try {
            // Check for venn library (try both global names)
            const vennLib = window.venn || window.vennjs;
            
            if (!vennLib && typeof d3 === 'undefined') {
                throw new Error('d3-venn library not loaded (d3 or venn global not found)');
            }
            
            if (!vennLib) {
                // Fallback: try to render with D3 directly if venn.js didn't load
                console.warn('⚠️ d3-venn not loaded, falling back to text representation');
                this.renderVennFallback(container, data);
                return;
            }

            // Parse Venn diagram data from Claude's response
            // Backend returns circle_a, circle_b, overlap (not an array!)
            let sets = [];
            let overlap = null;
            
            if (data.structure) {
                // Handle circle_a / circle_b format
                if (data.structure.circle_a && data.structure.circle_b) {
                    sets = [
                        {
                            id: 'circle_a',
                            label: data.structure.circle_a.label,
                            items: data.structure.circle_a.unique_characteristics || []
                        },
                        {
                            id: 'circle_b',
                            label: data.structure.circle_b.label,
                            items: data.structure.circle_b.unique_characteristics || []
                        }
                    ];
                    overlap = data.structure.overlap?.shared_characteristics || [];
                }
                // Handle circles array format (if backend changes)
                else if (data.structure.circles) {
                    sets = data.structure.circles;
                    overlap = data.structure.overlap;
                }
            }
            
            // Fallback: Check vennData property
            if (sets.length === 0 && data.vennData?.sets) {
                sets = data.vennData.sets;
                overlap = data.vennData.overlaps?.[0]?.items;
            }
            
            // Calculate overlap size
            const overlapSize = overlap ? (Array.isArray(overlap) ? overlap.length : (typeof overlap === 'object' ? overlap.items?.length || 0 : 0)) : 0;
            
            // Validate: Check if this makes sense for a Venn diagram
            if (sets.length === 2) {
                const set1Size = sets[0].items?.length || sets[0].unique_characteristics?.length || 0;
                const set2Size = sets[1].items?.length || sets[1].unique_characteristics?.length || 0;
                
                // Check if the data makes sense
                if (set1Size === 0 && set2Size === 0) {
                    console.warn('⚠️ WARNING: Both sets have no unique items - this is not a good Venn diagram!');
                    console.warn('⚠️ Consider using a different organizer type.');
                }
                
                if (overlapSize === 0) {
                    console.warn('⚠️ WARNING: No shared items - these sets don\'t overlap!');
                    console.warn('⚠️ This might be better as two separate lists.');
                }
                
                if (overlapSize > set1Size + set2Size) {
                    console.warn('⚠️ WARNING: More shared items than unique items!');
                    console.warn('⚠️ These concepts might be too similar for a Venn diagram.');
                }
            }
            
            // Transform to d3-venn format
            const vennData = [];
            
            // Add individual sets to vennData
            if (sets && sets.length > 0) {
                sets.forEach((set, index) => {
                    const setId = set.id || set.label || `set${index}`;
                    const uniqueSize = set.items ? set.items.length : set.unique_characteristics ? set.unique_characteristics.length : 5;
                    
                    // CRITICAL FIX: Size should be TOTAL (unique + shared), not just unique!
                    const totalSize = uniqueSize + overlapSize;
                    
                    vennData.push({
                        sets: [setId],
                        size: totalSize,
                        label: set.label || `Set ${index + 1}`
                    });
                });
                
                // Add overlap between all sets
                if (overlap && overlapSize > 0) {
                    const overlapSets = sets.map((s, i) => s.id || s.label || `set${i}`);
                    
                    vennData.push({
                        sets: overlapSets,
                        size: overlapSize
                    });
                }
            }
            
            // Create Venn diagram
            const chart = vennLib.VennDiagram()
                .width(700)
                .height(500);
            
            // Clear container and render
            container.innerHTML = '';
            container.style.textAlign = 'center';
            container.style.padding = '20px';
            
            const svg = d3.select(container)
                .datum(vennData)
                .call(chart);
            
            // Style circles with distinct colors
            const colors = ['#61dafb', '#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf'];
            
            d3.selectAll(container.querySelectorAll('.venn-circle'))
                .each(function(d, i) {
                    // Get the set name(s)
                    const isOverlap = d.sets.length > 1;
                    
                    d3.select(this).select('path')
                        .style('fill', isOverlap ? '#9b59b6' : colors[i % colors.length])
                        .style('fill-opacity', 0.4)
                        .style('stroke', isOverlap ? '#8e44ad' : colors[i % colors.length])
                        .style('stroke-width', 3);
                });
            
            // Style text labels
            d3.selectAll(container.querySelectorAll('.venn-circle text'))
                .style('fill', '#fff')
                .style('font-size', '16px')
                .style('font-weight', 'bold')
                .style('text-shadow', '0 0 3px rgba(0,0,0,0.8), 0 0 6px rgba(0,0,0,0.5)');
            
            // Add count labels to show the sizes
            d3.selectAll(container.querySelectorAll('.venn-circle'))
                .each(function(d, i) {
                    const node = d3.select(this);
                    const text = node.select('text');
                    const isOverlap = d.sets.length > 1;
                    
                    // Add size below label
                    if (!text.empty()) {
                        const bbox = text.node().getBBox();
                        node.append('text')
                            .attr('x', text.attr('x'))
                            .attr('y', parseFloat(text.attr('y')) + 20)
                            .style('fill', '#fff')
                            .style('font-size', '12px')
                            .style('font-weight', 'normal')
                            .style('text-shadow', '0 0 3px rgba(0,0,0,0.8)')
                            .text(`(${d.size} ${isOverlap ? 'shared' : 'items'})`);
                    }
                });
            
        } catch (error) {
            console.error('❌ Venn diagram rendering error:', error);
            this.renderVennFallback(container, data);
        }
    }
    
    /**
     * Fallback Venn diagram using HTML/CSS circles (when d3-venn fails)
     */
    static renderVennFallback(container, data) {
        console.log('🎨 Rendering Venn diagram fallback (HTML/CSS)...');
        
        const sets = data.vennData?.sets || [];
        const overlaps = data.vennData?.overlaps || [];
        
        let html = `
            <div style="text-align: center; padding: 20px;">
                <h3 style="color: #61dafb; margin-bottom: 20px;">${data.title || 'Venn Diagram'}</h3>
                <div style="position: relative; width: 500px; height: 400px; margin: 0 auto; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 20px;">
        `;
        
        // Draw circles as HTML divs
        if (sets.length === 2) {
            html += `
                <div style="position: absolute; top: 100px; left: 100px; width: 200px; height: 200px; border: 3px solid #61dafb; border-radius: 50%; background: rgba(97, 218, 251, 0.1);"></div>
                <div style="position: absolute; top: 100px; left: 200px; width: 200px; height: 200px; border: 3px solid #ff6b6b; border-radius: 50%; background: rgba(255, 107, 107, 0.1);"></div>
                
                <div style="position: absolute; top: 80px; left: 150px; color: #61dafb; font-weight: bold; background: rgba(0,0,0,0.8); padding: 5px 10px; border-radius: 4px;">${sets[0].label}</div>
                <div style="position: absolute; top: 80px; right: 100px; color: #ff6b6b; font-weight: bold; background: rgba(0,0,0,0.8); padding: 5px 10px; border-radius: 4px;">${sets[1].label}</div>
            `;
        }
        
        html += `</div>`;
        
        // Add text lists below
        html += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; text-align: left;">`;
        
        sets.forEach((set, i) => {
            html += `
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; border: 1px solid ${i === 0 ? '#61dafb' : '#ff6b6b'};">
                    <h4 style="color: ${i === 0 ? '#61dafb' : '#ff6b6b'}; margin: 0 0 10px 0;">${set.label}</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        ${set.items ? set.items.map(item => `<li>${item}</li>`).join('') : ''}
                    </ul>
                </div>
            `;
        });
        
        html += `</div>`;
        
        if (overlaps.length > 0 && overlaps[0].items) {
            html += `
                <div style="background: rgba(138, 140, 251, 0.1); padding: 15px; border-radius: 8px; border: 1px solid #8a8cfb; margin-top: 20px;">
                    <h4 style="color: #8a8cfb; margin: 0 0 10px 0;">⚡ Shared Characteristics</h4>
                    <ul style="margin: 0; padding-left: 20px;">
                        ${overlaps[0].items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        html += `</div>`;
        
        container.innerHTML = html;
        console.log('✅ Venn diagram fallback rendered');
    }

    /**
     * Render an interactive Timeline using vis-timeline
     */
    static async renderTimeline(container, data) {
        try {
            if (typeof vis === 'undefined') {
                throw new Error('vis-timeline library not loaded');
            }

            console.log('🎨 Rendering timeline...', data);
            
            // Clear container
            container.innerHTML = '';
            container.style.height = '400px';
            
            // Convert events to vis-timeline format
            const items = new vis.DataSet();
            
            if (data.timelineData && data.timelineData.events) {
                data.timelineData.events.forEach((event, index) => {
                    const item = {
                        id: event.id || index,
                        content: event.content || event.label || 'Event',
                        start: event.start,
                        type: event.type === 'range' ? 'range' : 'point'
                    };
                    
                    if (event.end && event.type === 'range') {
                        item.end = event.end;
                    }
                    
                    items.add(item);
                });
            }
            
            console.log('Timeline items prepared:', items);
            
            // Timeline options
            const options = {
                height: '400px',
                zoomable: true,
                moveable: true,
                margin: {
                    item: 20,
                    axis: 40
                },
                orientation: 'top'
            };
            
            // Create timeline
            const timeline = new vis.Timeline(container, items, options);
            
            console.log('✅ Timeline rendered');
            
        } catch (error) {
            console.error('❌ Timeline rendering error:', error);
            this.renderErrorFallback(container, error, 'Timeline');
        }
    }

    /**
     * Render a Concept Map using Cytoscape.js
     */
    static async renderConceptMap(container, data) {
        try {
            if (typeof cytoscape === 'undefined') {
                throw new Error('Cytoscape.js library not loaded');
            }

            console.log('🎨 Rendering concept map...', data);
            
            // Clear container and set size
            container.innerHTML = '';
            container.style.height = '600px';
            container.style.background = 'rgba(0, 0, 0, 0.2)';
            container.style.borderRadius = '8px';
            
            // Prepare elements for Cytoscape
            const elements = [];
            
            // Add nodes
            if (data.conceptMapData && data.conceptMapData.nodes) {
                data.conceptMapData.nodes.forEach(node => {
                    elements.push({
                        data: {
                            id: node.id,
                            label: node.label,
                            type: node.type || 'concept'
                        }
                    });
                });
            }
            
            // Add edges
            if (data.conceptMapData && data.conceptMapData.edges) {
                data.conceptMapData.edges.forEach((edge, index) => {
                    elements.push({
                        data: {
                            id: `edge-${index}`,
                            source: edge.source,
                            target: edge.target,
                            label: edge.label || ''
                        }
                    });
                });
            }
            
            console.log('Concept map elements prepared:', elements);
            
            // Create Cytoscape instance
            const cy = cytoscape({
                container: container,
                elements: elements,
                layout: {
                    name: 'cose',
                    animate: true,
                    animationDuration: 500,
                    nodeRepulsion: 8000,
                    idealEdgeLength: 100,
                    edgeElasticity: 100
                },
                style: [
                    {
                        selector: 'node',
                        style: {
                            'background-color': '#61dafb',
                            'label': 'data(label)',
                            'text-valign': 'center',
                            'text-halign': 'center',
                            'color': '#000',
                            'font-size': '14px',
                            'font-weight': 'bold',
                            'width': 'label',
                            'height': 'label',
                            'padding': '15px',
                            'shape': 'roundrectangle',
                            'text-wrap': 'wrap',
                            'text-max-width': '150px'
                        }
                    },
                    {
                        selector: 'node[type="central"]',
                        style: {
                            'background-color': '#ff6b6b',
                            'width': 'label',
                            'height': 'label',
                            'padding': '20px',
                            'font-size': '16px'
                        }
                    },
                    {
                        selector: 'edge',
                        style: {
                            'width': 3,
                            'line-color': '#61dafb',
                            'target-arrow-color': '#61dafb',
                            'target-arrow-shape': 'triangle',
                            'label': 'data(label)',
                            'font-size': '12px',
                            'text-rotation': 'autorotate',
                            'color': '#fff',
                            'text-background-color': '#20232a',
                            'text-background-opacity': 0.8,
                            'text-background-padding': '3px',
                            'curve-style': 'bezier'
                        }
                    }
                ],
                userZoomingEnabled: true,
                userPanningEnabled: true
            });
            
            // Add interaction
            cy.on('tap', 'node', function(evt) {
                const node = evt.target;
                console.log('Clicked node:', node.data('label'));
            });
            
            console.log('✅ Concept map rendered');
            
        } catch (error) {
            console.error('❌ Concept map rendering error:', error);
            this.renderErrorFallback(container, error, 'Concept Map');
        }
    }

    /**
     * Render a Mind Map using markmap (or HTML fallback)
     */
    static async renderMindMap(container, data) {
        try {
            // Check if markmap loaded via autoloader
            const hasMarkmap = window.markmap || (window.markmap && window.markmap.Markmap);
            
            if (!hasMarkmap) {
                console.warn('⚠️ markmap not loaded, using HTML fallback');
                this.renderMindMapFallback(container, data);
                return;
            }

            console.log('🎨 Rendering mind map...', data);
            
            // Clear container and add SVG
            container.innerHTML = '<svg id="markmap-svg" style="width: 100%; height: 500px;"></svg>';
            
            // Convert structure to markdown
            let markdown = '# ' + (data.title || 'Mind Map') + '\n\n';
            
            if (data.mindMapData && data.mindMapData.branches) {
                data.mindMapData.branches.forEach(branch => {
                    markdown += `## ${branch.label}\n`;
                    if (branch.children) {
                        branch.children.forEach(child => {
                            markdown += `### ${child}\n`;
                        });
                    }
                });
            }
            
            console.log('Mind map markdown:', markdown);
            
            // Markmap autoloader should handle rendering
            const svg = container.querySelector('#markmap-svg');
            const { Markmap } = window.markmap;
            
            if (Markmap && Markmap.create) {
                Markmap.create(svg, {}, markdown);
                console.log('✅ Mind map rendered');
            } else {
                throw new Error('Markmap.create not available');
            }
            
        } catch (error) {
            console.error('❌ Mind map rendering error:', error);
            this.renderMindMapFallback(container, data);
        }
    }
    
    /**
     * Fallback mind map using HTML lists
     */
    static renderMindMapFallback(container, data) {
        console.log('🎨 Rendering mind map fallback (HTML list)...');
        
        let html = `
            <div style="padding: 20px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                <h3 style="color: #61dafb; text-align: center; margin-bottom: 20px;">${data.title || 'Mind Map'}</h3>
        `;
        
        if (data.mindMapData && data.mindMapData.branches) {
            html += `<ul style="list-style: none; padding-left: 0;">`;
            
            data.mindMapData.branches.forEach(branch => {
                html += `
                    <li style="margin-bottom: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 10px 15px; border-radius: 8px; font-weight: bold; color: white; display: inline-block;">
                            ${branch.label}
                        </div>
                `;
                
                if (branch.children && branch.children.length > 0) {
                    html += `<ul style="margin-top: 10px; margin-left: 30px; list-style: circle;">`;
                    branch.children.forEach(child => {
                        html += `<li style="margin: 5px 0; color: #cccccc;">${child}</li>`;
                    });
                    html += `</ul>`;
                }
                
                html += `</li>`;
            });
            
            html += `</ul>`;
        }
        
        html += `</div>`;
        
        container.innerHTML = html;
        console.log('✅ Mind map fallback rendered');
    }

    /**
     * Render a KWL Chart using HTML tables
     */
    static async renderKWLChart(container, data) {
        try {
            console.log('🎨 Rendering KWL chart...', data);
            
            // Build HTML table
            let html = `
                <style>
                    .kwl-chart {
                        width: 100%;
                        border-collapse: collapse;
                        background: rgba(255, 255, 255, 0.02);
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    .kwl-chart th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 15px;
                        text-align: left;
                        font-size: 16px;
                        font-weight: bold;
                        border-bottom: 2px solid #61dafb;
                    }
                    .kwl-chart td {
                        padding: 15px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        vertical-align: top;
                        line-height: 1.6;
                    }
                    .kwl-chart tr:hover {
                        background: rgba(97, 218, 251, 0.05);
                    }
                </style>
                <table class="kwl-chart">
                    <thead>
                        <tr>
                            <th style="width: 33%;">What I <strong>KNOW</strong></th>
                            <th style="width: 33%;">What I <strong>WANT</strong> to Know</th>
                            <th style="width: 34%;">What I <strong>LEARNED</strong></th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            // Add rows
            if (data.kwlData && data.kwlData.rows) {
                data.kwlData.rows.forEach(row => {
                    html += `
                        <tr>
                            <td>${row.know || ''}</td>
                            <td>${row.want || ''}</td>
                            <td>${row.learned || ''}</td>
                        </tr>
                    `;
                });
            }
            
            html += `
                    </tbody>
                </table>
            `;
            
            container.innerHTML = html;
            console.log('✅ KWL chart rendered');
            
        } catch (error) {
            console.error('❌ KWL chart rendering error:', error);
            this.renderErrorFallback(container, error, 'KWL Chart');
        }
    }

    /**
     * Render error fallback with helpful information
     */
    static renderErrorFallback(container, error, diagramType) {
        container.innerHTML = `
            <div style="padding: 30px; color: #ff6b6b; background: rgba(255, 107, 107, 0.1); border-radius: 8px; border: 1px solid #ff6b6b;">
                <h3 style="margin: 0 0 15px 0; color: #ff6b6b;">⚠️ ${diagramType} Rendering Error</h3>
                <p style="margin: 0 0 10px 0;"><strong>Error:</strong> ${error.message}</p>
                <p style="margin: 0; font-size: 12px; opacity: 0.8;">
                    This usually means the required library failed to load. Check console for details.
                </p>
                <details style="margin-top: 15px;">
                    <summary style="cursor: pointer; font-size: 14px;">Show Stack Trace</summary>
                    <pre style="margin-top: 10px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${error.stack || 'No stack trace available'}</pre>
                </details>
            </div>
        `;
    }

    /**
     * Render text fallback when libraries aren't loaded
     */
    static renderTextFallback(container, data) {
        container.innerHTML = `
            <div style="padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <p style="margin: 0 0 15px 0; color: #ffd93d; font-weight: bold;">⚠️ Diagram library not loaded</p>
                <p style="margin: 0 0 10px 0; font-size: 14px;">Showing text representation instead:</p>
                <pre style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; font-size: 13px; line-height: 1.6;">${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
    }
}

// Make globally available
window.DiagramRenderers = DiagramRenderers;

console.log('✅ DiagramRenderers module loaded');
