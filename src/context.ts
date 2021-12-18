import { IContext, ILogger } from '@embassy/interface';
import { FC } from '@winry/fc2';
import { AliSource } from './source';
import { AliLogger } from './logger';

export class AliContext extends AliSource implements IContext {
  raw: FC.TContext;

  constructor(raw: FC.TContext) {
    super();
    this.raw = raw;
  }
  getRequestId(): string {
    return this.raw.requestId;
  }
  getLogger(): ILogger {
    return new AliLogger(this.raw.logger);
  }
}
