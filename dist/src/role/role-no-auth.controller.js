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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleNoAuthController = void 0;
const common_1 = require("@nestjs/common");
const role_service_1 = require("./role.service");
const create_role_dto_1 = require("./dto/create-role.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
let RoleNoAuthController = class RoleNoAuthController {
    roleService;
    constructor(roleService) {
        this.roleService = roleService;
    }
    create(createRoleDto) {
        console.log("Create Role DTO (no auth):", createRoleDto);
        return this.roleService.create(createRoleDto);
    }
    findAll() {
        return this.roleService.findAll();
    }
    findByDepartment(id) {
        return this.roleService.findByDepartment(id);
    }
    findOne(id) {
        return this.roleService.findOne(id);
    }
    update(id, updateRoleDto) {
        return this.roleService.update(id, updateRoleDto);
    }
    remove(id) {
        return this.roleService.remove(id);
    }
    addPermission(id, permissionId) {
        return this.roleService.addPermission(id, permissionId);
    }
    removePermission(id, permissionId) {
        return this.roleService.removePermission(id, permissionId);
    }
};
exports.RoleNoAuthController = RoleNoAuthController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", void 0)
], RoleNoAuthController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoleNoAuthController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('department/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoleNoAuthController.prototype, "findByDepartment", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoleNoAuthController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", void 0)
], RoleNoAuthController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RoleNoAuthController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/permissions/:permissionId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('permissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RoleNoAuthController.prototype, "addPermission", null);
__decorate([
    (0, common_1.Delete)(':id/permissions/:permissionId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('permissionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RoleNoAuthController.prototype, "removePermission", null);
exports.RoleNoAuthController = RoleNoAuthController = __decorate([
    (0, common_1.Controller)('roles-no-auth'),
    __metadata("design:paramtypes", [role_service_1.RoleService])
], RoleNoAuthController);
//# sourceMappingURL=role-no-auth.controller.js.map