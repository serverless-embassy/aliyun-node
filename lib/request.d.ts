/// <reference types="node" />
import { IHttpRequest } from '@embassy/interface';
import { FC } from '@winry/fc2';
import { AliSource } from './source';
export declare class AliHttpRequest extends AliSource implements IHttpRequest {
    raw: FC.TRequest;
    constructor(raw: FC.TRequest);
    getUrl(): string;
    getPath(): string;
    getMethod(): string;
    getQueries(): object;
    getHeaders(): object;
    getClientIp(): string;
    getBodyByForm<T = unknown>(): Promise<T>;
    getBodyByJson<T = unknown>(): Promise<T>;
    getBodyByString(): Promise<string>;
    getBodyByBuffer(): Promise<Buffer>;
}
