import { Service } from '../service';
import { ZoneType } from '../zone/zoneType';
import { Zone, cctv, baseObject } from '../packages/backend/types/src/zone/zone';
import logger from '../libs/logger';
import * as utils from '../libs/utils';

export class ZoneRepo {
    public useRealPostion: boolean = false;
    public Data: Map<number, Zone> = new Map<number, Zone>();

    async getZoneRepo() : Promise<Map<number, Zone>> {
        this.Data.clear();

        const useRealPostion = await Service.Inst.Redis.hget('System:Configuration:GUI', 'UseRealPostion');
        this.useRealPostion = useRealPostion === '1';

        const zones = await this.getZoneRepository();
        const idler = await this.getIdlerRepositorys();
        const cctv = await this.getCCTVRepositorys();
        this.setData(zones);
        this.setData(idler);
        this.setData(cctv);

        return zones;
    }

    async setData(value: Map<number, Zone>) {
        value.forEach((value: Zone) => {
            this.Data.set(value.ZoneID, value);
        });
    }

    makeMappedRepository(keys:string[]) : Map<number, Zone> {
        const repo = new Map();
        keys.forEach(key => {
            const id = key.split(':')[1];
            if (+id > 99999) {
                repo.set(+id, new baseObject(+id));
            } else {
                repo.set(+id, new Zone(+id));
            }
        });
        return repo;
    }

    async getZoneRepository() : Promise<Map<number, Zone>> {
        const zoneKeys = await utils.scanRedisKeys(Service.Inst.Redis, 'Zone:*[0-9]');
        const zones = this.makeMappedRepository(zoneKeys);
        await this.setZoneRepositoryAttributes(zones);
        return zones;
    }

