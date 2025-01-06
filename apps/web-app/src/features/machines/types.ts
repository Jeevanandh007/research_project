export interface MachineData {
  id: number;
  timestamp: string;
  airTemperature: string;
  processTemperature: string;
  rotationalSpeed: number;
  torque: string;
  toolWear: number;
  machineStatus: boolean;
  predictionStatus: string;
  createdAt: string;
}
