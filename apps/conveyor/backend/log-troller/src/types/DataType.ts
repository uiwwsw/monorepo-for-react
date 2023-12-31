import { RowDataPacket } from 'mysql2';

export interface IRowCount extends RowDataPacket {
    cnt : number;
}
