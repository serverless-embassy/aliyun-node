import { IHttpResponse } from '@embassy/interface';
import { FC } from '@winry/fc2';
import { AliSource } from './source';

export class AliHttpResponse extends AliSource implements IHttpResponse {
  raw: FC.TResponse;

  constructor(raw: FC.TResponse) {
    super();
    this.raw = raw;
  }

  delHeader(key: string): AliHttpResponse {
    this.raw.deleteHeader(key);
    return this;
  }

  setStatusCode(code: number): AliHttpResponse {
    this.raw.setStatusCode(code);
    return this;
  }

  setHeader(key: string, value: string): AliHttpResponse {
    this.raw.setHeader(key, value);
    return this;
  }

  send(body?: string | Buffer): AliHttpResponse {
    this.raw.send(body);
    return this;
  }
}
