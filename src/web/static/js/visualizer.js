// Fetch the logged interactions
fetch('/api/interactions')
  .then(r => r.json())
  .then(data => {
    const nodes = {};
    const links = [];

    data.forEach(d => {
      if (!nodes[d.source]) nodes[d.source] = {id: d.source};
      if (!nodes[d.target]) nodes[d.target] = {id: d.target};
      links.push({source: d.source, target: d.target, type: d.type});
    });

    const nodeList = Object.values(nodes);
    const svg  = d3.select('svg');
    const width  = +svg.attr('width');
    const height = +svg.attr('height');

    const simulation = d3.forceSimulation(nodeList)
      .force('link', d3.forceLink(links)
                       .id(d => d.id)
                       .distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Draw links
    const link = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
        .attr('stroke-width', 2);

    // Draw nodes
    const node = svg.append('g')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodeList)
      .join('circle')
        .attr('r', 20)
        .attr('fill', '#69b3a2')
        .call(drag(simulation));

    // Labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodeList)
      .join('text')
        .attr('dx', 24)
        .attr('dy', '0.35em')
        .text(d => d.id);

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Dragging support
    function drag(sim) {
      function dragstarted(event, d) {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      }
      function dragged(event, d) {
        d.fx = event.x; d.fy = event.y;
      }
      function dragended(event, d) {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null; d.fy = null;
      }
      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
  })
  .catch(err => console.error("Failed to load interactions:", err));
