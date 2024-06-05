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
exports.CreateOrchardRegisterDto = void 0;
var class_validator_1 = require("class-validator");
var CreateOrchardRegisterDto = function () {
    var _a;
    var _orchard_name_decorators;
    var _orchard_name_initializers = [];
    var _orchard_name_extraInitializers = [];
    var _province_decorators;
    var _province_initializers = [];
    var _province_extraInitializers = [];
    var _district_decorators;
    var _district_initializers = [];
    var _district_extraInitializers = [];
    var _sub_district_decorators;
    var _sub_district_initializers = [];
    var _sub_district_extraInitializers = [];
    var _zip_code_decorators;
    var _zip_code_initializers = [];
    var _zip_code_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _total_trees_decorators;
    var _total_trees_initializers = [];
    var _total_trees_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateOrchardRegisterDto() {
                this.orchard_name = __runInitializers(this, _orchard_name_initializers, void 0);
                this.province = (__runInitializers(this, _orchard_name_extraInitializers), __runInitializers(this, _province_initializers, void 0));
                this.district = (__runInitializers(this, _province_extraInitializers), __runInitializers(this, _district_initializers, void 0));
                this.sub_district = (__runInitializers(this, _district_extraInitializers), __runInitializers(this, _sub_district_initializers, void 0));
                this.zip_code = (__runInitializers(this, _sub_district_extraInitializers), __runInitializers(this, _zip_code_initializers, void 0));
                this.address = (__runInitializers(this, _zip_code_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.total_trees = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _total_trees_initializers, void 0));
                __runInitializers(this, _total_trees_extraInitializers);
            }
            return CreateOrchardRegisterDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orchard_name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _province_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _district_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _sub_district_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _zip_code_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _address_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _total_trees_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _orchard_name_decorators, { kind: "field", name: "orchard_name", static: false, private: false, access: { has: function (obj) { return "orchard_name" in obj; }, get: function (obj) { return obj.orchard_name; }, set: function (obj, value) { obj.orchard_name = value; } }, metadata: _metadata }, _orchard_name_initializers, _orchard_name_extraInitializers);
            __esDecorate(null, null, _province_decorators, { kind: "field", name: "province", static: false, private: false, access: { has: function (obj) { return "province" in obj; }, get: function (obj) { return obj.province; }, set: function (obj, value) { obj.province = value; } }, metadata: _metadata }, _province_initializers, _province_extraInitializers);
            __esDecorate(null, null, _district_decorators, { kind: "field", name: "district", static: false, private: false, access: { has: function (obj) { return "district" in obj; }, get: function (obj) { return obj.district; }, set: function (obj, value) { obj.district = value; } }, metadata: _metadata }, _district_initializers, _district_extraInitializers);
            __esDecorate(null, null, _sub_district_decorators, { kind: "field", name: "sub_district", static: false, private: false, access: { has: function (obj) { return "sub_district" in obj; }, get: function (obj) { return obj.sub_district; }, set: function (obj, value) { obj.sub_district = value; } }, metadata: _metadata }, _sub_district_initializers, _sub_district_extraInitializers);
            __esDecorate(null, null, _zip_code_decorators, { kind: "field", name: "zip_code", static: false, private: false, access: { has: function (obj) { return "zip_code" in obj; }, get: function (obj) { return obj.zip_code; }, set: function (obj, value) { obj.zip_code = value; } }, metadata: _metadata }, _zip_code_initializers, _zip_code_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _total_trees_decorators, { kind: "field", name: "total_trees", static: false, private: false, access: { has: function (obj) { return "total_trees" in obj; }, get: function (obj) { return obj.total_trees; }, set: function (obj, value) { obj.total_trees = value; } }, metadata: _metadata }, _total_trees_initializers, _total_trees_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateOrchardRegisterDto = CreateOrchardRegisterDto;
