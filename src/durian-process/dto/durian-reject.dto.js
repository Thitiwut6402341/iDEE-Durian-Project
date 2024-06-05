"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DurianRejectDto = void 0;
var class_validator_1 = require("class-validator");
var DurianRejectDto = function () {
    var _a;
    var _fruit_code_decorators;
    var _fruit_code_initializers = [];
    var _fruit_code_extraInitializers = [];
    var _reject_reason_decorators;
    var _reject_reason_initializers = [];
    var _reject_reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DurianRejectDto() {
                this.fruit_code = __runInitializers(this, _fruit_code_initializers, void 0);
                this.reject_reason = (__runInitializers(this, _fruit_code_extraInitializers), __runInitializers(this, _reject_reason_initializers, void 0));
                __runInitializers(this, _reject_reason_extraInitializers);
            }
            return DurianRejectDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fruit_code_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _reject_reason_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _fruit_code_decorators, { kind: "field", name: "fruit_code", static: false, private: false, access: { has: function (obj) { return "fruit_code" in obj; }, get: function (obj) { return obj.fruit_code; }, set: function (obj, value) { obj.fruit_code = value; } }, metadata: _metadata }, _fruit_code_initializers, _fruit_code_extraInitializers);
            __esDecorate(null, null, _reject_reason_decorators, { kind: "field", name: "reject_reason", static: false, private: false, access: { has: function (obj) { return "reject_reason" in obj; }, get: function (obj) { return obj.reject_reason; }, set: function (obj, value) { obj.reject_reason = value; } }, metadata: _metadata }, _reject_reason_initializers, _reject_reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DurianRejectDto = DurianRejectDto;
