import { ExperimentOutlined } from '@ant-design/icons';
import { MetricCard } from './metric-card';

interface PredictionStatusCardProps {
  predictionStatus: number;
  isLoading?: boolean;
}

export function PredictionStatusCard({
  predictionStatus,
  isLoading = false,
}: PredictionStatusCardProps) {
  // Prediction status: 0 = pending, 1 = completed, 2 = exception
  const getStatusInfo = () => {
    switch (predictionStatus) {
      case 0:
        return { value: 'Pending', enabled: false };
      case 1:
        return { value: 'Completed', enabled: true };
      case 2:
        return { value: 'Exception', enabled: false };
      default:
        return { value: 'Unknown', enabled: false };
    }
  };

  const { value, enabled } = getStatusInfo();

  return (
    <MetricCard
      icon={<ExperimentOutlined />}
      label="Prediction Status"
      value={value}
      isLoading={isLoading}
      variant="status"
      status={enabled}
    />
  );
}
