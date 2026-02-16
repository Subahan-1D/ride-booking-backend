"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
// // ride.model.ts
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const rideLocationSchema = new mongoose_1.Schema({
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
    name: { type: String, required: true },
}, { _id: false });
const rideSchema = new mongoose_1.Schema({
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    pickupLocation: { type: rideLocationSchema, required: true },
    destinationLocation: { type: rideLocationSchema, required: true },
    fare: { type: Number, required: true, min: 0 },
    distance: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(ride_interface_1.RideStatus),
        default: ride_interface_1.RideStatus.REQUESTED,
    },
    vehicleType: {
        type: String,
        enum: Object.values(ride_interface_1.VEHICLE_TYPE),
        required: true,
    },
    cancellationReason: { type: String },
    timestamps: {
        requestedAt: { type: Date },
        acceptedAt: { type: Date },
        rejectedAt: { type: Date },
        pickedUpAt: { type: Date },
        in_transit: { type: Date },
        completedAt: { type: Date },
        cancelledAt: { type: Date },
    },
}, { timestamps: true, versionKey: false });
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
