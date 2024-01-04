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
  equipmentModel: string;
  equipmentName: string;
  // defaultModel: string;
  equipmentTransferTimeout: number;
  constructor({ model, name, transfer_timeout }: IGetSystemEquipValueResp) {
    this.equipmentModel = model;
    this.equipmentName = name;
    // this.defaultModel = default_model;
    this.equipmentTransferTimeout = transfer_timeout;
  }
}
export enum EquipmentName {
  'equipmentModel' = 'EquipmentModel',
  'equipmentName' = 'EquipmentName',
  'equipmentTransferTimeout' = 'TransferTimeout',
}
