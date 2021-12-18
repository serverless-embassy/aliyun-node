"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliContext = void 0;
const source_1 = require("./source");
const logger_1 = require("./logger");
class AliContext extends source_1.AliSource {
    constructor(raw) {
        super();
        this.raw = raw;
    }
    getRequestId() {
        return this.raw.requestId;
    }
    getLogger() {
        return new logger_1.AliLogger(this.raw.logger);
    }
}
exports.AliContext = AliContext;
