/* eslint-disable @typescript-eslint/no-explicit-any */
import { initContext, mergeContext } from '@embassy/framework';
import { IConnector, IContext, IHttpRequest, IHttpResponse, ReturnedError, TDefaultResult } from '@embassy/interface';
import { BaseError, catchError, TCatchErrorConfig } from 'adv-err';
import { FC } from '@winry/fc2';
import { AliContext } from './context';
import { AliLogger } from './logger';
import { AliHttpRequest } from './request';
import { AliHttpResponse } from '.';

type TCombineArr<TArr1 extends any[], TArr2 extends any[]> = [...arr1: TArr1, ...arr2: TArr2];

export const parseErrorLog = (err: any) => {
  if (typeof err === 'string') {
    return err;
  }
  if (err instanceof BaseError) {
    return err.toJSON({ withStack: true, withData: true });
  }
  if (err instanceof Error) {
    err = { errType: err.name, errMsg: err.message, stack: err.stack };
  }
  return JSON.stringify(err);
};

export type TBaseHandlerConfig = {
  catchOptions?: TCatchErrorConfig;
};

export class AliConnector implements IConnector<FC.TEventHandler, FC.THttpHandler> {
  debug = false;
  constructor({ debug }: { debug?: boolean } = {}) {
    this.debug = debug ?? this.debug;
  }

  makeAsyncHandler =
    <TArgs extends any[] = any[], TResult = any>(inner: (...args: TArgs) => Promise<TResult>) =>
    async (...args: TCombineArr<TArgs, [FC.TCallback]>) => {
      const callback = args.pop() as FC.TCallback;
      try {
        // it doesn't recognize `pop()` :(
        const result = await inner(...(args as unknown as TArgs));
        callback(null, result);
      } catch (e) {
        if (e instanceof ReturnedError) {
          // unpack error return
          callback(e.wrapped as any, null);
          return;
        }
        // error throw directly
        throw e;
      }
    };

  makeBufferHandler = <TResult = TDefaultResult>(
    inner: (event: Buffer, context: IContext) => Promise<TResult>,
    { catchOptions = {} }: TBaseHandlerConfig = {},
  ) =>
    this.makeAsyncHandler(async (buffer, ctx) => {
      const logger = new AliLogger(ctx.logger);
      const context = new AliContext(ctx);
      await initContext({ context, logger });
      const result = await catchError(
        async () => {
          return await inner(buffer, context);
        },
        {
          logUncaught: (e) => ctx.logger.error(parseErrorLog(e)),
          throwServerError: this.debug,
          ...catchOptions,
        },
      );
      if (result && result.errCode > 0) {
        throw new ReturnedError(result);
      }
      return result;
    }) as FC.TEventHandler;

  makeStringHandler = <TResult = any>(
    inner: (event: string, context: IContext) => Promise<TResult>,
    options: TBaseHandlerConfig = {},
  ) =>
    this.makeBufferHandler(async (buffer, ctx) => {
      const event = buffer.toString();
      await mergeContext({ event });
      return await inner(event, ctx);
    }, options) as FC.TEventHandler;

  makeJsonHandler = <TEvent extends object = object, TResult = any>(
    inner: (event: TEvent, context: IContext) => Promise<TResult>,
    options: TBaseHandlerConfig = {},
  ) =>
    this.makeStringHandler(async (str, ctx) => {
      const event = JSON.parse(str) as any;
      await mergeContext({ event });
      return await inner(event, ctx);
    }, options) as FC.TEventHandler;

  makeHttpHandler = <TResult = void>(
    inner: (request: IHttpRequest, response: IHttpResponse, context: IContext) => Promise<TResult>,
  ) =>
    (async (req, res, ctx) => {
      const request = new AliHttpRequest(req);
      const response = new AliHttpResponse(res);
      const context = new AliContext(ctx);
      const logger = new AliLogger(ctx.logger);
      await initContext({ context, logger });

      const result = await catchError(
        async () => {
          return await inner(request, response, context);
        },
        { logFailure: (e) => ctx.logger.error(e), throwServerError: true },
      );
      if (result) {
        // if (result.errCode > 0) {
        //   const code = String(result.errCode)
        //   // 可显示错误
        //   if (code.startsWith("1")) {
        //     // * 1：未分类错误
        //     response.setStatusCode(500)
        //   } else if (code.startsWith("2")) {
        //     // * 2：请求错误
        //     response.setStatusCode(400)
        //   } else if (code.startsWith("3")) {
        //     // * 3：外部系统错误
        //     response.setStatusCode(500)
        //   } else if (code.startsWith("4")) {
        //     // * 4：找不到资源
        //     response.setStatusCode(404)
        //   } else if (code.startsWith("5")) {
        //     // * 5：权限错误
        //     response.setStatusCode(403)
        //   } else if (code.startsWith("6")) {
        //     // * 6：服务器错误（内部未知错误）
        //     response.setStatusCode(500)
        //   }
        // }
        response.send(result);
      } else {
        response.send();
      }
    }) as FC.THttpHandler;

  makeHttpJsonHandler = <TEvent extends object = object, TResult = void>(
    inner: (event: TEvent, context: IContext) => Promise<TResult>,
  ) =>
    this.makeHttpHandler(async (req, res, ctx) => {
      const json = await req.getBodyByJson();
      const result = await inner(json as TEvent, ctx);
    }) as FC.THttpHandler;
}
