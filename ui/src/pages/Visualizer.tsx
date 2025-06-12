import React from 'react';
import NetworkGraph from '../components/NetworkGraph';

const Visualizer: React.FC = () => (
  <div style={{ padding: 16 }}>
    <h2>Interaction Visualizer</h2>
    <NetworkGraph />
  </div>
);

export default Visualizer;
