import { Card } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import { MetricCard } from './metric-card';

interface MachineStatusCardProps {
  machineStatus: number;
  predictionStatus: number;
  isLoading?: boolean;
}

export function MachineStatusCard({
  machineStatus,
  isLoading = false,
  predictionStatus,
}: MachineStatusCardProps) {
  // Machine status: 0 = failed, 1 = running
  const textVal = machineStatus === 1 ? 'Running' : 'Failed';

  return (
    <MetricCard
      icon={<PoweroffOutlined />}
      label="Machine Status"
      value={predictionStatus != 1 ? 'Unknown' : textVal}
      isLoading={isLoading}
      variant="status"
      status={predictionStatus == 1 ? machineStatus === 1 : false}
    />
  );
}
