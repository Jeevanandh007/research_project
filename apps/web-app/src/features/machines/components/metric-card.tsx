import { ReactNode } from 'react';
import { Card, Typography, Space } from 'antd';
import { Spin } from 'antd';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value?: number | string;
  unit?: string;
  isLoading?: boolean;
  variant?: 'default' | 'status';
  status?: boolean;
  description?: string;
}

export function MetricCard({
  icon,
  label,
  value,
  unit,
  isLoading = false,
  variant = 'default',
  status,
  description,
}: MetricCardProps) {
  const getStatusColor = (status: boolean) => {
    return status ? '#f6ffed' : '#fff1f0';
  };

  const getStatusTextColor = (status: boolean) => {
    return status ? '#52c41a' : '#ff4d4f';
  };

  return (
    <Card
      style={{
        height: '100%',
        backgroundColor:
          variant === 'status' && status !== undefined
            ? getStatusColor(status)
            : undefined,
      }}
      bodyStyle={{ height: '100%', padding: '16px' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Space>
          <span
            style={{
              color:
                variant === 'status' && status !== undefined
                  ? getStatusTextColor(status)
                  : '#1890ff',
            }}
          >
            {icon}
          </span>
          <Typography.Text type="secondary">{label}</Typography.Text>
        </Space>
        {isLoading ? (
          <div style={{ textAlign: 'center' }}>
            <Spin size="small" />
          </div>
        ) : (
          <Typography.Title
            level={3}
            style={{
              margin: 0,
              color:
                variant === 'status' && status !== undefined
                  ? getStatusTextColor(status)
                  : undefined,
            }}
          >
            {value}
            {unit && (
              <Typography.Text
                type="secondary"
                style={{ fontSize: '14px', marginLeft: '8px' }}
              >
                {unit}
              </Typography.Text>
            )}
          </Typography.Title>
        )}
        {description && (
          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
            {description}
          </Typography.Text>
        )}
      </Space>
    </Card>
  );
}
