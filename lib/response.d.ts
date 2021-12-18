/// <reference types="node" />
import { IHttpResponse } from '@embassy/interface';
import { FC } from '@winry/fc2';
import { AliSource } from './source';
export declare class AliHttpResponse extends AliSource implements IHttpResponse {
    raw: FC.TResponse;
    constructor(raw: FC.TResponse);
    delHeader(key: string): AliHttpResponse;
    setStatusCode(code: number): AliHttpResponse;
    setHeader(key: string, value: string): AliHttpResponse;
    send(body?: string | Buffer): AliHttpResponse;
}
