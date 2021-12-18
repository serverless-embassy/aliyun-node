/// <reference types="node" />
import { IConnector, IContext, IHttpRequest, IHttpResponse, TDefaultResult } from '@embassy/interface';
import { FC } from '@winry/fc2';
declare type TCombineArr<TArr1 extends any[], TArr2 extends any[]> = [...arr1: TArr1, ...arr2: TArr2];
export declare class AliConnector implements IConnector<FC.TEventHandler, FC.THttpHandler> {
    makeAsyncHandler: <TArgs extends any[] = any[], TResult = any>(inner: (...args: TArgs) => Promise<TResult>) => (...args: [...TArgs, FC.TCallback<any>]) => Promise<void>;
    makeBufferHandler: <TResult = TDefaultResult>(inner: (event: Buffer, context: IContext) => Promise<TResult>) => FC.TEventHandler;
    makeStringHandler: <TResult = any>(inner: (event: string, context: IContext) => Promise<TResult>) => FC.TEventHandler;
    makeJsonHandler: <TEvent extends object = object, TResult = any>(inner: (event: TEvent, context: IContext) => Promise<TResult>) => FC.TEventHandler;
    makeHttpHandler: <TResult = void>(inner: (request: IHttpRequest, response: IHttpResponse, context: IContext) => Promise<TResult>) => FC.THttpHandler;
    makeHttpJsonHandler: <TEvent extends object = object, TResult = void>(inner: (event: TEvent, context: IContext) => Promise<TResult>) => FC.THttpHandler;
}
export {};
