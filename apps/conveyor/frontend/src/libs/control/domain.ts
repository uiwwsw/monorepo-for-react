import { TcmInfo, ModuleState } from '!/socket/domain';
export enum CONTROL_STATUS {
  OFF,
  ON,
}
export const SERVERS = ['DCM', 'HIM'] as const;
export type SERVER_TYPE = (typeof SERVERS)[number];
export interface ProcessList {
  procList: { procId: number; procName: string }[];
}
export interface TcmList extends TcmInfo {
  status: keyof typeof CONTROL_STATUS;
}
export interface ServerList extends ModuleState {
  status: keyof typeof CONTROL_STATUS;
  stateType: SERVER_TYPE;
}
// export const convertToControlStatus = (value: number) => {
//   switch (value) {
//     case CONTROL_STATUS.ON:
//       return 'on';
//     default:
//       return 'off';
//   }
// };
// const d: CONTROL_STATUS = CONTROL_STATUS.OFF;
// console.log(d === 0);
