import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import HeaderBar from './components/HeaderBar';
import SideBar from './components/SideBar';
import Dashboard  from './pages/Dashboard';
import Visualizer from './pages/Visualizer';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import { SocketProvider } from './contexts/SocketContext';

const { Content } = Layout;

const App: React.FC = () => (
  <SocketProvider>
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <SideBar />
        <Layout>
          <HeaderBar />
          <Content style={{ margin: 16 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/visualizer" element={<Visualizer />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  </SocketProvider>
);

export default App;