    async setZoneRepositoryAttributes(zoneRepository: Map<number, Zone>) {
        if (zoneRepository.size == 0) {
            return;
        }

        const redis = Service.Inst.Redis;
        const total = zoneRepository.size;
        let idx = 0;

        const jobs = [];
        for(const [id, value] of zoneRepository) {
            const job = async() => {
                const begin = Date.now();
                try {
                    value.PhysicalType = +(await redis.hget(`Zone:${value.ZoneID}`, 'PhysicalType') || 0);
                    value.Level = +(await redis.hget(`Zone:${value.ZoneID}`, 'Level') || 0);
    
                    value.posX = +(await redis.hget(`Zone:${value.ZoneID}`, 'posX') || 0);
                    value.posY = +(await redis.hget(`Zone:${value.ZoneID}`, 'posY') || 0);
    
                    value.NextZone = +(await redis.hget(`Zone:${value.ZoneID}`, 'NextZone') || 0);
                    value.PrevZone = +(await redis.hget(`Zone:${value.ZoneID}`, 'ZonePrev') || 0);

                    value.RefDirection = +(await redis.hget(`Zone:${value.ZoneID}`, 'RefDirection') || 0);
                    value.EtherCATID = +(await redis.hget(`Zone:${value.ZoneID}`, 'EtherCATID') || 0);
                    value.EtherCATName = await redis.hget(`Zone:${value.ZoneID}`, 'EtherCATName') || '';
                    value.DisplayName = await redis.hget(`Zone:${value.ZoneID}`, 'DisplayName') || '';
                    value.Level = +(await redis.hget(`Zone:${value.ZoneID}`, 'Level') || 0);
    
                    value.ZoneDrawCount = +(await redis.hget(`Zone:${value.ZoneID}`, 'ZoneDrawCount') || 1);
                    value.SensorReverseZone = +(await redis.hget(`Zone:${value.ZoneID}`, 'SensorReverseZone') || 0);
                    value.MotorReverse = +(await redis.hget(`Zone:${value.ZoneID}`, 'MotorReverse') || 0);
                    value.GearRatio = +(await redis.hget(`Zone:${value.ZoneID}`, 'MotorRevGearRatioerse') || 0);
                    value.LogicalType = +(await redis.hget(`Zone:${value.ZoneID}`, 'LogicalType') || 0);
                    value.PLCSlaveID = +(await redis.hget(`Zone:${value.ZoneID}`, 'PLCSlaveID') || 0);
                    value.HasAirShower = +(await redis.hget(`Zone:${value.ZoneID}`, 'HasAirShower') || 0);
    
                    // AttributeLD
                    if ((await redis.hkeys(`Zone:${value.ZoneID}:AttributeLD`) || []).length > 0) {
                        value.AttributeLD || (value.AttributeLD = {});
                        const E84PortNumber = await redis.hget(`Zone:${value.ZoneID}:AttributeLD`, 'E84PortNumber');
                        const RFIDPortNumber = await redis.hget(`Zone:${value.ZoneID}:AttributeLD`, 'RFIDPortNumber');
                        const SGTPortNumber = await redis.hget(`Zone:${value.ZoneID}:AttributeLD`, 'SGTPortNumber');
                        const IOModuleInstalled = await redis.hget(`Zone:${value.ZoneID}:AttributeLD`, 'IOModuleInstalled');
                        const IOEtherCATID = await redis.hget(`Zone:${value.ZoneID}:AttributeLD`, 'IOEtherCATID');
                        const AutoIOPort = await redis.hget(`Zone:${value.ZoneID}:AttributeLD`, 'AutoIOPort');
                        const DefaultOutputZoneID = await redis.hget(`Zone:${value.ZoneID}:AttributeLD`,'DefaultOutputZoneID');
                        const IncludedLD = await redis.hget(`Zone:${value.ZoneID}:AttributeLD`, 'Included');
                        const GroupNumber = await redis.hget(`Zone:${value.ZoneID}:AttributeLD`, 'GroupNumber');
                        const SensorReverseZone = [];
                        SensorReverseZone.push(+(await redis.hget(`Zone:${value.ZoneID}:AttributeLD`, 'SensorReverseZone1') || 0));
                        SensorReverseZone.push(+(await redis.hget(`Zone:${value.ZoneID}:AttributeLD`, 'SensorReverseZone2') || 0));
                        SensorReverseZone.push(+(await redis.hget(`Zone:${value.ZoneID}:AttributeLD`, 'SensorReverseZone3') || 0));
    
                        if (IncludedLD) { value.AttributeLD.Included = +IncludedLD; }
                        if (E84PortNumber) { value.AttributeLD.E84PortNumber = +E84PortNumber; }
                        if (RFIDPortNumber) { value.AttributeLD.RFIDPortNumber = +RFIDPortNumber; }
                        if (SGTPortNumber) { value.AttributeLD.SGTPortNumber = +SGTPortNumber; }
                        if (IOModuleInstalled) { value.AttributeLD.IOModuleInstalled = +IOModuleInstalled; }
                        if (IOEtherCATID) { value.AttributeLD.IOEtherCATID = IOEtherCATID; }
                        if (AutoIOPort) { value.AttributeLD.AutoIOPort = +AutoIOPort; }
                        if (DefaultOutputZoneID) { value.AttributeLD.DefaultOutputZoneID = +DefaultOutputZoneID; }
                        if (GroupNumber) { value.AttributeLD.GroupNumber = +GroupNumber; }
                        if (SensorReverseZone.reduce((a, b) => a + b) > 0) {
                            value.AttributeLD.SensorReversZones = SensorReverseZone;
                        }
                    }
    
                    // AttributeQS
                    if ((await redis.hkeys(`Zone:${value.ZoneID}:AttributeQS`) || []).length > 0) {
                        value.AttributeQS || (value.AttributeQS = {});
                        const IncludedQS = await redis.hget(`Zone:${value.ZoneID}:AttributeQS`, 'Included');
                        const HomeOffset = await redis.hget(`Zone:${value.ZoneID}:AttributeQS`, 'HomeOffset');
                        const North = await redis.hget(`Zone:${value.ZoneID}:AttributeQS`, 'North');
                        const NorthOut = await redis.hget(`Zone:${value.ZoneID}:AttributeQS`, 'NorthOut');
                        const South = await redis.hget(`Zone:${value.ZoneID}:AttributeQS`, 'South');
                        const SouthOut = await redis.hget(`Zone:${value.ZoneID}:AttributeQS`, 'SouthOut');
                        const West = await redis.hget(`Zone:${value.ZoneID}:AttributeQS`, 'West');
                        const WestOut = await redis.hget(`Zone:${value.ZoneID}:AttributeQS`, 'WestOut');
                        const East = await redis.hget(`Zone:${value.ZoneID}:AttributeQS`, 'East');
                        const EastOut = await redis.hget(`Zone:${value.ZoneID}:AttributeQS`, 'EastOut');
                        if (IncludedQS) { value.AttributeQS.Included = +IncludedQS; }
                        if (HomeOffset) { value.AttributeQS.HomeOffset = +HomeOffset; }
                        if (North) { value.AttributeQS.North = [North, NorthOut]; }
                        if (South) { value.AttributeQS.South = [South, SouthOut]; }
                        if (West) { value.AttributeQS.West = [West, WestOut]; }
                        if (East) { value.AttributeQS.East = [East, EastOut]; }
                    }
    
                    // Lifter
                    if (+value.PhysicalType === ZoneType.TYPE_LIFTER) {
                        value.AttributeLifter = {
                            InIncludeZoneID: -1,
                            OutIncludeZoneID: -1,
                            HomeLevel: 0, // 0 = Down, 1 = Up
                            HomingDirection: 0, // 0 = Down, 1 = Up
                            HomingClearLimit: 0, // 0 = Down, 1 = Up
                            HomeOffset: 0,
                            // LevelPosition: [0, 0, 0],
                        };
                        value.AttributeLifter.InIncludeZoneID = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, 'InIncludeZoneID') || 0);
                        value.AttributeLifter.OutIncludeZoneID = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, 'OutIncludeZoneID') || 0);
                        value.AttributeLifter.HomeLevel = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, 'HomeLevel') || 0);
                        value.AttributeLifter.HomingDirection = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, 'HomingDirection') || 0);
                        value.AttributeLifter.HomingClearLimit = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, 'HomingClearLimit') || 0);
                        value.AttributeLifter.HomingClearLimit = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, 'HomingClearLimit') || 0);
                        value.AttributeLifter.HomeOffset = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, 'HomeOffset') || 0);
                        value.AttributeLifter.IOEtherCATID = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, 'IOEtherCATID') || 0);
                        value.AttributeLifter.IOModuleInstalled = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, 'IOModuleInstalled') || 0);
    
                        value.AttributeLifter.LevelZone = [];
                        for (let i = 0; i < 2; i += 1) {
                            value.AttributeLifter.LevelZone.push({
                                In: -1,
                                Out: -1,
                                Position: -1,
                            });
                        }
                        for (const level of [0, 1, 2]) {
                            value.AttributeLifter.LevelZone[level].In = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, `LevelZoneIn_${level}`) || -1);
                            value.AttributeLifter.LevelZone[level].Out = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, `LevelZoneOut_${level}`) || -1);
                            value.AttributeLifter.LevelZone[level].Position = +(await redis.hget(`Zone:${value.ZoneID}:AttributeLifter`, `LevelZonePosition_${level}`) || -1);
                        }
                    }
    
                    // SingleLifter
                    if (+value.PhysicalType === ZoneType.TYPE_LIFTER_SINGLE) {
                        value.AttributeSingleLifter = {
                            Included: -1,
                            HomeLevel: 0, // 0 = Down, 1 = Up
                            HomingDirection: 0, // 0 = Down, 1 = Up
                            HomingClearLimit: 0, // 0 = Down, 1 = Up
                            HomeOffset: 0,
                        };
                        value.AttributeSingleLifter.Included = +(await redis.hget(`Zone:${value.ZoneID}:AttributeSingleLifter`, 'Included') || -1);
                        value.AttributeSingleLifter.HomeLevel = +(await redis.hget(`Zone:${value.ZoneID}:AttributeSingleLifter`, 'HomeLevel') || 0);
                        value.AttributeSingleLifter.HomingDirection = +(await redis.hget(`Zone:${value.ZoneID}:AttributeSingleLifter`, 'HomingDirection') || 0);
                        value.AttributeSingleLifter.HomingClearLimit = +(await redis.hget(`Zone:${value.ZoneID}:AttributeSingleLifter`, 'HomingClearLimit') || 0);
                        value.AttributeSingleLifter.HomeOffset = +(await redis.hget(`Zone:${value.ZoneID}:AttributeSingleLifter`, 'HomeOffset') || 0);
                        value.AttributeSingleLifter.IOEtherCATID = +(await redis.hget(`Zone:${value.ZoneID}:AttributeSingleLifter`, 'IOEtherCATID') || 0);
                        value.AttributeSingleLifter.IOModuleInstalled = +(await redis.hget(`Zone:${value.ZoneID}:AttributeSingleLifter`, 'IOModuleInstalled') || 0);
                        value.AttributeSingleLifter.LevelZone = [];
                        for (let i = 0; i < 3; i += 1) {
                            value.AttributeSingleLifter.LevelZone.push({
                                In: -1,
                                Out: -1,
                                Position: -1,
                            });
                        }
                        for (const level of [0, 1, 2]) {
                            value.AttributeSingleLifter.LevelZone[level].In = +(await redis.hget(`Zone:${value.ZoneID}:AttributeSingleLifter`, `LevelZoneIn_${level}`) || -1);
                            value.AttributeSingleLifter.LevelZone[level].Out = +(await redis.hget(`Zone:${value.ZoneID}:AttributeSingleLifter`, `LevelZoneOut_${level}`) || -1);
                            value.AttributeSingleLifter.LevelZone[level].Position = +(await redis.hget(`Zone:${value.ZoneID}:AttributeSingleLifter`, `LevelZonePosition_${level}`) || -1);
                        }
                    }
                    logger.info(`ZoneRepo.setZoneRepositoryAttributes(${idx}/${total}) id:${id}, elasped:${Date.now() - begin}ms`);
                } catch (err) {
                    logger.error(`ZoneRepo.setZoneRepositoryAttributes: id:${id}, ${err}`);
                }
                idx++;
            }
            jobs.push(job);
        }
        await Promise.all(jobs.map(job => job()));
    }

    async getIdlerRepositorys() : Promise<Map<number, Zone>> {
        const otherKeys = await utils.scanRedisKeys(Service.Inst.Redis, 'Idler:*[0-9]');
        const IdlerRepository = this.makeMappedRepository(otherKeys);
        await this.setIdlerRepositoryAttributes(IdlerRepository);
        return IdlerRepository;
    }

    async setIdlerRepositoryAttributes(idlerRepository: Map<number, Zone>) {
        if (idlerRepository.size == 0) {
            return;
        }
        const redis = Service.Inst.Redis;
        const total = idlerRepository.size;
        let idx = 0;

        const jobs = [];
        for(const [id, value] of idlerRepository) {
            const begin = Date.now();
            const job = async() => {
                try {
                    value.PhysicalType = +(await redis.hget(`Idler:${value.ZoneID}`, 'PhysicalType') || 0);

                    value.posX = +(await redis.hget(`Idler:${value.ZoneID}`, 'posX') || 0);
                    value.posY = +(await redis.hget(`Idler:${value.ZoneID}`, 'posY') || 0);
                    value.NextZone = +(await redis.hget(`Idler:${value.ZoneID}`, 'NextZone') || 0);
                    value.PrevZone = +(await redis.hget(`Idler:${value.ZoneID}`, 'ZonePrev') || 0);
                    value.RefDirection = +(await redis.hget(`Idler:${value.ZoneID}`, 'RefDirection') || 0);
                    value.DisplayName = (await redis.hget(`Idler:${value.ZoneID}`, 'DisplayName') || '');
                    value.Level = +(await redis.hget(`Idler:${value.ZoneID}`, 'Level') || 0);
                    value.ZoneDrawCount = +(await redis.hget(`Idler:${value.ZoneID}`, 'ZoneDrawCount') || 1);

                    logger.info(`ZoneRepo.setIdlerRepositoryAttributes(${idx}/${total}) id:${id}, elasped:${Date.now() - begin}ms`);
                } catch (ex) {
                    logger.error(`ZoneRepo.setIdlerRepositoryAttributes: id:${id}, ${ex}`);
                }                
                idx++;
            };
            jobs.push(job);
        }
        await Promise.all(jobs.map(job => job()));
    }

    async getCCTVRepositorys() : Promise<Map<number, Zone>> {
        const otherKeys = await utils.scanRedisKeys(Service.Inst.Redis, 'CCTV:*[0-9]');
        const IdlerRepository = this.makeMappedRepository(otherKeys);
        await this.setIdlerRepositoryAttributes(IdlerRepository);
        return IdlerRepository;
    }

    async setCCTVRepositoryAttributes(cctvRepository: Map<number, cctv>) {
        if (cctvRepository.size == 0) {
            return;
        }

        const redis = Service.Inst.Redis;
        const total = cctvRepository.size;
        let idx = 0;

        const jobs = [];
        for(const [id, value] of cctvRepository) {
            const begin = Date.now();
            const job = async() => {
                try {
                    value.PhysicalType = +(await redis.hget(`CCTV:${value.ZoneID}`, 'PhysicalType') || 0);
                    value.posX = +(await redis.hget(`CCTV:${value.ZoneID}`, 'posX') || 0);
                    value.posY = +(await redis.hget(`CCTV:${value.ZoneID}`, 'posY') || 0);
                    value.DisplayName = (await redis.hget(`CCTV:${value.ZoneID}`, 'DisplayName') || '');
                    value.Level = +(await redis.hget(`CCTV:${value.ZoneID}`, 'Level') || 0);

                    value.TCMID = +(await redis.hget(`CCTV:${value.ZoneID}`, 'TCMID') || 0);
                    value.IPAddress = (await redis.hget(`CCTV:${value.ZoneID}`, 'IPAddress') || '');
                    value.rotationDeg = +(await redis.hget(`CCTV:${value.ZoneID}`, 'rotationDeg') || 0);

                    logger.info(`ZoneRepo.setCCTVRepositoryAttributes(${idx}/${total}) id:${id}, elasped:${Date.now() - begin}ms`);
                } catch (ex) {
                    logger.error(`ZoneRepo.setCCTVRepositoryAttributes: id:${id}, ${ex}`);
                }                
                idx++;
            };
            jobs.push(job);
        }
        await Promise.all(jobs.map(job => job()));
    }
}
