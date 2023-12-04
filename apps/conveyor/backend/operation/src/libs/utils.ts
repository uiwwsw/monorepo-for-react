import * as zlib from 'zlib';
import { promisify } from 'util';
import { exec, spawn } from 'child_process';
import { Redis } from 'ioredis';

// zlib의 gzip과 gunzip을 Promise 기반으로 사용하기 위해 promisify 사용
const gzipAsync = promisify(zlib.gzip);
const gunzipAsync = promisify(zlib.gunzip);

// exec과 spawn을 Promise 기반으로 사용하기 위해 promisify 사용
export const execAsync = promisify(exec);
export const spawnAsync = promisify(spawn);

// JSON 데이터를 압축하고 Base64로 인코딩하는 함수
export async function compressAndEncodeBase64(jsonData: object): Promise<string> {
    const jsonString = JSON.stringify(jsonData);
    const buffer = await gzipAsync(jsonString);
    return buffer.toString('base64');
}

export async function jsonToZipAndEncodeBase64(jsonString: string): Promise<string> {
    const buffer = await gzipAsync(jsonString);
    return buffer.toString('base64');
}

// Base64 인코딩된 문자열을 디코딩하고 JSON 데이터로 압축 해제하는 함수
export async function decodeBase64AndDecompress(encodedString: string): Promise<object> {
    const buffer = Buffer.from(encodedString, 'base64');
    const decompressedBuffer = await gunzipAsync(buffer);
    return JSON.parse(decompressedBuffer.toString());
}

export async function uncompressBase64ToJson(encodedString: string): Promise<string> {
    const buffer = Buffer.from(encodedString, 'base64');
    const decompressedBuffer = await gunzipAsync(buffer);
    return decompressedBuffer.toString();
}

export const scanRedisKeys = async (redis:Redis, pattern:string) : Promise<string[]> => {
    const keys: string[] = [];
    let cursor = '0';
    do {
        // SCAN 명령 실행
        const result: [string, string[]] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = result[0];
        keys.push(...result[1]);
    } while (cursor !== '0');

    return keys;
}

export const sleep =async (timeout:number) => {
    await new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}