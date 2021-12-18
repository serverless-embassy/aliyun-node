import { ILogger } from '@embassy/interface';
import { FC } from '@winry/fc2';
import { AliSource } from './source';

export class AliLogger extends AliSource implements ILogger {
  raw: FC.ILogger;

  constructor(raw: FC.ILogger) {
    super();
    this.raw = raw;
  }

  debug(...args: unknown[]): void {
    this.raw.debug(...args);
  }

  info(...args: unknown[]): void {
    this.raw.info(...args);
  }

  log(...args: unknown[]): void {
    this.raw.verbose(...args);
  }

  warn(...args: unknown[]): void {
    this.raw.warn(...args);
  }

  error(...args: unknown[]): void {
    this.raw.error(...args);
  }
}
