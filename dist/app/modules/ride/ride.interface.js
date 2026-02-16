"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideStatus = exports.VEHICLE_TYPE = void 0;
var VEHICLE_TYPE;
(function (VEHICLE_TYPE) {
    VEHICLE_TYPE["CAR"] = "CAR";
    VEHICLE_TYPE["BIKE"] = "BIKE";
})(VEHICLE_TYPE || (exports.VEHICLE_TYPE = VEHICLE_TYPE = {}));
var RideStatus;
(function (RideStatus) {
    RideStatus["REQUESTED"] = "REQUESTED";
    RideStatus["ACCEPTED"] = "ACCEPTED";
    RideStatus["REJECTED"] = "REJECTED";
    RideStatus["PICKED_UP"] = "PICKED_UP";
    RideStatus["IN_TRANSIT"] = "IN_TRANSIT";
    RideStatus["COMPLETED"] = "COMPLETED";
    RideStatus["CANCELLED"] = "CANCELLED";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
