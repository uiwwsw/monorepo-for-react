#!/usr/bin/env node

'use strict';

const mysql     = require('mysql');
const util      = require('util');
const xlsx      = require('xlsx');
const async     = require('async');
const __        = require('underscore');
const fs        = require('fs');
const path     = require('path');

global.argv = require('optimist').argv;

global.argv.nofile = false;
global.argv.baseDir = '../src/models';
global.argv.dataDir = '../src/packages/backend/types/src/data';

let schemas = [];
let cfg = '../src/cfg/prop.json';
const prop = require(cfg).MySQL;
['R301'].forEach(name => {
    schemas.push({
        Name: name,
        DataBase: prop.Database,
        Host: prop.Host,
        Port: prop.Port,
        User:  prop.User,
        Password:  prop.Password
    });
});

async.eachSeries(schemas, initSchema, function(err) {
    err && console.warn('initSchema. error:%s', err.stack);
});

function initSchema(schema, cb) {
    try {
        var connection = {
            main : null
        };

        connection.end = function() {
            if (this.main) this.main.end();
        };

        connection.main = mysql.createConnection({
            host     : schema.Host,
            port     : parseInt(schema.Port) || 3306,
            user     : schema.User,
            password : schema.Password,
            database : schema.DataBase
        });

        var name = util.format('./%s.xlsx', schema.Name);
        var iFile = xlsx.readFile(name);
        var tables = {};
        iFile.SheetNames.forEach(function(name) {
            var sheet = iFile.Sheets[name];
            tables[name] = xlsx.utils.sheet_to_row_object_array(sheet);
        });

        connection.main.query('show engines', function(err, rows) {
            try {
                if (err) throw err;
                var iEngine;
                rows.forEach(function(row) {
                    row.Support.toUpperCase() === 'DEFAULT' && (iEngine = row.Engine);
                });

                getTableList(connection.main, schema.DataBase, function(err, iList) {
                    if (err) {
                        cb(null);
                        connection.end();
                        return;
                    }

                    var domain = {};
                    var iData = [], workList = [];
                    var iDomains = tables.Domain;

                    iDomains.forEach(function(iRef, pos) {
                        if (!tables[iRef.TableName]) {
                            iDomains[pos] = null;
                            return;
                        }

                        iData.push({
                            schema : schema.DataBase,
                            domain : domain,
                            iRef : iRef,
                            iList : iList,
                            tables : tables,
                            workList : workList,
                            iEngine : schema.Engine || iEngine
                        })
                    });
                    iDomains = __.without(iDomains, null);

                    async.mapSeries(iData, function(data, cb) {
                        initTable(connection.main, data, cb)
                    }, function(err) {
                        console.log('initSchema. name:%s(%s)', schema.Name, schema.DataBase);
                        if (err) {
                            cb(err);
                            connection.end();
                            return;
                        }

                        initPrimaryKey(connection.main, schema, tables, function(err) {
                            if(err){
                                cb(err);
                                connection.end();
                                return;
                            }

                            saveDomain(schema, tables, function(err) {
                                if(tables['DDL']){
                                    initDDL(connection.main, schema.DataBase, tables['DDL'], function(err){
                                        if (err) {
                                            cb(null);
                                            connection.end();
                                            return;
                                        }
                                        cb(err);
                                        connection.end();
                                    });
                                }else{
                                    cb(err);
                                    connection.end();
                                }
                            });

                        });
                    });
                });
            } catch (ex) {
                cb(ex);
            }
        });
    } catch (ex) {
        console.warn('initSchema. error:%s', ex.message);
        console.warn(ex.stack);
        cb(null);
    }
}

