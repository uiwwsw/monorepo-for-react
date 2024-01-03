import { IGetSystemEquipValueResp } from '@package-backend/types';

export class TcmClient {
  state: { tcmId: number; alive: number }[];
  writeLog: number;
  constructor({ state, write_log }: any) {
    this.state = state;
    this.writeLog = write_log;
  }
}

export class EquipmentValue {
  model: string;
  name: string;
  defaultModel: string;
  transferTimeout: number;
  constructor({ model, name, default_model, transfer_timeout }: IGetSystemEquipValueResp) {
    this.model = model;
    this.name = name;
    this.defaultModel = default_model;
    this.transferTimeout = transfer_timeout;
  }
}
export enum EquipmentName {
  'model' = 'EquipmentModel',
  'name' = 'EquipmentName',
  'defaultModel' = 'DefaultEquipmentModel',
  'transferTimeout' = 'TransferTimeout',
}
