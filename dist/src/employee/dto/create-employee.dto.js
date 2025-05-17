"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEmployeeDto = void 0;
const class_validator_1 = require("class-validator");
class CreateEmployeeDto {
    userId;
    departmentId;
    roleId;
    title;
}
exports.CreateEmployeeDto = CreateEmployeeDto;
__decorate([
    (0, class_validator_1.IsUUID)(4, { message: 'User ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'User ID is required' }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(4, { message: 'Department ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Department ID is required' }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "departmentId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(4, { message: 'Role ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Role ID is required' }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "roleId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Title must be a string' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(100, { message: 'Title must be at most 100 characters long' }),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "title", void 0);
//# sourceMappingURL=create-employee.dto.js.map