"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMyDriverProfileZodSchema = exports.updateAvailabilityZodSchema = exports.updateDriverApplicationZodSchema = exports.driverApplicationZodSchema = void 0;
// driver.validation.ts
const zod_1 = __importDefault(require("zod"));
const driver_interface_1 = require("./driver.interface");
const ride_interface_1 = require("../ride/ride.interface");
exports.driverApplicationZodSchema = zod_1.default.object({
    vehicleType: zod_1.default.string({ required_error: "Vehicle type is required" }),
    vehicleModel: zod_1.default.string({ required_error: "Vehicle model is required" }),
    licenseNumber: zod_1.default.string({ required_error: "License number is required" }),
    vehicleNumber: zod_1.default.string({ required_error: "Vehicle number is required" }),
});
exports.updateDriverApplicationZodSchema = zod_1.default.object({
    driverStatus: zod_1.default.nativeEnum(driver_interface_1.DRIVER_STATUS, {
        required_error: "Driver status is required",
        invalid_type_error: "Invalid driver status",
    }),
});
exports.updateAvailabilityZodSchema = zod_1.default.object({
    availability: zod_1.default.nativeEnum(driver_interface_1.AVAILABILITY, {
        required_error: "Availability status is required",
        invalid_type_error: "Invalid availability value",
    }),
});
exports.updateMyDriverProfileZodSchema = zod_1.default.object({
    vehicleType: zod_1.default.nativeEnum(ride_interface_1.VEHICLE_TYPE).optional(),
    vehicleModel: zod_1.default.string().min(1).optional(),
    vehicleNumber: zod_1.default.string().min(1).optional(),
    licenseNumber: zod_1.default.string().min(1).optional(),
    availability: zod_1.default.nativeEnum(driver_interface_1.AVAILABILITY).optional(),
});
