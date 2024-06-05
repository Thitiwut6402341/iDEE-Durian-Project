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
exports.RegisterTreeDto = void 0;
var class_validator_1 = require("class-validator");
var RegisterTreeDto = function () {
    var _a;
    var _orchard_code_decorators;
    var _orchard_code_initializers = [];
    var _orchard_code_extraInitializers = [];
    var _tree_number_decorators;
    var _tree_number_initializers = [];
    var _tree_number_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterTreeDto() {
                this.orchard_code = __runInitializers(this, _orchard_code_initializers, void 0);
                this.tree_number = (__runInitializers(this, _orchard_code_extraInitializers), __runInitializers(this, _tree_number_initializers, void 0));
                __runInitializers(this, _tree_number_extraInitializers);
            }
            return RegisterTreeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _orchard_code_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _tree_number_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _orchard_code_decorators, { kind: "field", name: "orchard_code", static: false, private: false, access: { has: function (obj) { return "orchard_code" in obj; }, get: function (obj) { return obj.orchard_code; }, set: function (obj, value) { obj.orchard_code = value; } }, metadata: _metadata }, _orchard_code_initializers, _orchard_code_extraInitializers);
            __esDecorate(null, null, _tree_number_decorators, { kind: "field", name: "tree_number", static: false, private: false, access: { has: function (obj) { return "tree_number" in obj; }, get: function (obj) { return obj.tree_number; }, set: function (obj, value) { obj.tree_number = value; } }, metadata: _metadata }, _tree_number_initializers, _tree_number_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterTreeDto = RegisterTreeDto;
