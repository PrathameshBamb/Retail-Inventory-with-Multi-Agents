import React from 'react';
import { Card, Typography } from 'antd';

interface KpiCardProps { title:string; value:number; trend?:number; }
export const KpiCard:React.FC<KpiCardProps> = ({ title,value,trend }) => (
  <Card hoverable>
    <Typography.Text type="secondary">{title}</Typography.Text>
    <Typography.Title level={2}>{value}</Typography.Title>
    {trend!==undefined && (
      <Typography.Text type={trend>=0?'success':'danger'}>
        {trend>=0?'▲':'▼'} {Math.abs(trend)}%
      </Typography.Text>
    )}
  </Card>
);
