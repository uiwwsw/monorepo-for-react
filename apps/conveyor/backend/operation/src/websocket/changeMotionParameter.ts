import { Zone, ChangeParamReq } from '@package-backend/types';
import { Service } from '../service'
import { Client } from './client'
import * as MsgUtils from './message';
import logger from '../libs/logger';

export function onChangeEachParameter(msg: ChangeParamReq, client:Client) {
    const redisClient = Service.Inst.Redis;
    const channel = `TCMCmdCh:${Math.floor(+msg.payload.zoneID / 100)}`;
    let message = '';
    switch (msg.payload.profileType) {
        case 0:
            message = MsgUtils.makeTcmChangeProfile(
                msg.payload.zoneID,
                msg.payload.speedType,
                msg.payload.profileType,
                msg.payload.velocity,
            );
            break;
        case 1:
            message = MsgUtils.makeTcmChangeProfile(
                msg.payload.zoneID,
                msg.payload.speedType,
                msg.payload.profileType,
                msg.payload.acceleration,
            );
            break;
        case 2:
            message = MsgUtils.makeTcmChangeProfile(
                msg.payload.zoneID,
                msg.payload.speedType,
                msg.payload.profileType,
                msg.payload.deceleration,
            );
            break;
        case 3:
            message = MsgUtils.makeTcmChangeProfile(
                msg.payload.zoneID,
                msg.payload.speedType,
                msg.payload.profileType,
                msg.payload.jerk,
            );
            break;
        case 4:
            message = MsgUtils.makeTcmChangeProfile(
                msg.payload.zoneID,
                msg.payload.speedType,
                msg.payload.profileType,
                msg.payload.overrideDelay,
            );
            break;
        case 5:
            message = MsgUtils.makeTcmChangeProfile(
                msg.payload.zoneID,
                msg.payload.speedType,
                msg.payload.profileType,
                msg.payload.dccRatio,
            );
            break;
        default:
            break;
    }

    redisClient.publish(channel, message);
    const key = `Zone:${msg.payload.zoneID}:Profile`;

    let field = '';
    let value;

    switch (+msg.payload.speedType) {
        case 0:
            field += 'RunFast';
            break;
        case 1:
            field += 'Maint';
            break;
        case 2:
            field += 'RunSlow';
            break;
        case 3:
            field += 'Override';
            break;
        default:
            break;
    }
    switch (+msg.payload.profileType) {
        case 0:
            value = msg.payload.velocity;
            redisClient.hmset(key, `${field  }Vel`, value);
            break;
        case 1:
            value = msg.payload.acceleration;
            redisClient.hmset(key, `${field  }Acc`, value);
            break;
        case 2:
            value = msg.payload.deceleration;
            redisClient.hmset(key, `${field  }Dcc`, value);
            break;
        case 3:
            value = msg.payload.jerk;
            redisClient.hmset(key, `${field  }Jerk`, value);
            break;
        case 4:
            value = msg.payload.overrideDelay;
            redisClient.hmset(`${key  }Ex`, 'OverrideDelay', value);
            break;
        case 5:
            value = msg.payload.dccRatio;
            redisClient.hmset(`${key  }Ex`, 'DccRatio', value);
            break;
        default:
            break;
    }

    logger.info(`Send Command Change Each Parameter: uid:${client.Session.uid}, zoneID:${msg.payload.zoneID}`);
}

export function onChangeEveryParameterSelectedZone(msg: ChangeParamReq, client:Client) {
    const redisClient = Service.Inst.Redis;
    const channel = `TCMCmdCh:${Math.floor(msg.payload.zoneID / 100)}`;
    let message = '';

    message = MsgUtils.makeTcmChangeProfile(msg.payload.zoneID, msg.payload.speedType, 0, msg.payload.velocity);
    redisClient.publish(channel, message);
    message = MsgUtils.makeTcmChangeProfile(msg.payload.zoneID, msg.payload.speedType, 1, msg.payload.acceleration);
    redisClient.publish(channel, message);
    message = MsgUtils.makeTcmChangeProfile(msg.payload.zoneID, msg.payload.speedType, 2, msg.payload.deceleration);
    redisClient.publish(channel, message);
    message = MsgUtils.makeTcmChangeProfile(msg.payload.zoneID, msg.payload.speedType, 3, msg.payload.jerk);
    redisClient.publish(channel, message);
    message = MsgUtils.makeTcmChangeProfile(msg.payload.zoneID, msg.payload.speedType, 4, msg.payload.overrideDelay);
    redisClient.publish(channel, message);
    message = MsgUtils.makeTcmChangeProfile(msg.payload.zoneID, msg.payload.speedType, 5, msg.payload.dccRatio);
    redisClient.publish(channel, message);

    const key = `Zone:${msg.payload.zoneID}:Profile`;

    let field = '';

    switch (+msg.payload.speedType) {
        case 0:
            field += 'RunFast';
            break;
        case 1:
            field += 'Maint';
            break;
        case 2:
            field += 'RunSlow';
            break;
        case 3:
            field += 'Override';
            break;
        default:
            break;
    }

    redisClient.hset(key, `${field  }Vel`, msg.payload.velocity);
    redisClient.hset(key, `${field  }Acc`, msg.payload.acceleration);
    redisClient.hset(key, `${field  }Dcc`, msg.payload.deceleration);
    redisClient.hset(key, `${field  }Jerk`, msg.payload.jerk);
    redisClient.hset(`${key  }Ex`, 'OverrideDelay', msg.payload.overrideDelay);
    redisClient.hset(`${key  }Ex`, 'DccRatio', msg.payload.dccRatio);

    logger.info(`Send Command Change Every Parameter Selected. UID:${client.Session.uid} Zone: ${msg.payload.zoneID}`);
}