function saveDomain(schema, data, cb) {
    if (global.argv.nofile) {
        return cb(null);
    }

    var iDomain = data.Domain;
    var schemas = [];
    let dataAry = [];

    schemas.push(`import { RowDataPacket } from 'mysql2';`)

    __.without(iDomain, null).forEach(function(item) {
        var table = data[item.TableName];
        if (!table) return;

        let ary = [];
        let ary2 = [];
        let name = item.Name[0].toUpperCase() + item.Name.substring(1);
        ary.push(`export interface ${name}Row extends RowDataPacket {`);
        ary2.push(`export interface I${item.Name}Row {`);
        table.forEach(function(col) {
            if (col.Name) {
                let type = col.DataType.split('(')[0].toLowerCase();
                switch(type) {
                    case 'bigint':
                    case 'smallint':
                    case 'tinyint':
                    case 'int':
                        type = 'number';
                        break;
                    case 'varchar':
                    case 'char':
                    case 'text':
                    case 'longtext':
                    case 'mediumtext':
                        type = 'string';
                        break;
                    case 'datetime':
                    case 'timestamp':
                    case 'date':
                        type = 'Date';
                        break;
                    default:
                        throw new Error(`unknown table:${item.TableName}, col:${col.Name}, type:${type}`);
                }
                ary.push(util.format('    %s : %s;', col.Name, type));
                ary2.push(util.format('    %s? : %s;', col.Name, type));
            }
        });
        ary.push('}');
        ary2.push('}');

        schemas.push(ary.join('\n'));
        dataAry.push(ary2.join('\n'));
    });

    let iFile = path.join(global.argv.baseDir, schema.Name + '.ts');
    fs.writeFileSync(iFile, schemas.join('\n\n'), 'utf8');
    console.log('saved %s', iFile);

    let iFile2 = path.join(global.argv.dataDir, schema.Name + '.ts');
    fs.writeFileSync(iFile2, dataAry.join('\n\n'), 'utf8');
    console.log('saved %s', iFile2);

    cb(null);
}

/**
 * 테이블 리스트 조회..
 * @connection
 * @param connection
 * @param name 데이터베이스
 * @param cb
 */
function getTableList(connection, name, cb) {
    var qry = [];
    qry.push('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES');
    qry.push(util.format('WHERE TABLE_SCHEMA = "%s"', name));
    connection.query(qry.join('\n'), function(err, rows) {
        if (err) {
            cb(err);
            return;
        }

        var iList = [];
        rows.forEach(function(row) {
            iList.push({
                schema : name,
                name : row.TABLE_NAME
            });
        });

        var iAck = {};
        async.mapSeries(iList, function(data, cb) { getColumnList(connection, data, cb) }, function(err, results) {
            results.forEach(function(result, idx) {
                iAck[iList[idx].name] = result.cols;
            });
            cb(null, iAck);
        });
    });
}

/** 특정 테이블의 컬럼 조회.. */
function getColumnList(connection, data, cb) {
    var qry = util.format('SHOW COLUMNS from `%s`.%s', data.schema, data.name);

    connection.query(qry, function(err, rows) {
        var iAck = {
            error : err,
            cols : []
        };
        if (!err) {
            rows.forEach(function(row) {
                iAck.cols[row.Field] = {
                    DataType : row.Type,
                    IsNull : row.Null === 'NO' ? 'NOT' : undefined,
                    IsKey : row.Key
                }
            });
        }
        cb(null, iAck);
    });
}

/** 테이블 생성/수정 작업.. */
function initTable(connection, data, cb) {
    try {
        var name = data.iRef.TableName;
        if (__.indexOf(data.workList, name) >= 0) {
            cb(null);
            return;
        }
        data.workList.push(name);
        if (!data.iList[name]) {
            var createQryList = getCreateQry(data.schema, data.iRef, data.tables[name], data.iEngine);

            async.map(createQryList,
                function(createQry, callback){
                    connection.query(createQry, callback);
                },
                function(err){
                    if (err) {
                        console.error(createQryList);
                        console.error(err.message);
                        cb(null);
                        return;
                    }
                    console.log('create table %s.%s', data.schema, name);
                    cb(null);
                }
            );
        } else {
            var qryList = getAlterQry(data.schema, data.iRef, data.iList[name], data.tables[name]);
            if (qryList.length === 0) {
                cb(null);
                return;
            }
            async.map(qryList, function(qry, callback) {connection.query(qry, callback);}, function(err) {
                if (err) {
                    console.error(qryList);
                    console.error(err.message);
                    cb(null);
                    return;
                }
                console.log('alert table %s.%s', data.schema, name);
                console.log(qryList);
                cb(null);
            });
        }
    } catch (ex) {
        console.warn('initTable. %s.%s error:%s', data.schema, data.iRef.TableName, ex.code);
        console.log(ex.stack);
        cb(null, ex);
    }
}

