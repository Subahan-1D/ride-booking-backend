"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
// ride.service.ts
const mongoose_1 = require("mongoose");
const calculateFare_1 = require("../../utils/calculateFare");
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = require("./ride.model");
const calculateDistanceInKm_1 = require("../../utils/calculateDistanceInKm");
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const rideStatus_1 = require("./rideStatus");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const ride_constant_1 = require("./ride.constant");
const driver_interface_1 = require("../driver/driver.interface");
const driver_model_1 = require("../driver/driver.model");
const cancelledRideToday_1 = require("../../utils/cancelledRideToday");
const requestRide = async (payload, userId) => {
    const user = await user_model_1.User.findById(userId);
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    // ⛔ Block if rider already has an active ride
    const existingRide = await ride_model_1.Ride.findOne({
        riderId: userId,
        status: { $in: rideStatus_1.ACTIVE_RIDE_STATUSES },
    });
    if (existingRide) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `You already have an active ride (${existingRide.status}). Please complete or cancel it before requesting a new one.`);
    }
    const { pickupLocation, destinationLocation, vehicleType } = payload;
    if (!pickupLocation?.coordinates || !pickupLocation?.name)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Pickup location required with name");
    if (!destinationLocation?.coordinates || !destinationLocation?.name)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Destination location required with name");
    if (!vehicleType)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Vehicle type required");
    // Normalize and validate vehicle type from request
    const normalizedVehicleType = String(vehicleType).toUpperCase();
    if (!Object.values(ride_interface_1.VEHICLE_TYPE).includes(normalizedVehicleType)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Invalid vehicle type '${vehicleType}'. Allowed: ${Object.values(ride_interface_1.VEHICLE_TYPE).join(", ")}`);
    }
    // Correct GeoJSON order [lng, lat]
    const pickup = {
        type: "Point",
        coordinates: [pickupLocation.coordinates[1], pickupLocation.coordinates[0]],
        name: pickupLocation.name,
    };
    const destination = {
        type: "Point",
        coordinates: [
            destinationLocation.coordinates[1],
            destinationLocation.coordinates[0],
        ],
        name: destinationLocation.name,
    };
    const distance = (0, calculateDistanceInKm_1.calculateDistanceInKm)(pickup.coordinates[1], pickup.coordinates[0], destination.coordinates[1], destination.coordinates[0]);
    const fare = (0, calculateFare_1.calculateFare)({
        distanceInKm: distance,
        vehicleType: normalizedVehicleType,
    });
    const ride = new ride_model_1.Ride({
        riderId: new mongoose_1.Types.ObjectId(userId),
        pickupLocation: pickup,
        destinationLocation: destination,
        distance,
        fare,
        vehicleType: normalizedVehicleType,
        status: ride_interface_1.RideStatus.REQUESTED,
        timestamps: { requestedAt: new Date() },
    });
    await ride.save();
    return ride;
};
const getAllRides = async (userId, query) => {
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const queryBuilder = new QueryBuilder_1.QueryBuilder(ride_model_1.Ride.find(), query);
    const ridesQuery = queryBuilder
        .search(ride_constant_1.rideSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        ridesQuery.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
};
const updateRideStatus = async (userId, rideId, newStatus) => {
    const session = await ride_model_1.Ride.startSession();
    try {
        session.startTransaction();
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        const ride = await ride_model_1.Ride.findById(rideId);
        if (!ride) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
        }
        const driver = await driver_model_1.Driver.findOne({ userId });
        if (!driver) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver profile not found");
        }
        // Reject based on driver status
        if ([
            driver_interface_1.DRIVER_STATUS.PENDING,
            driver_interface_1.DRIVER_STATUS.REJECTED,
            driver_interface_1.DRIVER_STATUS.SUSPEND,
        ].includes(driver.status)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Your driver status is '${driver.status}', you cannot update rides`);
        }
        if (driver.availability === driver_interface_1.AVAILABILITY.UNAVAILABLE) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are currently offline");
        }
        // ✅ Vehicle type check
        if (driver.vehicleType !== ride.vehicleType) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Vehicle type mismatch. You are registered with '${driver.vehicleType}', but this ride requires '${ride.vehicleType}'.`);
        }
        // ✅ Prevent driver from accepting multiple active rides
        if (newStatus === ride_interface_1.RideStatus.ACCEPTED) {
            const alreadyActiveRide = await ride_model_1.Ride.findOne({
                driverId: userId,
                status: { $in: rideStatus_1.ACTIVE_RIDE_STATUSES },
            });
            if (alreadyActiveRide) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already have an active ride");
            }
        }
        if (newStatus === ride_interface_1.RideStatus.CANCELLED) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Drivers cannot cancel rides");
        }
        if (ride.status === ride_interface_1.RideStatus.CANCELLED) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride has already been cancelled");
        }
        // ⛔ Prevent invalid transitions
        const allowedNextStatuses = rideStatus_1.rideStatusFlow[ride.status];
        // if (!allowedNextStatuses.includes(newStatus)) {
        //   throw new AppError(
        //     httpStatus.BAD_REQUEST,
        //     `Invalid ride status transition from '${ride.status}' to '${newStatus}'`
        //   );
        // }
        if (!allowedNextStatuses.includes(newStatus)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Invalid ride status transition from '${ride.status}' to '${newStatus}'.\n` +
                `Ride status must follow this flow:\n${(0, rideStatus_1.getFullRideStatusFlow)()}`);
        }
        // ⛔ Only assigned driver can update ride after acceptance
        if (ride.driverId &&
            ride.driverId.toString() !== userId &&
            [
                ride_interface_1.RideStatus.ACCEPTED,
                ride_interface_1.RideStatus.PICKED_UP,
                ride_interface_1.RideStatus.IN_TRANSIT,
            ].includes(ride.status)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not assigned to this ride");
        }
        // Timestamp mapping
        const now = new Date();
        const timestampFieldMap = {
            [ride_interface_1.RideStatus.ACCEPTED]: "acceptedAt",
            [ride_interface_1.RideStatus.REJECTED]: "rejectedAt",
            [ride_interface_1.RideStatus.PICKED_UP]: "pickedUpAt",
            [ride_interface_1.RideStatus.IN_TRANSIT]: "in_transit",
            [ride_interface_1.RideStatus.COMPLETED]: "completedAt",
            [ride_interface_1.RideStatus.CANCELLED]: "cancelledAt",
            [ride_interface_1.RideStatus.REQUESTED]: "requestedAt", // unlikely to be set here
        };
        const updateData = {
            status: newStatus,
            timestamps: {
                ...ride.timestamps,
                [timestampFieldMap[newStatus]]: now,
            },
        };
        // ✅ Assign driver on first accept
        if (!ride.driverId && newStatus === ride_interface_1.RideStatus.ACCEPTED) {
            updateData.driverId = new mongoose_1.Types.ObjectId(userId);
        }
        // ✅ Add fare to earnings on completion
        if (newStatus === ride_interface_1.RideStatus.COMPLETED && ride.fare && driver) {
            await driver_model_1.Driver.updateOne({ userId }, { $inc: { earnings: ride.fare } }, { session });
        }
        const updatedRide = await ride_model_1.Ride.findByIdAndUpdate(rideId, updateData, {
            new: true,
            session,
        });
        await session.commitTransaction();
        session.endSession();
        return updatedRide;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const cancelRide = async (userId, rideId, cancelStatus) => {
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const ride = await ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    if (ride.riderId.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to cancel this ride");
    }
    if ([
        ride_interface_1.RideStatus.ACCEPTED,
        ride_interface_1.RideStatus.COMPLETED,
        ride_interface_1.RideStatus.PICKED_UP,
        ride_interface_1.RideStatus.REJECTED,
        ride_interface_1.RideStatus.IN_TRANSIT,
    ].includes(ride.status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot cancel ride because its status is '${ride.status}'`);
    }
    if (ride.status === ride_interface_1.RideStatus.CANCELLED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride is already cancelled");
    }
    const todaysCancelledCount = await (0, cancelledRideToday_1.cancelledRideToday)(userId);
    if (todaysCancelledCount >= 3) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You cannot cancel more than 3 rides per day");
    }
    // ✅ Apply cancellation
    ride.status = cancelStatus;
    ride.timestamps.cancelledAt = new Date();
    await ride.save();
    return ride;
};
const rideHistory = async (userId) => {
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // Fetch all rides for the rider across all statuses
    const rides = await ride_model_1.Ride.find({
        riderId: userId,
    }).sort({ "timestamps.requestedAt": -1 });
    return rides;
};
const getRideById = async (userId, rideId) => {
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const ride = await ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    if (ride.riderId.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to view this ride");
    }
    return ride;
};
const viewEarningHistory = async (userId) => {
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const driver = await driver_model_1.Driver.findOne({ userId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    const completedRides = await ride_model_1.Ride.find({
        driverId: userId,
        status: ride_interface_1.RideStatus.COMPLETED,
    }).sort({ "timestamps.completedAt": -1 }); // Most recent first
    const totalEarnings = completedRides.reduce((acc, ride) => acc + (ride.fare || 0), 0);
    return {
        totalRides: completedRides.length,
        totalEarnings,
        rides: completedRides,
    };
};
exports.RideService = {
    requestRide,
    getAllRides,
    updateRideStatus,
    cancelRide,
    rideHistory,
    getRideById,
    viewEarningHistory,
};
