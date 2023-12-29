const Redis = require('ioredis');

// redis에 Ip 주소 등록
const redis = new Redis(6380, '192.168.101.14');

process.nextTick(async () => {
    {
        let keys = await redis.keys('TCMInfo:*');
        for(let i=0; i<keys.length; i++) {
            break;
            
            const key = keys[i];
            let ary = key.split(':');
            if (ary.length != 2) {
                continue;
            }
            await redis.hset(key, 'HandOffByClient', '0');
            console.log(keys[i]);
        }
    }

    {
        // 예약된 Zone 초기화
        let keys = await redis.keys('Zone:*[0-9]');
        let jobs = [];
        for(let i=0, iLen=keys.length; i<iLen; i++) {
            const job = async() => {
                let key = keys[i];
                let attr = await redis.hgetall(key + ':DynamicAttributes');
                if (Number(attr.ReservedTaskID) !== -1) {
                    await redis.hmset(key + ':DynamicAttributes', 'ReservedTaskID', '-1');
                    console.log(`Free ReservedTaskID:${key}`);
                }
                if (Number(attr.AlarmSerialNumber) !== -1) {
                    await redis.hmset(key + ':DynamicAttributes', 'AlarmSerialNumber', '-1');
                    console.log(`Free AlarmSerialNumber:${key}`);
                }
                if (Number(attr.State) !== 0) {
                    await redis.hmset(key + ':DynamicAttributes', 'State', '0');
                    console.log(`Active State:${key}`);
                }
            };
            jobs.push(job);
        }
        await Promise.all(jobs.map(job => job()));
    }

    {
        // Task 초기화
        let keys = await redis.keys('TransferInfo:*[0-9]');
        for(let i=0, iLen=keys.length; i<iLen; i++) {
            const key = keys[i];
            await redis.del(key);
            console.log(`Delete TaskID:${key}`);
        }
    }

    {
        let keys = await redis.keys('System:Alarm:Record:*');
        for(let i=0, iLen=keys.length; i<iLen; i++) {
            const key = keys[i];
            await redis.del(key);
            console.log(`Delete Alarm:${key}`);
        }
    }

    {

    }

    process.exit(0);
});
