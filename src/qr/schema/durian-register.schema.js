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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DurianRegisterSchema = exports.DurianRegister = void 0;
var mongoose_1 = require("@nestjs/mongoose");
var DurianRegister = function () {
    var _classDecorators = [(0, mongoose_1.Schema)({ collection: 'DurianRegistration', versionKey: false })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _tree_code_decorators;
    var _tree_code_initializers = [];
    var _tree_code_extraInitializers = [];
    var _fruit_code_decorators;
    var _fruit_code_initializers = [];
    var _fruit_code_extraInitializers = [];
    var _weight_decorators;
    var _weight_initializers = [];
    var _weight_extraInitializers = [];
    var _number_of_segments_decorators;
    var _number_of_segments_initializers = [];
    var _number_of_segments_extraInitializers = [];
    var _ripeness_decorators;
    var _ripeness_initializers = [];
    var _ripeness_extraInitializers = [];
    var _method_decorators;
    var _method_initializers = [];
    var _method_extraInitializers = [];
    var _grade_decorators;
    var _grade_initializers = [];
    var _grade_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    var DurianRegister = _classThis = /** @class */ (function () {
        function DurianRegister_1() {
            this.tree_code = __runInitializers(this, _tree_code_initializers, void 0);
            this.fruit_code = (__runInitializers(this, _tree_code_extraInitializers), __runInitializers(this, _fruit_code_initializers, void 0));
            this.weight = (__runInitializers(this, _fruit_code_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
            this.number_of_segments = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _number_of_segments_initializers, void 0));
            this.ripeness = (__runInitializers(this, _number_of_segments_extraInitializers), __runInitializers(this, _ripeness_initializers, void 0));
            this.method = (__runInitializers(this, _ripeness_extraInitializers), __runInitializers(this, _method_initializers, void 0));
            this.grade = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _grade_initializers, void 0));
            this.status = (__runInitializers(this, _grade_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.created_at = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
            __runInitializers(this, _updated_at_extraInitializers);
        }
        return DurianRegister_1;
    }());
    __setFunctionName(_classThis, "DurianRegister");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _tree_code_decorators = [(0, mongoose_1.Prop)({ nullable: false })];
        _fruit_code_decorators = [(0, mongoose_1.Prop)({ nullable: false })];
        _weight_decorators = [(0, mongoose_1.Prop)({ nullable: true })];
        _number_of_segments_decorators = [(0, mongoose_1.Prop)({ nullable: true })];
        _ripeness_decorators = [(0, mongoose_1.Prop)({ nullable: true })];
        _method_decorators = [(0, mongoose_1.Prop)({ nullable: true })];
        _grade_decorators = [(0, mongoose_1.Prop)({ nullable: true })];
        _status_decorators = [(0, mongoose_1.Prop)({ nullable: true })];
        _created_at_decorators = [(0, mongoose_1.Prop)()];
        _updated_at_decorators = [(0, mongoose_1.Prop)()];
        __esDecorate(null, null, _tree_code_decorators, { kind: "field", name: "tree_code", static: false, private: false, access: { has: function (obj) { return "tree_code" in obj; }, get: function (obj) { return obj.tree_code; }, set: function (obj, value) { obj.tree_code = value; } }, metadata: _metadata }, _tree_code_initializers, _tree_code_extraInitializers);
        __esDecorate(null, null, _fruit_code_decorators, { kind: "field", name: "fruit_code", static: false, private: false, access: { has: function (obj) { return "fruit_code" in obj; }, get: function (obj) { return obj.fruit_code; }, set: function (obj, value) { obj.fruit_code = value; } }, metadata: _metadata }, _fruit_code_initializers, _fruit_code_extraInitializers);
        __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: function (obj) { return "weight" in obj; }, get: function (obj) { return obj.weight; }, set: function (obj, value) { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
        __esDecorate(null, null, _number_of_segments_decorators, { kind: "field", name: "number_of_segments", static: false, private: false, access: { has: function (obj) { return "number_of_segments" in obj; }, get: function (obj) { return obj.number_of_segments; }, set: function (obj, value) { obj.number_of_segments = value; } }, metadata: _metadata }, _number_of_segments_initializers, _number_of_segments_extraInitializers);
        __esDecorate(null, null, _ripeness_decorators, { kind: "field", name: "ripeness", static: false, private: false, access: { has: function (obj) { return "ripeness" in obj; }, get: function (obj) { return obj.ripeness; }, set: function (obj, value) { obj.ripeness = value; } }, metadata: _metadata }, _ripeness_initializers, _ripeness_extraInitializers);
        __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: function (obj) { return "method" in obj; }, get: function (obj) { return obj.method; }, set: function (obj, value) { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
        __esDecorate(null, null, _grade_decorators, { kind: "field", name: "grade", static: false, private: false, access: { has: function (obj) { return "grade" in obj; }, get: function (obj) { return obj.grade; }, set: function (obj, value) { obj.grade = value; } }, metadata: _metadata }, _grade_initializers, _grade_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DurianRegister = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DurianRegister = _classThis;
}();
exports.DurianRegister = DurianRegister;
exports.DurianRegisterSchema = mongoose_1.SchemaFactory.createForClass(DurianRegister);
