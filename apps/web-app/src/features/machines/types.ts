export interface MachineData {
  id: number;
  timestamp: string;
  airTemperature: string;
  processTemperature: string;
  rotationalSpeed: number;
  torque: string;
  toolWear: number;
  machineStatus: number;
  predictionStatus: number;
  productId: string;
  type: number;
  twf: number;
  hdf: number;
  pwf: number;
  osf: number;
  rnf: number;
}
