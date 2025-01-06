import { useQuery } from '@tanstack/react-query';
import { httpClient } from '../../../lib/http-client';
import { MachineData } from '../types';

const POLL_INTERVAL = 1000; // 1 second

async function fetchMachineMetrics(): Promise<MachineData[]> {
  const response = await httpClient.get<MachineData[]>('/machine-data/latest');
  return response.data;
}

export function useMachineMetrics() {
  return useQuery({
    queryKey: ['machine-metrics'],
    queryFn: fetchMachineMetrics,
    refetchInterval: POLL_INTERVAL,
  });
}
