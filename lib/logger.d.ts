import { ILogger } from '@embassy/interface';
import { FC } from '@winry/fc2';
import { AliSource } from './source';
export declare class AliLogger extends AliSource implements ILogger {
    raw: FC.ILogger;
    constructor(raw: FC.ILogger);
    debug(...args: unknown[]): void;
    info(...args: unknown[]): void;
    log(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
}
