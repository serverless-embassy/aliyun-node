"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliHttpResponse = void 0;
const source_1 = require("./source");
class AliHttpResponse extends source_1.AliSource {
    constructor(raw) {
        super();
        this.raw = raw;
    }
    delHeader(key) {
        this.raw.deleteHeader(key);
        return this;
    }
    setStatusCode(code) {
        this.raw.setStatusCode(code);
        return this;
    }
    setHeader(key, value) {
        this.raw.setHeader(key, value);
        return this;
    }
    send(body) {
        this.raw.send(body);
        return this;
    }
}
exports.AliHttpResponse = AliHttpResponse;
