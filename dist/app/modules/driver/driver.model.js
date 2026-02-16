"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
// driver.model.ts
const mongoose_1 = require("mongoose");
const driver_interface_1 = require("./driver.interface");
const ride_interface_1 = require("../ride/ride.interface");
const driverSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    vehicleType: {
        type: String,
        enum: Object.values(ride_interface_1.VEHICLE_TYPE),
        required: true,
    },
    vehicleModel: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(driver_interface_1.DRIVER_STATUS),
        default: driver_interface_1.DRIVER_STATUS.PENDING,
    },
    availability: {
        type: String,
        enum: Object.values(driver_interface_1.AVAILABILITY),
        default: driver_interface_1.AVAILABILITY.UNAVAILABLE,
    },
    appliedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    earnings: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
