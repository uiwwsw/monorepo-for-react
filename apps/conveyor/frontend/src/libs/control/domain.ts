export const mockDataServer: ServerInfo[] = [
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

export const mockDataTCM: TCMInfo[] = [
  {
    tid: 101,
    status: 'ONLINE',
    version: '1.2.1',
    AdjTCMConnection: '29/30',
    Process: '1131, 1181',
  },
  {
    tid: 102,
    status: 'ONLINE',
    version: '1.2.1',
    AdjTCMConnection: '29/29',
    Process: '1131, 1181',
  },
  {
    tid: 103,
    status: 'ONLINE',
    version: '1.2.1',
    AdjTCMConnection: '21/30',
    Process: '1131, 1181',
  },
  {
    tid: 104,
    status: 'OFFLINE',
    version: '1.2.1',
    AdjTCMConnection: '10/10',
    Process: '1131, 1181',
  },
  {
    tid: 105,
    status: 'ONLINE',
    version: '1.2.1',
    AdjTCMConnection: '9/10',
    Process: '1131, 1181',
  },
  {
    tid: 106,
    status: 'ONLINE',
    version: '1.2.1',
    AdjTCMConnection: '29/30',
    Process: '1131, 1181',
  },
  {
    tid: 107,
    status: 'OFFLINE',
    version: '1.2.1',
    AdjTCMConnection: '29/30',
    Process: '1131, 1181',
  },
  {
    tid: 108,
    status: 'ONLINE',
    version: '1.2.1',
    AdjTCMConnection: '28/30',
    Process: '1131, 1181',
  },
  {
    tid: 109,
    status: 'ONLINE',
    version: '1.2.1',
    AdjTCMConnection: '19/20',
    Process: '1131, 1181',
  },
  {
    tid: 110,
    status: 'ONLINE',
    version: '1.2.1',
    AdjTCMConnection: '19/20',
    Process: '1131, 1181',
  },
  {
    tid: 111,
    status: 'OFFLINE',
    version: '1.2.1',
    AdjTCMConnection: '18/20',
    Process: '1131, 1181',
  },
];

export enum UpdateStatus {
  Idle = 'idle',
  Updating = 'updating',
  Completed = 'completed',
  Error = 'error',
}

export const mockDataUpdate: firmwareStatus = {
  status: UpdateStatus.Completed,
};

export interface ServerInfo {
  sid: number;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
  version: string;
  StartedTime: string;
}

export interface TCMInfo {
  tid: number;
  status: 'ONLINE' | 'OFFLINE';
  version: string;
  AdjTCMConnection: string;
  Process: string;
}

export interface UploadFile {
  name: string;
  size: number;
  type: string;
}

export interface firmwareStatus {
  status: UpdateStatus;
}
