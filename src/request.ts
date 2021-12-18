import { IHttpRequest } from '@embassy/interface';
import getRawBody from 'raw-body';
import getFormBody from 'body/form';
import { FC } from '@winry/fc2';
import { AliSource } from './source';

export class AliHttpRequest extends AliSource implements IHttpRequest {
  raw: FC.TRequest;

  constructor(raw: FC.TRequest) {
    super();
    this.raw = raw;
  }
  getUrl(): string {
    return this.raw.url;
  }
  getPath(): string {
    return this.raw.path;
  }
  getMethod(): string {
    return this.raw.method;
  }
  getQueries(): object {
    return this.raw.queries;
  }
  getHeaders(): object {
    return this.raw.headers;
  }
  getClientIp(): string {
    return this.raw.clientIP;
  }

  async getBodyByForm<T = unknown>(): Promise<T> {
    return new Promise((resolve) => {
      getFormBody(this.raw, function (err: unknown, formBody: unknown) {
        resolve(formBody as T);
      });
    });
  }

  async getBodyByJson<T = unknown>(): Promise<T> {
    const string = await this.getBodyByString();
    return JSON.parse(string) as T;
  }

  async getBodyByString(): Promise<string> {
    const buffer = await this.getBodyByBuffer();
    return buffer.toString();
  }

  async getBodyByBuffer(): Promise<Buffer> {
    return new Promise((resolve) => {
      getRawBody(this.raw, function (err, data) {
        resolve(data);
      });
    });
  }
}