/** 테이블 생성 쿼리 작성 .. */
function getCreateQry(schema, desc, obj, iEngine) {
    var cols = [], key = [], qry = [], ainum = undefined, uqIdx = {}, idxList = {};
    obj.forEach(function(col) {
        if (col.Name){
            // true 인지 숫자인지를 판단 한다.
            if(col.AI  && isNaN(String(col.AI)) === false) ainum = col.AI;
            cols.push(util.format('`%s` %s %s NULL %s COMMENT "%s"', col.Name.trim(), col.DataType, col.IsNull?'NOT':'', col.AI?'AUTO_INCREMENT' : '', col.Description || ''));
            if(col.UQ) {
                uqIdx[col.UQ] || (uqIdx[col.UQ] = []);
                uqIdx[col.UQ].push('`' + col.Name + '`');
            }
            if(col.IDX) {
                idxList[col.IDX] || (idxList[col.IDX] = []);
                idxList[col.IDX].push('`' + col.Name + '`');
            }
            col.IsKey && key.push(util.format('`%s`', col.Name));
        }
    });
    var partition = '';
    if (desc.PartitionKey && desc.PartitionKey !== '') {
        switch(desc.PartitionBy) {
            case 'LIST':
                partition = util.format('PARTITION BY LIST COLUMNS (`%s`) (PARTITION p1 VALUES IN (1))', desc.PartitionKey);
                break;
            case 'RANGE':
                var now = new Date(),
                    pName = util.format('p%s', toDateFmt('YYMMDD', now));
                now.setDate(now.getDate() + 1);
                partition = util.format('PARTITION BY RANGE (TO_DAYS(`%s`)) (PARTITION %s VALUES LESS THAN (TO_DAYS("%s")))',
                    desc.PartitionKey, pName, toDate(now));
                break;
            default :
                partition = util.format('PARTITION BY HASH(`%s`) PARTITIONS %s', desc.PartitionKey, desc.PartitionNum);
                break;
        }
    }
    var primaryKey = key.length === 0 ? '' : util.format(',\n PRIMARY KEY (%s)', key.join(','));
    desc.Engine || (desc.Engine = iEngine);
    qry.push(util.format('CREATE TABLE `%s`.`%s` (\n  %s %s )\n  ENGINE=%s DEFAULT CHARSET=utf8 \n %s',
        schema, desc.TableName, cols.join(',\n  '), primaryKey, desc.Engine, partition));

    //Auto_Increment 초기값 설정을 위해 ALTER TABLE을 해준다.
    if(ainum){
        qry.push(util.format('ALTER TABLE `%s`.`%s` AUTO_INCREMENT = %s', schema, desc.TableName, ainum));
    }

    Object.keys(uqIdx).forEach(function(name) {
        var iList = uqIdx[name];
        qry.push(util.format('ALTER TABLE `%s`.`%s` ADD UNIQUE INDEX `%s` (%s)', schema, desc.TableName, name, iList.join(', ')));
    });

    Object.keys(idxList).forEach(function(name) {
        var iList = idxList[name];
        qry.push(util.format('ALTER TABLE `%s`.`%s` ADD INDEX `%s` (%s)', schema, desc.TableName, name, iList.join(', ')));
    });

    return qry;
}

