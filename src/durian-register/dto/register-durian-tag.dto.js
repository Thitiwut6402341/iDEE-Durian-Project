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
exports.RegisterDurianTagDto = void 0;
var class_validator_1 = require("class-validator");
var RegisterDurianTagDto = function () {
    var _a;
    var _province_name_decorators;
    var _province_name_initializers = [];
    var _province_name_extraInitializers = [];
    var _number_of_tag_decorators;
    var _number_of_tag_initializers = [];
    var _number_of_tag_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterDurianTagDto() {
                this.province_name = __runInitializers(this, _province_name_initializers, void 0);
                this.number_of_tag = (__runInitializers(this, _province_name_extraInitializers), __runInitializers(this, _number_of_tag_initializers, void 0));
                __runInitializers(this, _number_of_tag_extraInitializers);
            }
            return RegisterDurianTagDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _province_name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _number_of_tag_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _province_name_decorators, { kind: "field", name: "province_name", static: false, private: false, access: { has: function (obj) { return "province_name" in obj; }, get: function (obj) { return obj.province_name; }, set: function (obj, value) { obj.province_name = value; } }, metadata: _metadata }, _province_name_initializers, _province_name_extraInitializers);
            __esDecorate(null, null, _number_of_tag_decorators, { kind: "field", name: "number_of_tag", static: false, private: false, access: { has: function (obj) { return "number_of_tag" in obj; }, get: function (obj) { return obj.number_of_tag; }, set: function (obj, value) { obj.number_of_tag = value; } }, metadata: _metadata }, _number_of_tag_initializers, _number_of_tag_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterDurianTagDto = RegisterDurianTagDto;
