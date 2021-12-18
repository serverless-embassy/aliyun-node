"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliLogger = void 0;
const source_1 = require("./source");
class AliLogger extends source_1.AliSource {
    constructor(raw) {
        super();
        this.raw = raw;
    }
    debug(...args) {
        this.raw.debug(...args);
    }
    info(...args) {
        this.raw.info(...args);
    }
    log(...args) {
        this.raw.verbose(...args);
    }
    warn(...args) {
        this.raw.warn(...args);
    }
    error(...args) {
        this.raw.error(...args);
    }
}
exports.AliLogger = AliLogger;
