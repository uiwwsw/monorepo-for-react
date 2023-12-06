import { TcmInfo, ModuleState } from '!/socket/domain';
export const enum STATUS {
  OFF,
  ON,
}
export interface TcmList extends TcmInfo {
  status: STATUS;
}
export interface ServerList extends ModuleState {}