/** 테이블 수정 쿼리 작성 ... */
function getAlterQry(schema, desc, ref, obj) {
    var qry = [];

    function isEqualDataType(t1, t2) {
        var numeric = ['bigint', 'smallint', 'tinyint', 'int'];
        var type = t1.split('(')[0].toLowerCase();
        if (__.indexOf(numeric, type) < 0) {
            return t1.toLowerCase().trim() === t2.toLowerCase().trim();
        } else {
            let type2 = t2.split('(')[0].toLowerCase();
            return type === type2.trim();
        }
    }

    function isEqualNull(t1, t2) {
        t1 || (t1 = '');
        t2 || (t2 = '');

        return t1.toLowerCase().trim() === t2.toLowerCase().trim();
    }

    obj.forEach(function(col) {
        if (col.Name) {
            // 컬럼 데이터 형 수정..
            var iDef = ref[col.Name];
            if (iDef) {
                if (!isEqualDataType(iDef.DataType.trim(), col.DataType.trim()) || !isEqualNull(iDef.IsNull, col.IsNull)) {
                    console.log(iDef.DataType, col.DataType, iDef.IsNull, col.IsNull);
                    qry.push(util.format('alter table `%s`.`%s` modify column `%s` %s %s NULL COMMENT "%s"', schema, desc.TableName, col.Name.trim(), col.DataType, col.IsNull?'NOT':'', col.Description || ''));
                }
                delete ref[col.Name];
            } else {
                // 컬럼 추가..
                qry.push(util.format('alter table `%s`.`%s` add column `%s` %s %s NULL COMMENT "%s"', schema, desc.TableName, col.Name, col.DataType, col.IsNull?'NOT':'', col.Description || ''));
            }
        }
    });

    // Excel에서 컬럼 삭제시, 삭제한 컬럼이 not Null일 경우 Null 허용으로 변환
    var refKey = Object.keys(ref);
    if(refKey.length){
        refKey.forEach(function(key){
            if(ref[key]['IsNull'] !== undefined){
                qry.push(util.format('alter table `%s`.`%s` modify column `%s`  %s NULL', schema, desc.TableName, key, ref[key]['DataType']));
            }
        });
    }

    return qry;
};


function initPrimaryKey(connection, schema, data, cb){
    try{
        var tableNames = __.pluck(data.Domain, 'TableName');
        var sheetTbl = {};

        tableNames.forEach(function (table, pos){
            sheetTbl[table] = [];
            if (!data[table]) {
                tableNames[pos] = null;
                return;
            }
            data[table].forEach(function (row){
                if(row.IsKey){
                    sheetTbl[table].push(row.Name);
                }
            });
        });

        tableNames = __.without(tableNames, null);

        async.mapSeries(tableNames, function(table, callback) {
            getTablePrimaryKey(connection, table, schema, callback);
        },function(err, result){
            if(err){
                console.log(err);
                return cb(err);
            }
            async.mapSeries(result, function (item, callback){
                comparePKandRenew(connection, item, sheetTbl, schema, callback);
            },function(err){
                if(err){
                    console.log(err);
                    return cb(err);
                }
                cb(null);
            });
        });
    } catch (ex) {
        //console.warn(data);
        cb(ex);
    }
};

function getTablePrimaryKey(connection, table, schema, cb){
    try{
        var qry =  [];

        qry.push('SELECT `COLUMN_NAME`');
        qry.push('FROM `INFORMATION_SCHEMA`.`COLUMNS`');
        qry.push(util.format('WHERE (`TABLE_SCHEMA` = "%s")', schema.DataBase));
        qry.push(util.format('AND (`TABLE_NAME` = "%s")', table));
        qry.push('AND (`COLUMN_KEY` = "PRI")');
        connection.query(qry.join('\n'), function(err, result){
            if(err){
                return cb(err, {
                    name : table,
                    pk : 'err'
                });
            }
            var pkAry = [];
            result.forEach(function (item){
                pkAry.push(item.COLUMN_NAME);
            });

            cb(null, {
                name : table,
                PK : pkAry
            });
        });
    } catch (ex){
        console.log(ex);
        cb(ex);
    }
}

