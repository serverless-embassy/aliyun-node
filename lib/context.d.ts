import { IContext, ILogger } from '@embassy/interface';
import { FC } from '@winry/fc2';
import { AliSource } from './source';
export declare class AliContext extends AliSource implements IContext {
    raw: FC.TContext;
    constructor(raw: FC.TContext);
    getRequestId(): string;
    getLogger(): ILogger;
}
