export class TcmClient {
  state: { tcmId: number; alive: number }[];
  writeLog: number;
  constructor({ state, write_log }: any) {
    this.state = state;
    this.writeLog = write_log;
  }
}
