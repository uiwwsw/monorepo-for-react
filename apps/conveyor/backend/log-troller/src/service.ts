import mysql from 'mysql2/promise';
import { Redis } from 'ioredis';

import logger from './libs/logger';
import { Prop } from './libs/prop';
import { DBM } from './dbm/dbm';
import { IRowCount } from './types/DataType';

import * as utils from './libs/utils';

export class Service {
    private static instance: Service;

    // 생성자를 private으로 선언하여 외부에서의 인스턴스화 방지
    private constructor() {
    }

    // 인스턴스를 가져오는 정적 메서드
    public static get Inst(): Service {
        // 인스턴스가 존재하지 않을 때만 새로 생성
        if (!Service.instance) {
            Service.instance = new Service();
        }
        return Service.instance;
    }

    // 환경 설정 파일 정보 조회
    public get Prop(): Prop {
        if (this.prop === undefined) {
            this.prop = {
                PortNum : process.env.PORT_NUM || 7080,
                MySQL : {
                    Host : process.env.MYSQL_HOST || '192.168.101.14',
                    Port : Number(process.env.MYSQL_PORT) || 3306,
                    User : process.env.MYSQL_USER || 'root',
                    Password : process.env.MYSQL_PASSWORD || 'paSSw0rd',
                    Database : process.env.MYSQL_DATABASE || 'R301'
                },
                Redis : {
                    Host : process.env.REDIS_HOST || '192.168.101.14',
                    Port : Number(process.env.REDIS_PORT) || 6380
                },
                JWT : {
                    Secret : process.env.JWT_KEY || 'EAF606C87569B2F97E230E792049833E',
                    ExpiresIn : process.env.JWT_EXPIRE || '1d'
                }
            } as Prop;
        }
        return this.prop;
    }

    private prop!: Prop;
    private pool!: mysql.Pool;
    private redis!: Redis;
    private subs!: Redis;
    private dbm!: DBM;
    private tables!: Map<string, number>;

    // 서비스 초기화 작업
    public async ready() {
        logger.info('Service ready...');

        const prop = this.Prop;

        // mysql2 모듈을 사용하여 MySQL 연결 풀 생성
        this.pool = mysql.createPool({
            host: prop.MySQL.Host,
            port: prop.MySQL.Port,
            user: prop.MySQL.User,
            password: prop.MySQL.Password,
            database: prop.MySQL.Database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // ioredis 모듈을 사용하여 Redis 연결
        this.redis = new Redis(prop.Redis.Port, prop.Redis.Host);
        this.subs = new Redis(prop.Redis.Port, prop.Redis.Host);

        // mysql partioning table check
        this.tables = new Map<string, number>();
        this.tables.set('E84JobStates', 60);
        this.tables.set('logs', 60);
        this.tables.set('zonedynamicattributes', 60);
        this.tables.set('zoneoccupiedattributes', 60);

        await this.checkPartition();
        setInterval(async () => {
            await this.checkPartition();
        }, 1000 * 60 * 60 * 24);

        // DBM 객체 생성
        this.dbm = new DBM(this.subs);
    }

    public get IsRun() : boolean {
        return true;
    }

    // MySQL 연결 풀 반환
    public get LocalDB(): mysql.Pool {
        return this.pool;
    }

    // DBM 객체 반환
    public get DBM(): DBM {
        return this.dbm;
    }

    public get Redis(): Redis {
        return this.redis;
    }

    // mysql partioning table check
    private async checkPartition() {
        for (const [name, expired] of this.tables) {
            try {
                const prev = new Date();
                prev.setDate(prev.getDate() - expired);
                await this.dropPartition(name, prev);

                for(let i=0; i<=7; i++) {
                    const next = new Date();
                    next.setDate(next.getDate() + i);
                    await this.addPartition(name, next);
                }
            } catch (ex) {
                logger.error(`checkPartition. table:${name}\n${ex}`);
            }
        }
    }

    private async addPartition(name:string, date:Date) {
        try {
            const pNext = new Date(date);
            pNext.setDate(pNext.getDate() + 1);

            const pName =`p${utils.toDateFmt(date, 'YYMMDD')}`;
            const qry = [
                {
                    sql : 'SELECT count(1) as cnt FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = ? AND PARTITION_NAME is not null AND TABLE_SCHEMA = ? AND PARTITION_METHOD = "RANGE"',
                    data : [name, this.prop.MySQL.Database]
                },
                {
                    sql : 'SELECT count(1) as cnt FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = ? AND PARTITION_NAME = ? AND TABLE_SCHEMA = ? AND PARTITION_METHOD = "RANGE"',
                    data : [name, pName, this.prop.MySQL.Database]
                },
                {
                    sql: `alter table ${name} add partition (PARTITION ${pName} VALUES LESS THAN (TO_DAYS("${utils.toDateFmt(pNext, 'YYYY-MM-DD')}")))`,
                    data : []
                }
            ];
            const [rows] = await this.LocalDB.query<IRowCount[]>(qry[0].sql, qry[0].data);
            if (rows.length > 0 && rows[0].cnt < 1) {
                return;
            }
            const [rows2] = await this.LocalDB.query<IRowCount[]>(qry[1].sql, qry[1].data);
            if (rows2.length > 0 && rows2[0].cnt > 0) {
                return;
            }
            await this.LocalDB.query(qry[2].sql, qry[2].data);
            logger.info(`addPartition. name:${name}, date:${pName}`);
        } catch (ex) {
            logger.error(`addPartition. table:${name}, date:${date}\n${ex}`);
        }
    }

    private async dropPartition(name:string, date:Date) {
        try {
            const pName = `p${utils.toDateFmt(date, 'YYMMDD')}`;
            const [rows] = await this.LocalDB.query<IRowCount[]>('SELECT count(1) as cnt FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = ? AND PARTITION_NAME = ? AND TABLE_SCHEMA = ? AND PARTITION_METHOD = "RANGE"', [name, pName, this.prop.MySQL.Database]);
            if (rows.length > 0 && rows[0].cnt < 1) {
                return;
            }

            await this.LocalDB.query(`alter table ${name} drop partition ${pName}`);
            logger.info(`dropPartition. table:${name}, date:${pName}`);
        } catch (ex) {
            logger.error(`dropPartition. table:${name}, date:${date}\n${ex}`);
        }
    }
}
