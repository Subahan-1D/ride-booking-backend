"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelledRideToday = void 0;
// utils/cancelledRideToday.ts
const ride_interface_1 = require("../modules/ride/ride.interface");
const ride_model_1 = require("../modules/ride/ride.model");
const cancelledRideToday = async (userId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const cancelledCount = await ride_model_1.Ride.countDocuments({
        riderId: userId,
        status: ride_interface_1.RideStatus.CANCELLED,
        "timestamps.cancelledAt": { $gte: startOfDay, $lte: endOfDay },
    });
    return cancelledCount;
};
exports.cancelledRideToday = cancelledRideToday;
