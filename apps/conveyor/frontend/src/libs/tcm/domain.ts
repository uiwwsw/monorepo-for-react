export const mockData: TCMInfo[] = [
  {
    tid: 101,
    status: 'ONLINE',
    version: '1.2.1',
    StartedTime: '22/07/2021',
    AdjTCMConnection: '102-ON, 103-OFF',
  },
  {
    tid: 102,
    status: 'ONLINE',
    version: '1.2.1',
    StartedTime: '19/07/2021',
    AdjTCMConnection: '102-ON, 103-OFF, 104-ON',
  },
  {
    tid: 103,
    status: 'ONLINE',
    version: '1.2.1',
    StartedTime: '17/07/2021',
    AdjTCMConnection: '105-ON',
  },
  {
    tid: 104,
    status: 'OFFLINE',
    version: '1.2.1',
    StartedTime: '04/07/2021',
    AdjTCMConnection: '102-ON, 103-OFF',
  },
  {
    tid: 105,
    status: 'ONLINE',
    version: '1.2.1',
    StartedTime: '04/07/2021',
    AdjTCMConnection: '107-ON',
  },
  {
    tid: 106,
    status: 'ONLINE',
    version: '1.2.1',
    StartedTime: '04/07/2021',
    AdjTCMConnection: '102-ON, 103-OFF',
  },
  {
    tid: 107,
    status: 'OFFLINE',
    version: '1.2.1',
    StartedTime: '01/07/2021',
    AdjTCMConnection: '106-ON, 108-ON, 109-ON',
  },
  {
    tid: 108,
    status: 'ONLINE',
    version: '1.2.1',
    StartedTime: '22/06/2021',
    AdjTCMConnection: '102-ON, 103-OFF',
  },
  {
    tid: 109,
    status: 'ONLINE',
    version: '1.2.1',
    StartedTime: '21/06/2021',
    AdjTCMConnection: '109-ON',
  },
  {
    tid: 110,
    status: 'ONLINE',
    version: '1.2.1',
    StartedTime: '17/06/2021',
    AdjTCMConnection: '102-ON, 103-OFF',
  },
  {
    tid: 111,
    status: 'OFFLINE',
    version: '1.2.1',
    StartedTime: '17/06/2021',
    AdjTCMConnection: '102-ON, 103-OFF',
  },
];

export interface TCMInfo {
  tid: number;
  status: 'ONLINE' | 'OFFLINE';
  version: string;
  StartedTime: string;
  AdjTCMConnection: string;
}
