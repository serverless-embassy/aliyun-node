import { ISource } from '@embassy/interface/lib/source';

export const ALIYUN_SOURCE_TEXT = 'aliyun';

export class AliSource implements ISource {
  source = ALIYUN_SOURCE_TEXT;
  getSource(): string {
    return this.source;
  }
}