function comparePKandRenew(connection, item, sheetTbl, schema, cb){
    try{
        var diffDBPK = __.difference(item['PK'], sheetTbl[item.name]);
        var diffSheetPK = __.difference(sheetTbl[item.name], item['PK']);

        if(diffDBPK.length > 0 || diffSheetPK.length > 0){
            var qry = [];
            var pkStr = sheetTbl[item.name].join("`, `");
            var pkstr = "`" + pkStr + "`";

            qry.push(util.format('ALTER TABLE `%s`.`%s` DROP PRIMARY KEY,',schema.DataBase ,item.name));
            qry.push(util.format('ADD PRIMARY KEY(%s)', pkstr));
            qry = qry.join(' ');
            console.log(qry);
            connection.query(qry, function(err){
                err && console.log(err);
                cb(err);
            });
        } else{
            cb(null);
        }
    } catch(ex) {
        console.log(ex.stack);
        try {
            cb(ex);
        } catch (ex2) {
            console.warn(ex2.stack);
        }
    }
};

function initDDL(connection, schema, ddlList, cb){
    try{
        getDDLList(connection, schema, function(err, refList){
            var createAry = [];
            var modifyAry = [];
            ddlList.forEach(function(item){

                if(refList[item.Name] !== undefined){
                    switch(item.Category){
                        case 'SP' :{
                            if(compareSP(refList[item.Name]['routine_definition'], item.Query))
                                break;
                            modifyAry.push(item);
                            break;
                        }
                        case 'EVENT' : {
                            if(compareEvt(refList[item.Name]['Create Event'], item.Query))
                                break;
                            modifyAry.push(item);
                            break;
                        }
                        case 'TRI' :{
                            if(compareTRI(refList[item.Name], item.Query)){break;}
                            modifyAry.push(item);
                            break;
                        }
                    }
                    delete refList[item.Name];
                }else{
                    createAry.push(item);
                }
            });

            async.series([
                    function(callback){
                        //새로 추가 되는 DDL
                        if(createAry.length > 0){
                            async.mapSeries(createAry,
                                function(item, callback){
                                    createDDL(connection, schema, item, callback);
                                }, callback);
                        }else{
                            callback(null);
                        }
                    },
                    function(callback){
                        // 수정 되는 DDL
                        if(modifyAry.length > 0){
                            async.mapSeries(modifyAry,
                                function(item, callback){
                                    var tblName;
                                    if(item.Category ==='IDX') {tblName = getIdxTblNameFromQry(item.Query)}
                                    dropDDL(connection, item.Category, item.Name, tblName, function(err, result){
                                        if(err){
                                            callback(err);
                                        }
                                        if(result==='success'){
                                            createDDL(connection, schema, item, callback);
                                        }
                                    });
                                }, callback);
                        }else{
                            callback(null);
                        }
                    },
                    function(callback){
                        ////////////////////////////////////////////////
                        // DLL 삭제 안함

                        return callback(null);

                        // DLL 삭제
                        if(Object.keys(refList).length > 0){
                            async.mapSeries(Object.keys(refList),
                                function(key, callback){
                                    dropDDL(connection, refList[key]['Category'], refList[key]['name'], refList[key]['table_name'], callback);
                                }, callback);
                        }else{
                            callback(null);
                        }
                    }],cb);
        });
    } catch(ex){
        console.warn('initDDL : %s error:%s', schema,  ex.code);
        console.log(ex.stack);
        cb(null, ex);
    }
}

