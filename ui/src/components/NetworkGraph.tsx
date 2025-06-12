import React, { useEffect } from 'react';
import * as d3 from 'd3';

const NetworkGraph: React.FC = () => {
  useEffect(() => {
    fetch('/api/interactions')
      .then(r=>r.json())
      .then(data => {
        const nodes: Record<string, d3.SimulationNodeDatum & { id: string }> = {};
        const links: d3.SimulationLinkDatum<d3.SimulationNodeDatum>[] = [];
        data.forEach((d: any) => {
          nodes[d.source] = nodes[d.source] || { id: d.source };
          nodes[d.target] = nodes[d.target] || { id: d.target };
          links.push({ source: d.source, target: d.target });
        });
        const nodeList: (d3.SimulationNodeDatum & { id: string })[] = Object.values(nodes);
        const svg = d3.select('#network-svg');
        const width = +svg.attr('width'), height = +svg.attr('height');

        const sim = d3.forceSimulation<d3.SimulationNodeDatum>(nodeList)
          .force('link', d3.forceLink<d3.SimulationNodeDatum, d3.SimulationLinkDatum<d3.SimulationNodeDatum>>(links).id((d: any) => d.id).distance(100))
          .force('charge', d3.forceManyBody().strength(-200))
          .force('center', d3.forceCenter(width / 2, height / 2));

        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke','#999')
            .attr('stroke-width',2);

        const node = svg.append('g')
            .selectAll('circle')
            .data(nodeList)
            .join('circle')
            .attr('r',12)
            .attr('fill','#69c')
            .call(drag(sim) as any);

        const label = svg.append('g')
            .selectAll('text')
            .data(nodeList)
            .join('text')
            .text((d:any)=>d.id)
            .attr('dx',14)
            .attr('dy','0.35em');

        sim.on('tick', () => {
          link
            .attr('x1', (d: any)=>d.source.x)
            .attr('y1', (d: any)=>d.source.y)
            .attr('x2', (d: any)=>d.target.x)
            .attr('y2', (d: any)=>d.target.y);
          node
            .attr('cx', (d: any)=>d.x)
            .attr('cy', (d: any)=>d.y);
          label
            .attr('x', (d: any)=>d.x)
            .attr('y', (d: any)=>d.y);
        });

        function drag(sim:any) {
          function start(event:any,d:any){
            if(!event.active) sim.alphaTarget(0.3).restart();
            d.fx=d.x; d.fy=d.y;
          }
          function drag(event:any,d:any){
            d.fx=event.x; d.fy=event.y;
          }
          function end(event:any,d:any){
            if(!event.active) sim.alphaTarget(0);
            d.fx=null; d.fy=null;
          }
          return d3.drag()
            .on('start',start)
            .on('drag',drag)
            .on('end',end);
        }
      });
  }, []);

  return <svg id="network-svg" width="400" height="300"></svg>;
};

export default NetworkGraph;
