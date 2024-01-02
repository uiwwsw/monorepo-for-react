const Redis = require('ioredis');

// redis에 Ip 주소 등록
const redis = new Redis(6380, '192.168.101.14');
const subs = new Redis(6380, '192.168.101.14');

let tasks = {};
let jobID = 0;

subs.subscribe('TransferInfoCh');
subs.psubscribe('TCMZoneCh:*');
subs.on('message', (channel, message) => {
    try {
        //console.log(message);
        const obj = JSON.parse(message);
        if (obj.MessageID != 'tcmTransferInfo') {
            return;
        }
        const data = obj.MessageData.Object;
        switch(data.State) {
            case 'READY':
                if (tasks[data.ZoneIDFrom]) {
                    tasks[data.ZoneIDFrom] = data
                }
                break;
            case 'COMPLETE':
                Object.keys(tasks).forEach((key) => {
                    if (tasks[key].TaskID === data.TaskID) {
                        delete tasks[key];
                    }
                });
                break;
        }
    } catch (ex) {
        console.error(ex);
    }
});
subs.on('pmessage', (pattern, channel, message) => {
    try {
        const obj = JSON.parse(message);
        if (obj.MessageID !== 'tcsEventSet') {
            return;
        }
        const data = obj.MessageData;
        if (data.EventCode === '22230') {
        }
    } catch (ex) {
        console.error(ex);
    }
});

process.nextTick(async () => {
    const groupIdx = [301, 302, 307, 306, 305, 101, 102, 103, 107, 106];
    // In/Out Zone 정보 조회
    let keys = await redis.keys('Zone:*[0-9]');
    let group = {
        A : {
            inputZone: [],
            outputZone: []
        },
        B : {
            inputZone: [],
            outputZone: []
        }
    }
    let jobs = [];
    for(let i=0, iLen=keys.length; i<iLen; i++) {
        const job = async() => {
            let key = keys[i];
            let zoneId = Number(key.split(':')[1]);
            let tcmId = Math.floor(zoneId / 100);
            const grp = groupIdx.indexOf(tcmId) > -1 ? group.A : group.B;
            let zone = await redis.hgetall(key);
            if (Number(zone.PhysicalType) === 2) {
                grp.inputZone.push(zoneId);
                //console.log(`inputZone:${key}. ${i}/${iLen}`);
            }
            if (Number(zone.PhysicalType) === 3) {
                grp.outputZone.push(zoneId);
                //console.log(`inputZone:${key}. ${i}/${iLen}`);
            }
        };
        jobs.push(job);
    }
    await Promise.all(jobs.map(job => job()));

    _ = stressTest(group.A);
    _ = stressTest(group.B);

    //process.exit(0);
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function addZero(x, n) {
    let xStr = x.toString();
    while (xStr.length < n) {
        xStr = `0${x}`;
    }
    return xStr;
}

function currentTimeInMilliseconds() {
    const d = new Date();
    const mo = addZero(d.getMonth() + 1, 2);
    const da = addZero(d.getDate(), 2);
    const h = addZero(d.getHours(), 2);
    const m = addZero(d.getMinutes(), 2);
    const s = addZero(d.getSeconds(), 2);
    const ms = addZero(Math.floor(d.getMilliseconds() / 10), 2);
    return d.getFullYear() + mo + da + h + m + s + ms;
}

function makeHimForceInstallCarrier(zoneID, carrierID) {
    /** Web Notuse */
    const data = {
        BaseTime: currentTimeInMilliseconds(),
        ZoneID: zoneID,
        CarrierID: carrierID,
        IsAuto: 0
    };

    const msg = {
        MessageID: 'himForceInstallCarrier',
        MessageData: data,
    };

    return JSON.stringify(msg);
}

function makeHimChangeCmdReq(taskID, changeCommand, oldValue, newValue, dataValue) {
    const data = {
        BaseTime: currentTimeInMilliseconds(),
        TaskID: taskID,
        ChangeCommand: changeCommand,
        OldValue: oldValue || '',
        NewValue: newValue || '',
        DataValue: dataValue || '',
    };

    const msg = {
        MessageID: 'himChangeCmdReq',
        MessageData: data,
    };

    return JSON.stringify(msg);
}

async function stressTest(data) {
    do {
        let inputZone = shuffleArray(JSON.parse(JSON.stringify(data.inputZone)));
        let outputZone = shuffleArray(JSON.parse(JSON.stringify(data.outputZone)));

        while (inputZone.length > 0) {
            let zoneIDFrom = inputZone.pop();
            let carrierID = `STRESS_${++jobID}`;
            tasks[zoneIDFrom] = {};

            redis.publish(`TCMCmdCh:${Math.floor(zoneIDFrom / 100)}`, makeHimForceInstallCarrier(zoneIDFrom, carrierID));
            let ttl = new Date().getTime() + 1000 * 10;
            while(new Date().getTime() < ttl) {
                await new Promise((resolve) => { setTimeout(() => { resolve(); }, 1000); });
                if (tasks[zoneIDFrom].State === 'READY') {
                    break;
                }
            }
            if (tasks[zoneIDFrom].State !== 'READY') {
                console.log(`zoneIDFrom:${zoneIDFrom} is not ready`);
                continue;
            }

            console.log(`zoneIDFrom:${zoneIDFrom} is ready`);
            let task = tasks[zoneIDFrom];
            let output = outputZone.pop();
            let message = makeHimChangeCmdReq(task.TaskID, 'DestChange', '', output.toString(), '');
            redis.rpush('DCMCmdList', message);
            console.log(`zoneIDFrom:${zoneIDFrom} is moved to outputZone:${output}`);

            await new Promise((resolve) => { setTimeout(() => { resolve(); }, 2000); });
        }
    } while (true);
}
