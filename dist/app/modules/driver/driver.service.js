"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const user_interface_1 = require("../user/user.interface");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const driver_model_1 = require("./driver.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const driver_interface_1 = require("./driver.interface");
const QueryBuilder_1 = require("./../../utils/QueryBuilder");
const driver_constant_1 = require("./driver.constant");
const mongoose_1 = __importDefault(require("mongoose"));
const ride_model_1 = require("../ride/ride.model");
const applyForDriver = async (payload, decodedToken) => {
    if (decodedToken.role !== user_interface_1.Role.RIDER) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to apply for driver");
    }
    const isUserExist = await user_model_1.User.findById(decodedToken.userId);
    // checking is user exist or not
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    // checking authorized user or not
    if (isUserExist._id.toString() !== decodedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You're not authorized to perform this action");
    }
    // checking address provided or not
    if (!isUserExist.address) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please update your address before applying as a driver.");
    }
    // checking user already submit a driver application
    const isApplicationExist = await driver_model_1.Driver.findOne({
        driver: decodedToken.userId,
    });
    if (isApplicationExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already submitted a driver application");
    }
    // checking user already are in driver role
    if (isUserExist.role === user_interface_1.Role.DRIVER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already registered as driver");
    }
    // create new driver application
    const driver = await driver_model_1.Driver.create({
        ...payload,
        userId: decodedToken.userId,
        status: driver_interface_1.DRIVER_STATUS.PENDING,
        availability: driver_interface_1.AVAILABILITY.UNAVAILABLE,
        appliedAt: new Date(),
    });
    return driver;
};
const getAllDriverApplication = async (userId, query) => {
    const isUserExist = user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const queryBuilder = new QueryBuilder_1.QueryBuilder(driver_model_1.Driver.find(), query);
    const driverApplication = await queryBuilder
        .search(driver_constant_1.driverSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = await Promise.all([
        driverApplication.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
};
const updateDriver = async (driverId, driverStatus) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const driver = await driver_model_1.Driver.findById(driverId).session(session);
        if (!driver) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver application not found");
        }
        if (driver.status === driverStatus) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Already ${driverStatus}`);
        }
        driver.status = driverStatus;
        if (driverStatus === driver_interface_1.DRIVER_STATUS.APPROVED) {
            driver.approvedAt = new Date();
            // ✅ Update the user's role to DRIVER
            await user_model_1.User.findByIdAndUpdate(driver.userId, { role: user_interface_1.Role.DRIVER }, { session });
        }
        await driver.save({ session });
        await session.commitTransaction();
        session.endSession();
        return driver;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const updateAvailability = async (user, availability) => {
    if (![
        driver_interface_1.AVAILABILITY.AVAILABLE,
        driver_interface_1.AVAILABILITY.UNAVAILABLE,
        driver_interface_1.AVAILABILITY.ON_TRIP,
    ].includes(availability)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid availability change");
    }
    const driver = await driver_model_1.Driver.findOne({ userId: user.userId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    if (driver.status !== driver_interface_1.DRIVER_STATUS.APPROVED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Only approved drivers can update availability");
    }
    driver.availability = availability;
    await driver.save();
    return driver;
};
const getMyDriverProfile = async (user) => {
    const driver = await driver_model_1.Driver.findOne({ userId: user.userId }).populate("userId");
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not found");
    }
    return driver;
};
const updateMyDriverProfile = async (user, payload) => {
    const driver = await driver_model_1.Driver.findOne({ userId: user.userId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not found");
    }
    if (payload.vehicleType)
        driver.vehicleType = payload.vehicleType;
    if (payload.vehicleModel)
        driver.vehicleModel = payload.vehicleModel;
    if (payload.vehicleNumber)
        driver.vehicleNumber = payload.vehicleNumber;
    if (payload.licenseNumber)
        driver.licenseNumber = payload.licenseNumber;
    if (payload.availability) {
        if (!Object.values(driver_interface_1.AVAILABILITY).includes(payload.availability)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid availability value");
        }
        driver.availability = payload.availability;
    }
    await driver.save();
    return driver;
};
const getDriverRideHistory = async (user, query) => {
    // First verify the driver exists and is approved
    const driver = await driver_model_1.Driver.findOne({ userId: user.userId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not found");
    }
    if (driver.status !== driver_interface_1.DRIVER_STATUS.APPROVED) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only approved drivers can view ride history");
    }
    // Create base query for rides where this driver was assigned
    const baseQuery = { driverId: user.userId };
    // Apply search filter if searchTerm is provided
    let searchQuery = { ...baseQuery };
    if (query.searchTerm) {
        searchQuery = {
            ...baseQuery,
            $or: [
                { "pickupLocation.name": { $regex: query.searchTerm, $options: "i" } },
                {
                    "destinationLocation.name": {
                        $regex: query.searchTerm,
                        $options: "i",
                    },
                },
                { status: { $regex: query.searchTerm, $options: "i" } },
            ],
        };
    }
    // Apply additional filters from query parameters
    const filterQuery = { ...searchQuery };
    if (query.status) {
        filterQuery.status = query.status;
    }
    if (query.vehicleType) {
        filterQuery.vehicleType = query.vehicleType;
    }
    // Create query builder for rides where this driver was assigned
    const rideQuery = ride_model_1.Ride.find(filterQuery)
        .populate("riderId", "name email phone")
        .sort({ createdAt: -1 });
    const queryBuilder = new QueryBuilder_1.QueryBuilder(rideQuery, query);
    // Apply search, filter, sort, and pagination
    const result = await queryBuilder
        .search(["pickupLocation.name", "destinationLocation.name", "status"])
        .filter()
        .sort()
        .fields()
        .paginate();
    // Get total count for the specific driver's rides with applied filters
    const totalDocuments = await ride_model_1.Ride.countDocuments(filterQuery);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const totalPage = Math.ceil(totalDocuments / limit);
    const meta = {
        page,
        limit,
        total: totalDocuments,
        totalPage,
    };
    const data = await result.build();
    return {
        data,
        meta,
    };
};
exports.DriverService = {
    applyForDriver,
    getAllDriverApplication,
    updateDriver,
    updateAvailability,
    getMyDriverProfile,
    updateMyDriverProfile,
    getDriverRideHistory,
};
