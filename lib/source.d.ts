import { ISource } from '@embassy/interface/lib/source';
export declare const ALIYUN_SOURCE_TEXT = "aliyun";
export declare class AliSource implements ISource {
    source: string;
    getSource(): string;
}
