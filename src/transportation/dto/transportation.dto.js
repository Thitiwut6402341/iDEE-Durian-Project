// "use strict";
// var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
//     function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
//     var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
//     var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
//     var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
//     var _, done = false;
//     for (var i = decorators.length - 1; i >= 0; i--) {
//         var context = {};
//         for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
//         for (var p in contextIn.access) context.access[p] = contextIn.access[p];
//         context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
//         var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
//         if (kind === "accessor") {
//             if (result === void 0) continue;
//             if (result === null || typeof result !== "object") throw new TypeError("Object expected");
//             if (_ = accept(result.get)) descriptor.get = _;
//             if (_ = accept(result.set)) descriptor.set = _;
//             if (_ = accept(result.init)) initializers.unshift(_);
//         }
//         else if (_ = accept(result)) {
//             if (kind === "field") initializers.unshift(_);
//             else descriptor[key] = _;
//         }
//     }
//     if (target) Object.defineProperty(target, contextIn.name, descriptor);
//     done = true;
// };
// var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
//     var useValue = arguments.length > 2;
//     for (var i = 0; i < initializers.length; i++) {
//         value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
//     }
//     return useValue ? value : void 0;
// };
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.TransportationDto = void 0;
// var class_validator_1 = require("class-validator");
// var TransportationDto = function () {
//     var _a;
//     var _fruit_code_decorators;
//     var _fruit_code_initializers = [];
//     var _fruit_code_extraInitializers = [];
//     var _delivery_name_decorators;
//     var _delivery_name_initializers = [];
//     var _delivery_name_extraInitializers = [];
//     var _license_plate_decorators;
//     var _license_plate_initializers = [];
//     var _license_plate_extraInitializers = [];
//     var _delivery_code_decorators;
//     var _delivery_code_initializers = [];
//     var _delivery_code_extraInitializers = [];
//     var _origin_decorators;
//     var _origin_initializers = [];
//     var _origin_extraInitializers = [];
//     var _destination_decorators;
//     var _destination_initializers = [];
//     var _destination_extraInitializers = [];
//     var _depart_date_decorators;
//     var _depart_date_initializers = [];
//     var _depart_date_extraInitializers = [];
//     var _departure_type_decorators;
//     var _departure_type_initializers = [];
//     var _departure_type_extraInitializers = [];
//     return _a = /** @class */ (function () {
//         function TransportationDto() {
//             this.fruit_code = __runInitializers(this, _fruit_code_initializers, void 0);
//             this.delivery_name = (__runInitializers(this, _fruit_code_extraInitializers), __runInitializers(this, _delivery_name_initializers, void 0));
//             this.license_plate = (__runInitializers(this, _delivery_name_extraInitializers), __runInitializers(this, _license_plate_initializers, void 0));
//             this.delivery_code = (__runInitializers(this, _license_plate_extraInitializers), __runInitializers(this, _delivery_code_initializers, void 0));
//             this.origin = (__runInitializers(this, _delivery_code_extraInitializers), __runInitializers(this, _origin_initializers, void 0));
//             this.destination = (__runInitializers(this, _origin_extraInitializers), __runInitializers(this, _destination_initializers, void 0));
//             this.depart_date = (__runInitializers(this, _destination_extraInitializers), __runInitializers(this, _depart_date_initializers, void 0));
//             this.departure_type = (__runInitializers(this, _depart_date_extraInitializers), __runInitializers(this, _departure_type_initializers, void 0));
//             this.airline = __runInitializers(this, _departure_type_extraInitializers);
//         }
//         return TransportationDto;
//     }()),
//         (function () {
//             var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
//             _fruit_code_decorators = [(0, class_validator_1.IsArray)()];
//             _delivery_name_decorators = [(0, class_validator_1.IsString)()];
//             _license_plate_decorators = [(0, class_validator_1.IsString)()];
//             _delivery_code_decorators = [(0, class_validator_1.IsString)()];
//             _origin_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
//             _destination_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsIn)(['Nong Khai train station', 'Don Mueang International Airport', 'Suvarnabhumi Airport'], { message: 'destination must be either Nong Khai train station, Don Mueang International Airport, or Suvarnabhumi Airport' })];
//             _depart_date_decorators = [(0, class_validator_1.IsString)()];
//             _departure_type_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsIn)(['plane', 'train'], { message: 'departure_type must be either plane or train' })];
//             __esDecorate(null, null, _fruit_code_decorators, { kind: "field", name: "fruit_code", static: false, private: false, access: { has: function (obj) { return "fruit_code" in obj; }, get: function (obj) { return obj.fruit_code; }, set: function (obj, value) { obj.fruit_code = value; } }, metadata: _metadata }, _fruit_code_initializers, _fruit_code_extraInitializers);
//             __esDecorate(null, null, _delivery_name_decorators, { kind: "field", name: "delivery_name", static: false, private: false, access: { has: function (obj) { return "delivery_name" in obj; }, get: function (obj) { return obj.delivery_name; }, set: function (obj, value) { obj.delivery_name = value; } }, metadata: _metadata }, _delivery_name_initializers, _delivery_name_extraInitializers);
//             __esDecorate(null, null, _license_plate_decorators, { kind: "field", name: "license_plate", static: false, private: false, access: { has: function (obj) { return "license_plate" in obj; }, get: function (obj) { return obj.license_plate; }, set: function (obj, value) { obj.license_plate = value; } }, metadata: _metadata }, _license_plate_initializers, _license_plate_extraInitializers);
//             __esDecorate(null, null, _delivery_code_decorators, { kind: "field", name: "delivery_code", static: false, private: false, access: { has: function (obj) { return "delivery_code" in obj; }, get: function (obj) { return obj.delivery_code; }, set: function (obj, value) { obj.delivery_code = value; } }, metadata: _metadata }, _delivery_code_initializers, _delivery_code_extraInitializers);
//             __esDecorate(null, null, _origin_decorators, { kind: "field", name: "origin", static: false, private: false, access: { has: function (obj) { return "origin" in obj; }, get: function (obj) { return obj.origin; }, set: function (obj, value) { obj.origin = value; } }, metadata: _metadata }, _origin_initializers, _origin_extraInitializers);
//             __esDecorate(null, null, _destination_decorators, { kind: "field", name: "destination", static: false, private: false, access: { has: function (obj) { return "destination" in obj; }, get: function (obj) { return obj.destination; }, set: function (obj, value) { obj.destination = value; } }, metadata: _metadata }, _destination_initializers, _destination_extraInitializers);
//             __esDecorate(null, null, _depart_date_decorators, { kind: "field", name: "depart_date", static: false, private: false, access: { has: function (obj) { return "depart_date" in obj; }, get: function (obj) { return obj.depart_date; }, set: function (obj, value) { obj.depart_date = value; } }, metadata: _metadata }, _depart_date_initializers, _depart_date_extraInitializers);
//             __esDecorate(null, null, _departure_type_decorators, { kind: "field", name: "departure_type", static: false, private: false, access: { has: function (obj) { return "departure_type" in obj; }, get: function (obj) { return obj.departure_type; }, set: function (obj, value) { obj.departure_type = value; } }, metadata: _metadata }, _departure_type_initializers, _departure_type_extraInitializers);
//             if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
//         })(),
//         _a;
// }();
// exports.TransportationDto = TransportationDto;