export function onChangeEveryParameterSameTypeZone(msg: ChangeParamReq, client:Client) {
    const redisClient = Service.Inst.Redis;
    const zoneRepo = Service.Inst.ZoneRepo;
    const zone = zoneRepo.Data.get(msg.payload.zoneID);
    if(zone === undefined) {
        throw new Error(`onChangeEveryParameterSameTypeZone. Zone ${msg.payload.zoneID} not found`);
    }

    const zoneType = zone.PhysicalType;
    Object.values(zoneRepo.Data).forEach((zone: Zone) => {
        if (zoneType === zone.PhysicalType) {
            const channel = `TCMCmdCh:${Math.floor(zone.ZoneID / 100)}`;
            let message = '';

            message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 0, msg.payload.velocity);
            redisClient.publish(channel, message);
            message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 1, msg.payload.acceleration);
            redisClient.publish(channel, message);
            message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 2, msg.payload.deceleration);
            redisClient.publish(channel, message);
            message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 3, msg.payload.jerk);
            redisClient.publish(channel, message);
            message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 4, msg.payload.overrideDelay);
            redisClient.publish(channel, message);
            message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 5, msg.payload.dccRatio);
            redisClient.publish(channel, message);

            const key = `Zone:${+zone.ZoneID}:Profile`;

            let field = '';

            switch (+msg.payload.speedType) {
                case 0:
                    field += 'RunFast';
                    break;
                case 1:
                    field += 'Maint';
                    break;
                case 2:
                    field += 'RunSlow';
                    break;
                case 3:
                    field += 'Override';
                    break;
                default:
                    break;
            }

            redisClient.hmset(key, `${field  }Vel`, msg.payload.velocity);
            redisClient.hmset(key, `${field  }Acc`, msg.payload.acceleration);
            redisClient.hmset(key, `${field  }Dcc`, msg.payload.dccRatio);
            redisClient.hmset(key, `${field  }Jerk`, msg.payload.jerk);
            redisClient.hmset(`${key  }Ex`, 'OverrideDelay', msg.payload.overrideDelay);
            redisClient.hmset(`${key  }Ex`, 'DccRatio', msg.payload.dccRatio);

            logger.info(`Send Command Change Every Parameter All Zone: ${client.Session.uid}, zoneType:${zoneType}`);
        }
    });
}

export function onChangeEveryParameterAllZone(msg: ChangeParamReq, client:Client) {
    const redisClient = Service.Inst.Redis;
    const zonerepo = Service.Inst.ZoneRepo.Data;
    Object.values(zonerepo).forEach((zone: Zone) => {
        const channel = `TCMCmdCh:${Math.floor(zone.ZoneID / 100)}`;
        let message = '';

        message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 0, msg.payload.velocity);
        redisClient.publish(channel, message);
        message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 1, msg.payload.acceleration);
        redisClient.publish(channel, message);
        message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 2, msg.payload.deceleration);
        redisClient.publish(channel, message);
        message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 3, msg.payload.jerk);
        redisClient.publish(channel, message);
        message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 4, msg.payload.overrideDelay);
        redisClient.publish(channel, message);
        message = MsgUtils.makeTcmChangeProfile(zone.ZoneID, msg.payload.speedType, 5, msg.payload.dccRatio);
        redisClient.publish(channel, message);

        const key = `Zone:${+zone.ZoneID}:Profile`;

        let field = '';

        switch (+msg.payload.speedType) {
            case 0:
                field += 'RunFast';
                break;
            case 1:
                field += 'Maint';
                break;
            case 2:
                field += 'RunSlow';
                break;
            case 3:
                field += 'Override';
                break;
            default:
                break;
        }

        redisClient.hmset(key, `${field  }Vel`, msg.payload.velocity);
        redisClient.hmset(key, `${field  }Acc`, msg.payload.acceleration);
        redisClient.hmset(key, `${field  }Dcc`, msg.payload.dccRatio);
        redisClient.hmset(key, `${field  }Jerk`, msg.payload.jerk);
        redisClient.hmset(`${key  }Ex`, `${field  }OverrideDelay`, msg.payload.overrideDelay);
        redisClient.hmset(`${key  }Ex`, `${field  }DccRatio`, msg.payload.dccRatio);

        logger.info(`Send Command Change Every Parameter All Zone: ${client.Session.uid}`);
    });
}