function getDDLList(connection, schema, cb){

    try{
        var qryList = [];
        /*
         var qry = [];
         qry.push('SELECT "IDX" AS Category, `table_name`, `index_name` AS name, `column_name`');
         qry.push('FROM `information_schema`.`statistics`');
         qry.push(util.format('WHERE `table_schema` = "%s" AND index_name not in ("PRIMARY")', schema));
         qryList.push(qry.join(''));
         */
        var qry = [];
        qry.push('SELECT "TRI" AS Category, `trigger_name` AS name, `event_object_table`, `event_manipulation`, `action_statement`, `action_timing`');
        qry.push('FROM information_schema.triggers ');
        qry.push(util.format('WHERE `trigger_schema` = "%s"', schema));
        qryList.push(qry.join(''));

        qry = [];
        qry.push('SELECT "SP" AS Category, `routine_name` AS name, `routine_definition`');
        qry.push('FROM `information_schema`.`routines`');
        qry.push(util.format('WHERE routine_schema = "%s" AND routine_type = "PROCEDURE"', schema));
        qryList.push(qry.join(''));

        async.series([
            function(cb2) { async.mapSeries(qryList, function(qry, callback) {connection.query(qry, function(err, rows) { callback(err, rows) })}, cb2 ) },
            function(cb2) {
                async.waterfall([
                    function(callback) { connection.query('show events', function(err, rows) { callback(err, rows); }) },
                    function(rows, callback) {
                        var iList = [];
                        rows.forEach(function(row) {
                            iList.push(util.format('show create event %s.%s', row.Db, row.Name));
                        });
                        async.mapSeries(iList, function(qry, cb3) { connection.query(qry, function(err, rows) { cb3(err, rows); }, callback) }, cb2 )
                    }
                ])
            }
        ], function(err, results) {
            try {
                if (err) throw err;

                var refList = {};
                results.forEach(function(result) {
                    result.forEach(function(rows) {
                        rows.forEach(function(row) {
                            refList[row.name || row.Event] = row;
                        })
                    })
                });
                cb(null, refList);
            } catch (ex) {
                cb(ex);
            }
        });
    }catch(ex){
        console.warn('getDDLList. %s error:%s', schema,  ex.code);
        console.log(ex.stack);
        cb(null, ex);
    }

}

function compareSP(iRef, tQry){
    tQry = tQry.replace(/[\r|\t*]/g, '');
    iRef = iRef.replace(/[\r|\t*]/g, '');
    tQry = tQry.split('\n');
    iRef = iRef.split('\n');
    iRef = iRef.join('');

    for(var x = 0, n = tQry.length ; x < n ; x++ ){
        if(tQry[x].toUpperCase().trim() ==='BEGIN'){
            tQry = tQry.splice(x,tQry.length);
            tQry = tQry.join('');
            break;
        }
    }

    return trim(iRef.toUpperCase()) === trim(tQry.toUpperCase());
}

