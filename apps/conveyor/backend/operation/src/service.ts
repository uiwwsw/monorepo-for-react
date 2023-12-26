import mysql from 'mysql2/promise';
import { Redis } from 'ioredis';

import logger from './libs/logger';
import { Prop } from './cfg/prop';
import { Zone } from './packages/backend/types/src/zone/zone';
import { ZoneRepo } from './zone/zoneRepo';
import { Clients } from './websocket/clients'

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
        //import prop from './cfg/prop.json';
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
                    Host : process.env.REDIS_HOST || '192.168.0.220',
                    Port : Number(process.env.REDIS_PORT) || 30010
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
    private clients! : Clients;

    private zoneRepo!: ZoneRepo;
    private zones! : Map<number, Zone>;

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

        // ZoneRepo 객체 생성
        this.zoneRepo = new ZoneRepo();
        this.zones = await this.zoneRepo.getZoneRepo();

        // Zone 데이터 저장
        const jobs = [];
        for (const [key, value] of this.zones) {
            const job = this.MySQL.query('insert into zoneInfo set ? on duplicate key update ?', [{
                ZoneID: key,
                DisplayName: value.DisplayName,
                PhysicalType : value.PhysicalType
            },
            {
                DisplayName: value.DisplayName,
                PhysicalType : value.PhysicalType
            }]);
            jobs.push(job);
        }
        await Promise.all(jobs);

        this.clients = new Clients(this.subs);
    }

    public get IsRun() : boolean {
        return true;
    }

    // MySQL 연결 풀 반환
    public get MySQL(): mysql.Pool {
        return this.pool;
    }

    public get Redis(): Redis {
        return this.redis;
    }

    public get Zones(): Map<number, Zone> {
        return this.zones;
    }

    public get ZoneRepo(): ZoneRepo {
        return this.zoneRepo;
    }

    public get Clients(): Clients {
        return this.clients;
    }
}
