"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrMokupSchema = exports.QrMokup = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var mongoose_2 = require("mongoose");
var QrMokup = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'ShowCustomer', versionKey: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = mongoose_2.Document;
    var _fruit_code_decorators;
    var _fruit_code_initializers = [];
    var _fruit_code_extraInitializers = [];
    var _repiness_decorators;
    var _repiness_initializers = [];
    var _repiness_extraInitializers = [];
    var _is_passed_decorators;
    var _is_passed_initializers = [];
    var _is_passed_extraInitializers = [];
    var _registered_at_decorators;
    var _registered_at_initializers = [];
    var _registered_at_extraInitializers = [];
    var _duration_ripeness_decorators;
    var _duration_ripeness_initializers = [];
    var _duration_ripeness_extraInitializers = [];
    var _province_name_en_decorators;
    var _province_name_en_initializers = [];
    var _province_name_en_extraInitializers = [];
    var _cultivar_decorators;
    var _cultivar_initializers = [];
    var _cultivar_extraInitializers = [];
    var _timestamp_departure_decorators;
    var _timestamp_departure_initializers = [];
    var _timestamp_departure_extraInitializers = [];
    var _timestamp_arrived_decorators;
    var _timestamp_arrived_initializers = [];
    var _timestamp_arrived_extraInitializers = [];
    var _timestamp_packing_decorators;
    var _timestamp_packing_initializers = [];
    var _timestamp_packing_extraInitializers = [];
    var _timestamp_quality_decorators;
    var _timestamp_quality_initializers = [];
    var _timestamp_quality_extraInitializers = [];
    var _status_quality_decorators;
    var _status_quality_initializers = [];
    var _status_quality_extraInitializers = [];
    var _status_packing_decorators;
    var _status_packing_initializers = [];
    var _status_packing_extraInitializers = [];
    var _status_arrived_decorators;
    var _status_arrived_initializers = [];
    var _status_arrived_extraInitializers = [];
    var _status_departure_decorators;
    var _status_departure_initializers = [];
    var _status_departure_extraInitializers = [];
    var _best_before_decorators;
    var _best_before_initializers = [];
    var _best_before_extraInitializers = [];
    var _status_picking_decorators;
    var _status_picking_initializers = [];
    var _status_picking_extraInitializers = [];
    var _timestamp_picking_decorators;
    var _timestamp_picking_initializers = [];
    var _timestamp_picking_extraInitializers = [];
    var _current_level_decorators;
    var _current_level_initializers = [];
    var _current_level_extraInitializers = [];
    var _levels_decorators;
    var _levels_initializers = [];
    var _levels_extraInitializers = [];
    var QrMokup = _classThis = /** @class */ (function (_super) {
        __extends(QrMokup_1, _super);
        function QrMokup_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.fruit_code = __runInitializers(_this, _fruit_code_initializers, void 0);
            _this.repiness = (__runInitializers(_this, _fruit_code_extraInitializers), __runInitializers(_this, _repiness_initializers, void 0));
            _this.is_passed = (__runInitializers(_this, _repiness_extraInitializers), __runInitializers(_this, _is_passed_initializers, void 0));
            _this.registered_at = (__runInitializers(_this, _is_passed_extraInitializers), __runInitializers(_this, _registered_at_initializers, void 0));
            _this.duration_ripeness = (__runInitializers(_this, _registered_at_extraInitializers), __runInitializers(_this, _duration_ripeness_initializers, void 0));
            _this.province_name_en = (__runInitializers(_this, _duration_ripeness_extraInitializers), __runInitializers(_this, _province_name_en_initializers, void 0));
            _this.cultivar = (__runInitializers(_this, _province_name_en_extraInitializers), __runInitializers(_this, _cultivar_initializers, void 0));
            _this.timestamp_departure = (__runInitializers(_this, _cultivar_extraInitializers), __runInitializers(_this, _timestamp_departure_initializers, void 0));
            _this.timestamp_arrived = (__runInitializers(_this, _timestamp_departure_extraInitializers), __runInitializers(_this, _timestamp_arrived_initializers, void 0));
            _this.timestamp_packing = (__runInitializers(_this, _timestamp_arrived_extraInitializers), __runInitializers(_this, _timestamp_packing_initializers, void 0));
            _this.timestamp_quality = (__runInitializers(_this, _timestamp_packing_extraInitializers), __runInitializers(_this, _timestamp_quality_initializers, void 0));
            _this.status_quality = (__runInitializers(_this, _timestamp_quality_extraInitializers), __runInitializers(_this, _status_quality_initializers, void 0));
            _this.status_packing = (__runInitializers(_this, _status_quality_extraInitializers), __runInitializers(_this, _status_packing_initializers, void 0));
            _this.status_arrived = (__runInitializers(_this, _status_packing_extraInitializers), __runInitializers(_this, _status_arrived_initializers, void 0));
            _this.status_departure = (__runInitializers(_this, _status_arrived_extraInitializers), __runInitializers(_this, _status_departure_initializers, void 0));
            _this.best_before = (__runInitializers(_this, _status_departure_extraInitializers), __runInitializers(_this, _best_before_initializers, void 0));
            _this.status_picking = (__runInitializers(_this, _best_before_extraInitializers), __runInitializers(_this, _status_picking_initializers, void 0));
            _this.timestamp_picking = (__runInitializers(_this, _status_picking_extraInitializers), __runInitializers(_this, _timestamp_picking_initializers, void 0));
            _this.current_level = (__runInitializers(_this, _timestamp_picking_extraInitializers), __runInitializers(_this, _current_level_initializers, void 0));
            _this.levels = (__runInitializers(_this, _current_level_extraInitializers), __runInitializers(_this, _levels_initializers, void 0));
            __runInitializers(_this, _levels_extraInitializers);
            return _this;
        }
        return QrMokup_1;
    }(_classSuper));
    __setFunctionName(_classThis, "QrMokup");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _fruit_code_decorators = [(0, mongoose_1.Prop)()];
        _repiness_decorators = [(0, mongoose_1.Prop)()];
        _is_passed_decorators = [(0, mongoose_1.Prop)()];
        _registered_at_decorators = [(0, mongoose_1.Prop)()];
        _duration_ripeness_decorators = [(0, mongoose_1.Prop)()];
        _province_name_en_decorators = [(0, mongoose_1.Prop)()];
        _cultivar_decorators = [(0, mongoose_1.Prop)()];
        _timestamp_departure_decorators = [(0, mongoose_1.Prop)()];
        _timestamp_arrived_decorators = [(0, mongoose_1.Prop)()];
        _timestamp_packing_decorators = [(0, mongoose_1.Prop)()];
        _timestamp_quality_decorators = [(0, mongoose_1.Prop)()];
        _status_quality_decorators = [(0, mongoose_1.Prop)()];
        _status_packing_decorators = [(0, mongoose_1.Prop)()];
        _status_arrived_decorators = [(0, mongoose_1.Prop)()];
        _status_departure_decorators = [(0, mongoose_1.Prop)()];
        _best_before_decorators = [(0, mongoose_1.Prop)()];
        _status_picking_decorators = [(0, mongoose_1.Prop)()];
        _timestamp_picking_decorators = [(0, mongoose_1.Prop)()];
        _current_level_decorators = [(0, mongoose_1.Prop)()];
        _levels_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _fruit_code_decorators, { kind: "field", name: "fruit_code", static: false, private: false, access: { has: function (obj) { return "fruit_code" in obj; }, get: function (obj) { return obj.fruit_code; }, set: function (obj, value) { obj.fruit_code = value; } }, metadata: _metadata }, _fruit_code_initializers, _fruit_code_extraInitializers);
        __esDecorate(null, null, _repiness_decorators, { kind: "field", name: "repiness", static: false, private: false, access: { has: function (obj) { return "repiness" in obj; }, get: function (obj) { return obj.repiness; }, set: function (obj, value) { obj.repiness = value; } }, metadata: _metadata }, _repiness_initializers, _repiness_extraInitializers);
        __esDecorate(null, null, _is_passed_decorators, { kind: "field", name: "is_passed", static: false, private: false, access: { has: function (obj) { return "is_passed" in obj; }, get: function (obj) { return obj.is_passed; }, set: function (obj, value) { obj.is_passed = value; } }, metadata: _metadata }, _is_passed_initializers, _is_passed_extraInitializers);
        __esDecorate(null, null, _registered_at_decorators, { kind: "field", name: "registered_at", static: false, private: false, access: { has: function (obj) { return "registered_at" in obj; }, get: function (obj) { return obj.registered_at; }, set: function (obj, value) { obj.registered_at = value; } }, metadata: _metadata }, _registered_at_initializers, _registered_at_extraInitializers);
        __esDecorate(null, null, _duration_ripeness_decorators, { kind: "field", name: "duration_ripeness", static: false, private: false, access: { has: function (obj) { return "duration_ripeness" in obj; }, get: function (obj) { return obj.duration_ripeness; }, set: function (obj, value) { obj.duration_ripeness = value; } }, metadata: _metadata }, _duration_ripeness_initializers, _duration_ripeness_extraInitializers);
        __esDecorate(null, null, _province_name_en_decorators, { kind: "field", name: "province_name_en", static: false, private: false, access: { has: function (obj) { return "province_name_en" in obj; }, get: function (obj) { return obj.province_name_en; }, set: function (obj, value) { obj.province_name_en = value; } }, metadata: _metadata }, _province_name_en_initializers, _province_name_en_extraInitializers);
        __esDecorate(null, null, _cultivar_decorators, { kind: "field", name: "cultivar", static: false, private: false, access: { has: function (obj) { return "cultivar" in obj; }, get: function (obj) { return obj.cultivar; }, set: function (obj, value) { obj.cultivar = value; } }, metadata: _metadata }, _cultivar_initializers, _cultivar_extraInitializers);
        __esDecorate(null, null, _timestamp_departure_decorators, { kind: "field", name: "timestamp_departure", static: false, private: false, access: { has: function (obj) { return "timestamp_departure" in obj; }, get: function (obj) { return obj.timestamp_departure; }, set: function (obj, value) { obj.timestamp_departure = value; } }, metadata: _metadata }, _timestamp_departure_initializers, _timestamp_departure_extraInitializers);
        __esDecorate(null, null, _timestamp_arrived_decorators, { kind: "field", name: "timestamp_arrived", static: false, private: false, access: { has: function (obj) { return "timestamp_arrived" in obj; }, get: function (obj) { return obj.timestamp_arrived; }, set: function (obj, value) { obj.timestamp_arrived = value; } }, metadata: _metadata }, _timestamp_arrived_initializers, _timestamp_arrived_extraInitializers);
        __esDecorate(null, null, _timestamp_packing_decorators, { kind: "field", name: "timestamp_packing", static: false, private: false, access: { has: function (obj) { return "timestamp_packing" in obj; }, get: function (obj) { return obj.timestamp_packing; }, set: function (obj, value) { obj.timestamp_packing = value; } }, metadata: _metadata }, _timestamp_packing_initializers, _timestamp_packing_extraInitializers);
        __esDecorate(null, null, _timestamp_quality_decorators, { kind: "field", name: "timestamp_quality", static: false, private: false, access: { has: function (obj) { return "timestamp_quality" in obj; }, get: function (obj) { return obj.timestamp_quality; }, set: function (obj, value) { obj.timestamp_quality = value; } }, metadata: _metadata }, _timestamp_quality_initializers, _timestamp_quality_extraInitializers);
        __esDecorate(null, null, _status_quality_decorators, { kind: "field", name: "status_quality", static: false, private: false, access: { has: function (obj) { return "status_quality" in obj; }, get: function (obj) { return obj.status_quality; }, set: function (obj, value) { obj.status_quality = value; } }, metadata: _metadata }, _status_quality_initializers, _status_quality_extraInitializers);
        __esDecorate(null, null, _status_packing_decorators, { kind: "field", name: "status_packing", static: false, private: false, access: { has: function (obj) { return "status_packing" in obj; }, get: function (obj) { return obj.status_packing; }, set: function (obj, value) { obj.status_packing = value; } }, metadata: _metadata }, _status_packing_initializers, _status_packing_extraInitializers);
        __esDecorate(null, null, _status_arrived_decorators, { kind: "field", name: "status_arrived", static: false, private: false, access: { has: function (obj) { return "status_arrived" in obj; }, get: function (obj) { return obj.status_arrived; }, set: function (obj, value) { obj.status_arrived = value; } }, metadata: _metadata }, _status_arrived_initializers, _status_arrived_extraInitializers);
        __esDecorate(null, null, _status_departure_decorators, { kind: "field", name: "status_departure", static: false, private: false, access: { has: function (obj) { return "status_departure" in obj; }, get: function (obj) { return obj.status_departure; }, set: function (obj, value) { obj.status_departure = value; } }, metadata: _metadata }, _status_departure_initializers, _status_departure_extraInitializers);
        __esDecorate(null, null, _best_before_decorators, { kind: "field", name: "best_before", static: false, private: false, access: { has: function (obj) { return "best_before" in obj; }, get: function (obj) { return obj.best_before; }, set: function (obj, value) { obj.best_before = value; } }, metadata: _metadata }, _best_before_initializers, _best_before_extraInitializers);
        __esDecorate(null, null, _status_picking_decorators, { kind: "field", name: "status_picking", static: false, private: false, access: { has: function (obj) { return "status_picking" in obj; }, get: function (obj) { return obj.status_picking; }, set: function (obj, value) { obj.status_picking = value; } }, metadata: _metadata }, _status_picking_initializers, _status_picking_extraInitializers);
        __esDecorate(null, null, _timestamp_picking_decorators, { kind: "field", name: "timestamp_picking", static: false, private: false, access: { has: function (obj) { return "timestamp_picking" in obj; }, get: function (obj) { return obj.timestamp_picking; }, set: function (obj, value) { obj.timestamp_picking = value; } }, metadata: _metadata }, _timestamp_picking_initializers, _timestamp_picking_extraInitializers);
        __esDecorate(null, null, _current_level_decorators, { kind: "field", name: "current_level", static: false, private: false, access: { has: function (obj) { return "current_level" in obj; }, get: function (obj) { return obj.current_level; }, set: function (obj, value) { obj.current_level = value; } }, metadata: _metadata }, _current_level_initializers, _current_level_extraInitializers);
        __esDecorate(null, null, _levels_decorators, { kind: "field", name: "levels", static: false, private: false, access: { has: function (obj) { return "levels" in obj; }, get: function (obj) { return obj.levels; }, set: function (obj, value) { obj.levels = value; } }, metadata: _metadata }, _levels_initializers, _levels_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QrMokup = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QrMokup = _classThis;
}();
exports.QrMokup = QrMokup;
exports.QrMokupSchema = mongoose_1.SchemaFactory.createForClass(QrMokup);
