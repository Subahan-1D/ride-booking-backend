"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRideZodSchema = void 0;
// ride.validation.ts
const zod_1 = require("zod");
const ride_interface_1 = require("./ride.interface");
const coordinatesSchema = zod_1.z
    .tuple([zod_1.z.number(), zod_1.z.number()]) // [lat, lng]
    .refine(([lat, lng]) => lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180, {
    message: "Invalid coordinates",
});
const rideLocationSchema = zod_1.z.object({
    type: zod_1.z.literal("Point"),
    coordinates: coordinatesSchema,
    name: zod_1.z.string().min(1, "Location name is required"),
});
exports.createRideZodSchema = zod_1.z.object({
    pickupLocation: rideLocationSchema,
    destinationLocation: rideLocationSchema,
    vehicleType: zod_1.z.enum(Object.values(ride_interface_1.VEHICLE_TYPE)),
});
