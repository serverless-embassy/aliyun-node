import { IClient, IReturn, TOptions } from "@embassy/interface";
import { FC, FCClient, IFCClientConfig, IServiceResponse } from "@winry/fc2";
import { AliConnector } from './connector';


export type TClientOptions = {
  accountId: string,
} & IFCClientConfig


export class AliClient implements IClient {
  client: FCClient

  connector = new AliConnector();

  constructor(config: TClientOptions){
    const { accountId, ...rest } = config
    this.client = new FCClient(accountId, rest)
  }

  async invoke<
    TEvent = string | object, 
    TResult = void
  >(
    srvName: string, funcName: string, 
    event?: TEvent, options: TOptions = {},
  ): Promise<AliReturn<TResult>> {
    const { headers, qualifier, ...rest } = options
    let args
    if (typeof event === 'string' || event instanceof Buffer) {
      args = event
    } else if (event) {
      args = Buffer.from(JSON.stringify(event))
    }
    const raw = await this.client.invokeFunction(
      srvName, funcName, args, 
      headers, qualifier, rest
    )
    const re = new AliReturn<TResult>(raw)
    return re
  }

}

export class AliReturn<T = void> implements IReturn<T> {
  raw: IServiceResponse

  constructor(raw: IServiceResponse) {
    this.raw = raw
  }
  getData(): T {
    return this.raw.data as unknown as T
  }
  getHeaders(): object {
    return this.raw.headers
  }
  toBuffer(): Buffer {
    const { data } = this.raw
    if (data instanceof Buffer) {
      return data
    }
    if (typeof data === "string") {
      return Buffer.from(data)
    }
    return Buffer.from(JSON.stringify(data))
  }
  toString(): string {
    const { data } = this.raw
    if (data instanceof Buffer) {
      return data.toString()
    }
    if (typeof data === "string") {
      return data
    }
    return JSON.stringify(data)
  }
  toJson(): object {
    let { data } = this.raw
    if (data instanceof Buffer) {
      data = data.toString()
    }
    if (typeof data === "string") {
      data = JSON.parse(data)
    }
    return data as object
  }

}
