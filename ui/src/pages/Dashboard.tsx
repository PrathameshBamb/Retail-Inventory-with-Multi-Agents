import React from 'react';
import { Row, Col } from 'antd';
import { KpiCard } from '../components/KpiCard';
import StockChart     from '../components/StockChart';
import EventFeed      from '../components/EventFeed';
import NetworkGraph   from '../components/NetworkGraph';
import AlertsPanel    from '../components/AlertsPanel';

const Dashboard: React.FC = () => (
  <Row gutter={[16,16]}>
    <Col span={8}><KpiCard title="Stock Level" value={153} trend={5} /></Col>
    <Col span={8}><KpiCard title="Forecast"   value={128} trend={-2} /></Col>
    <Col span={8}><KpiCard title="Reorder Qty" value={153} /></Col>

    <Col span={16}><StockChart /></Col>
    <Col span={8}><EventFeed /></Col>
    <Col span={8}><NetworkGraph /></Col>
    <Col span={16}><AlertsPanel /></Col>
  </Row>
);

export default Dashboard;
