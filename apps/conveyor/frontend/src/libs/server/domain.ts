export const mockData: ServerInfo[] = [
  {
    sid: 1,
    name: 'dcm',
    status: 'ONLINE',
    version: '1.0.1',
    StartedTime: '22/17/2021',
  },
  {
    sid: 2,
    name: 'him',
    status: 'ONLINE',
    version: '2.2.1',
    StartedTime: '12/07/2023',
  },
];

export interface ServerInfo {
  sid: number;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
  version: string;
  StartedTime: string;
}