function compareEvt(iQry, tQry){
    var p1 = iQry.indexOf('DEF'),
        p2 = iQry.indexOf('EVENT'),
        iRef = iQry.substring(0, p1-1) + ' ' +iQry.substring(p2);
    iRef = iRef.replace('ON COMPLETION NOT PRESERVE ENABLE', '');

    tQry = tQry.replace(/[`|'|"|' '|\n|\r|\t*]/g, '');
    iRef = iRef.replace(/[`|'|"|' '|\n|\r|\t*]/g, '');

    return trim(iRef.toUpperCase()) === trim(tQry.toUpperCase());
}


function compareIDX(columnName, tQry){
    tQry = tQry.split('(')[1].split(')')[0];
    tQry = tQry.split(',');

    for(var x = 0, n = tQry.length ; x < n ; x++ ){
        if(trim(tQry[x].toUpperCase()) === trim(columnName.toUpperCase())){
            return true;
        }
    }
    return false;
}

function compareTRI(triObj,tQry){

    var refQry = triObj['action_statement'].replace( /[\r|\n|\t*]/g, ' ').split(' ').join('');
    tQry = tQry.replace( /[\r|\n|\t*]/g, ' ').split(' ');

    for(var x = 0, n = tQry.length ; x < n ; x++ ){
        if(tQry[x] === ''){
            tQry.splice(x, 1);
            x = x-1,n = n-1;
        }
    }

    if(triObj['action_timing'] !== tQry[3]){
        return false;
    }
    if(triObj['event_manipulation'] !== tQry[4]){
        return false;
    }

    for(var x = 0, n = tQry.length ; x < n ; x++ ){
        if(tQry[x] === 'BEGIN'){
            tQry = tQry.splice(x,tQry.length).join('');
            break;
        }
    }

    if(refQry === tQry){
        return true;
    }

    return false;
};

function createDDL(connection, schema, ddlObj, cb){
    try{
        var queryList = [];
        queryList.push(util.format('USE `%s`',schema));
        queryList.push(ddlObj.Query);

        console.log(util.format('CREATE DDL SCHEMA : %s, TYPE : %s, NAME : %s', schema, ddlObj.Category, ddlObj.Name));

        async.mapSeries(queryList,
            function(qry, callback){
                (function(qry, callback){
                    connection.query(qry,function(err, result){
                        if(err) {
                            return callback(err);
                        }
                        callback(null, 'success');
                    });
                })(qry, function(err, result){
                    if(err){
                        console.warn(util.format('createDDL : %s Error : %s', schema, err.code));
                        console.log(qry);
                        return callback(null, err);
                    }
                    callback(err, result);
                });
            },
            function(err){
                cb(err);
            });
    }catch(ex){
        console.warn('createDDL : %s error:%s', ddlObj.Name,  ex.code);
        console.log(ex.stack);
        cb(ex);
    }
}


function dropDDL(connection, category, ddlName, tableName, cb){
    try{
        var type = {
            SP: 'PROCEDURE',
            TRI : 'TRIGGER',
            EVENT : 'EVENT',
            IDX : 'INDEX'};
        var qry = util.format('DROP %s %s',type[category], ddlName);
        if(category === 'IDX'){
            qry = qry + util.format(' ON %s', tableName);
        }
        console.log(qry);
        connection.query(qry,function(err, result){
            if(err){
                cb(err);
            }

            cb(null, 'success');

        });
    }catch(ex){
        console.warn(util.format('dropDDL : %s / %s error:%s:', category, ddlName, ex.code));
        console.log(ex.stack);
        cb(null, ex);
    }

}

function getIdxTblNameFromQry(query){
    query = query.split(' ');

    for(var x = 0 ; x < query.length ; x++){
        if(query[x].toUpperCase() === 'ON'){
            return query[x + 1];
        }
    }
}

function trim(str){
    return str.replace( /(\s*)/g, '');
}

function pad2(num) {
    return (num < 10 ? '0' : '') + num; 
}

function toDateFmt(format, date) {
    typeof(date) === 'string' && (date = new Date(date));
    var vDay = pad2(date.getDate());
    var vMonth = pad2(date.getMonth()+1);
    var vYearLong = pad2(date.getFullYear());
    var vYearShort = pad2(date.getFullYear().toString().substring(2,4));
    var vYear = (format.indexOf('YYYY') > -1 ? vYearLong : vYearShort);
    var vHour  = pad2(date.getHours());
    var vMinute = pad2(date.getMinutes());
    var vSecond = pad2(date.getSeconds());
    return format
        .replace(/DD/g, vDay)
        .replace(/MM/g, vMonth)
        .replace(/Y{1,4}/g, vYear)
        .replace(/HH/g, vHour)
        .replace(/MI/g, vMinute)
        .replace(/SS/g, vSecond);
}

function toDate(t) {
    t || ( t = new Date() );
    typeof(t) === 'string' && (t = new Date(t));
    return t.getFullYear()+'-'+ pad2(t.getMonth()+1)+'-'+ pad2(t.getDate());
}
