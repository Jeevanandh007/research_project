import { Row, Col } from 'antd';
import {
  DashboardOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  PoweroffOutlined,
  ExperimentOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { MetricCard } from '../components/metric-card';
import { MachineStatusCard } from '../components/machine-status-card';
import { PredictionStatusCard } from '../components/prediction-status-card';
import { useMachineMetrics } from '../hooks/use-machine-metrics';

const METRIC_CONFIGS = [
  {
    id: 'air_temp',
    name: 'Air Temperature',
    unit: 'K',
    icon: <ThunderboltOutlined />,
    range: '298-302 K', // 300 ± 2K
  },
  {
    id: 'process_temp',
    name: 'Process Temperature',
    unit: 'K',
    icon: <ThunderboltOutlined />,
    range: '309-311 K', // (300 + 10) ± 1K
  },
  {
    id: 'rotational_speed',
    name: 'Rotational Speed',
    unit: 'rpm',
    icon: <DashboardOutlined />,
    range: '~2800 rpm', // Based on 2860W power
  },
  {
    id: 'torque',
    name: 'Torque',
    unit: 'Nm',
    icon: <DashboardOutlined />,
    range: '30-50 Nm', // 40 ± 10Nm
  },
  {
    id: 'tool_wear',
    name: 'Tool Wear',
    unit: 'min',
    icon: <ToolOutlined />,
    range: '2-5 min/cycle', // Based on quality variants
  },
];

export function Realtime() {
  const { data, isLoading } = useMachineMetrics();

  // Get first machine data if available
  const machineData = data?.[0];

  return (
    <Row gutter={[24, 24]}>
      {/* Machine Status Card */}
      <Col xs={24} sm={12} md={8}>
        <MachineStatusCard
          machineStatus={machineData?.machineStatus ?? 0}
          predictionStatus={machineData?.predictionStatus ?? 0}
          isLoading={isLoading}
        />
      </Col>

      {/* Prediction Status Card */}
      <Col xs={24} sm={12} md={8}>
        <PredictionStatusCard
          predictionStatus={machineData?.predictionStatus ?? 0}
          isLoading={isLoading}
        />
      </Col>

      {/* Specific Metric Cards */}
      {METRIC_CONFIGS.map((config) => {
        const metricValue = (() => {
          switch (config.id) {
            case 'air_temp':
              return machineData?.airTemperature;
            case 'process_temp':
              return machineData?.processTemperature;
            case 'rotational_speed':
              return machineData?.rotationalSpeed;
            case 'torque':
              return machineData?.torque;
            case 'tool_wear':
              return machineData?.toolWear;
            default:
              return undefined;
          }
        })();

        return (
          <Col xs={24} sm={12} md={8} key={config.id}>
            <MetricCard
              icon={config.icon}
              label={config.name}
              value={metricValue}
              unit={config.unit}
              description={`Normal range: ${config.range}`}
              isLoading={isLoading}
            />
          </Col>
        );
      })}
    </Row>
  );
}
