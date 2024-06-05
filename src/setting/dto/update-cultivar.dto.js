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
exports.UpdateCultivarDto = void 0;
var class_validator_1 = require("class-validator");
var UpdateCultivarDto = function () {
    var _a;
    var _cultivar_id_decorators;
    var _cultivar_id_initializers = [];
    var _cultivar_id_extraInitializers = [];
    var _cultivar_th_decorators;
    var _cultivar_th_initializers = [];
    var _cultivar_th_extraInitializers = [];
    var _cultivar_en_decorators;
    var _cultivar_en_initializers = [];
    var _cultivar_en_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateCultivarDto() {
                this.cultivar_id = __runInitializers(this, _cultivar_id_initializers, void 0);
                this.cultivar_th = (__runInitializers(this, _cultivar_id_extraInitializers), __runInitializers(this, _cultivar_th_initializers, void 0));
                this.cultivar_en = (__runInitializers(this, _cultivar_th_extraInitializers), __runInitializers(this, _cultivar_en_initializers, void 0));
                this.description = (__runInitializers(this, _cultivar_en_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
            return UpdateCultivarDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _cultivar_id_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsMongoId)(), (0, class_validator_1.IsNotEmpty)()];
            _cultivar_th_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _cultivar_en_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _cultivar_id_decorators, { kind: "field", name: "cultivar_id", static: false, private: false, access: { has: function (obj) { return "cultivar_id" in obj; }, get: function (obj) { return obj.cultivar_id; }, set: function (obj, value) { obj.cultivar_id = value; } }, metadata: _metadata }, _cultivar_id_initializers, _cultivar_id_extraInitializers);
            __esDecorate(null, null, _cultivar_th_decorators, { kind: "field", name: "cultivar_th", static: false, private: false, access: { has: function (obj) { return "cultivar_th" in obj; }, get: function (obj) { return obj.cultivar_th; }, set: function (obj, value) { obj.cultivar_th = value; } }, metadata: _metadata }, _cultivar_th_initializers, _cultivar_th_extraInitializers);
            __esDecorate(null, null, _cultivar_en_decorators, { kind: "field", name: "cultivar_en", static: false, private: false, access: { has: function (obj) { return "cultivar_en" in obj; }, get: function (obj) { return obj.cultivar_en; }, set: function (obj, value) { obj.cultivar_en = value; } }, metadata: _metadata }, _cultivar_en_initializers, _cultivar_en_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateCultivarDto = UpdateCultivarDto;
