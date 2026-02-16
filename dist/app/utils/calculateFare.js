"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFare = void 0;
// utils/calculateFare.ts
const ride_interface_1 = require("../modules/ride/ride.interface");
const calculateFare = ({ distanceInKm, vehicleType, }) => {
    let baseFare = 0;
    let ratePerKm = 0;
    switch (vehicleType) {
        case ride_interface_1.VEHICLE_TYPE.CAR:
            baseFare = 50;
            ratePerKm = 30;
            break;
        case ride_interface_1.VEHICLE_TYPE.BIKE:
            baseFare = 30;
            ratePerKm = 15;
            break;
        default:
            baseFare = 50;
            ratePerKm = 30;
    }
    return Math.round(baseFare + ratePerKm * distanceInKm);
};
exports.calculateFare = calculateFare;
