"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliHttpRequest = void 0;
const tslib_1 = require("tslib");
const raw_body_1 = (0, tslib_1.__importDefault)(require("raw-body"));
const form_1 = (0, tslib_1.__importDefault)(require("body/form"));
const source_1 = require("./source");
class AliHttpRequest extends source_1.AliSource {
    constructor(raw) {
        super();
        this.raw = raw;
    }
    getUrl() {
        return this.raw.url;
    }
    getPath() {
        return this.raw.path;
    }
    getMethod() {
        return this.raw.method;
    }
    getQueries() {
        return this.raw.queries;
    }
    getHeaders() {
        return this.raw.headers;
    }
    getClientIp() {
        return this.raw.clientIP;
    }
    getBodyByForm() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                (0, form_1.default)(this.raw, function (err, formBody) {
                    resolve(formBody);
                });
            });
        });
    }
    getBodyByJson() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const string = yield this.getBodyByString();
            return JSON.parse(string);
        });
    }
    getBodyByString() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const buffer = yield this.getBodyByBuffer();
            return buffer.toString();
        });
    }
    getBodyByBuffer() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                (0, raw_body_1.default)(this.raw, function (err, data) {
                    resolve(data);
                });
            });
        });
    }
}
exports.AliHttpRequest = AliHttpRequest;
