"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AliConnector = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const framework_1 = require("@embassy/framework");
const interface_1 = require("@embassy/interface");
const adv_err_1 = require("adv-err");
const context_1 = require("./context");
const logger_1 = require("./logger");
const request_1 = require("./request");
const _1 = require(".");
class AliConnector {
    constructor() {
        this.makeAsyncHandler = (inner) => (...args) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const callback = args.pop();
            try {
                // it doesn't recognize `pop()` :(
                const result = yield inner(...args);
                callback(null, result);
            }
            catch (e) {
                if (e instanceof interface_1.ReturnedError) {
                    // unpack error return
                    callback(e.wrapped, null);
                    return;
                }
                // error throw directly
                throw e;
            }
        });
        this.makeBufferHandler = (inner) => this.makeAsyncHandler(function (buffer, ctx) {
            return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                const logger = new logger_1.AliLogger(ctx.logger);
                const context = new context_1.AliContext(ctx);
                yield (0, framework_1.initContext)({ context, logger });
                const result = yield (0, adv_err_1.catchError)(() => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                    return yield inner(buffer, context);
                }), { logFailure: (e) => ctx.logger.error(e), throwServerError: true });
                if (result && result.errCode > 0) {
                    throw new interface_1.ReturnedError(result);
                }
                return result;
            });
        });
        this.makeStringHandler = (inner) => this.makeBufferHandler(function (buffer, ctx) {
            return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                const event = buffer.toString();
                yield (0, framework_1.mergeContext)({ event });
                return yield inner(event, ctx);
            });
        });
        this.makeJsonHandler = (inner) => this.makeStringHandler(function (str, ctx) {
            return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                const event = JSON.parse(str);
                yield (0, framework_1.mergeContext)({ event });
                return yield inner(event, ctx);
            });
        });
        this.makeHttpHandler = (inner) => ((req, res, ctx) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const request = new request_1.AliHttpRequest(req);
            const response = new _1.AliHttpResponse(res);
            const context = new context_1.AliContext(ctx);
            const logger = new logger_1.AliLogger(ctx.logger);
            yield (0, framework_1.initContext)({ context, logger });
            const result = yield (0, adv_err_1.catchError)(() => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
                return yield inner(request, response, context);
            }), { logFailure: (e) => ctx.logger.error(e), throwServerError: true });
            if (result) {
                // if (result.errCode > 0) {
                //   const code = String(result.errCode)
                //   // 可显示错误
                //   if (code.startsWith("1")) {
                //     // * 1：未分类错误
                //     response.setStatusCode(500)
                //   } else if (code.startsWith("2")) {
                //     // * 2：请求错误
                //     response.setStatusCode(400)
                //   } else if (code.startsWith("3")) {
                //     // * 3：外部系统错误
                //     response.setStatusCode(500)
                //   } else if (code.startsWith("4")) {
                //     // * 4：找不到资源
                //     response.setStatusCode(404)
                //   } else if (code.startsWith("5")) {
                //     // * 5：权限错误
                //     response.setStatusCode(403)
                //   } else if (code.startsWith("6")) {
                //     // * 6：服务器错误（内部未知错误）
                //     response.setStatusCode(500)
                //   }
                // }
                response.send(result);
            }
            else {
                response.send();
            }
        }));
        this.makeHttpJsonHandler = (inner) => this.makeHttpHandler((req, res, ctx) => (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const json = yield req.getBodyByJson();
            const result = yield inner(json, ctx);
        }));
    }
}
exports.AliConnector = AliConnector;
