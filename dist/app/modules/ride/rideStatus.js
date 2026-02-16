"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullRideStatusFlow = exports.rideStatusFlow = exports.ACTIVE_RIDE_STATUSES = void 0;
// rideStatus.ts
const ride_interface_1 = require("./ride.interface");
exports.ACTIVE_RIDE_STATUSES = [
    ride_interface_1.RideStatus.REQUESTED,
    ride_interface_1.RideStatus.ACCEPTED,
    ride_interface_1.RideStatus.PICKED_UP,
    ride_interface_1.RideStatus.IN_TRANSIT,
];
exports.rideStatusFlow = {
    [ride_interface_1.RideStatus.REQUESTED]: [ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.REJECTED],
    [ride_interface_1.RideStatus.ACCEPTED]: [ride_interface_1.RideStatus.PICKED_UP],
    [ride_interface_1.RideStatus.PICKED_UP]: [ride_interface_1.RideStatus.IN_TRANSIT],
    [ride_interface_1.RideStatus.IN_TRANSIT]: [ride_interface_1.RideStatus.COMPLETED],
    [ride_interface_1.RideStatus.COMPLETED]: [],
    [ride_interface_1.RideStatus.REJECTED]: [],
    [ride_interface_1.RideStatus.CANCELLED]: [],
};
const getFullRideStatusFlow = () => {
    const flow = [];
    let current = ride_interface_1.RideStatus.REQUESTED;
    const visited = new Set();
    while (current && !visited.has(current)) {
        flow.push(current);
        visited.add(current);
        current = exports.rideStatusFlow[current]?.[0]; // Only follow the primary path
    }
    return flow.join(" → ");
};
exports.getFullRideStatusFlow = getFullRideStatusFlow;
