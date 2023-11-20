import mysql from 'mysql2/promise';
import { Redis } from 'ioredis';

import prop from './cfg/prop.json';
import { Prop } from './cfg/prop';
import logger from './libs/logger';
import { DBM } from './dbm/dbm';
import { ZoneRepo } from './zone/zoneRepo';

export class Service {
    private static instance: Service;

    // 생성자를 private으로 선언하여 외부에서의 인스턴스화 방지
    private constructor() {
        // 초기화 코드
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
        return prop;
    }

    private pool!: mysql.Pool;
    private redis!: Redis;
    private subs!: Redis;
    private dbm!: DBM;

    private zoneRepo!: ZoneRepo;
    private zone! : unknown;

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

        // DBM 객체 생성
        this.dbm = new DBM(this.subs);

        // ZoneRepo 객체 생성
        this.zoneRepo = new ZoneRepo();
        this.zone = await this.zoneRepo.getZoneRepo();
    }

    public get IsRun() : boolean {
        return true;
    }

    // MySQL 연결 풀 반환
    public get MySQL(): mysql.Pool {
        return this.pool;
    }

    // DBM 객체 반환
    public get DBM(): DBM {
        return this.dbm;
    }

    public get Redis(): Redis {
        return this.redis;
    }
}
