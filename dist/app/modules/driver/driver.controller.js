"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_service_1 = require("./driver.service");
const applyForDriver = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decoded = req.user;
    const result = await driver_service_1.DriverService.applyForDriver(req.body, decoded);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Your application was successfully sent",
        data: result,
    });
});
const updateDriver = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { driverId } = req.params;
    const { driverStatus } = req.body; // ✅ FIX: use driverStatus not status
    const result = await driver_service_1.DriverService.updateDriver(driverId, driverStatus);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `Driver status updated to ${driverStatus}`,
        data: result,
    });
});
const updateAvailability = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = req.user;
    const { availability } = req.body;
    const result = await driver_service_1.DriverService.updateAvailability(user, availability);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver availability updated successfully",
        data: result,
    });
});
const getMyDriverProfile = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = req.user;
    const result = await driver_service_1.DriverService.getMyDriverProfile(user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver profile fetched successfully",
        data: result,
    });
});
const updateMyDriverProfile = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = req.user;
    const payload = req.body;
    const result = await driver_service_1.DriverService.updateMyDriverProfile(user, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver profile updated successfully",
        data: result,
    });
});
const getAllDriverApplication = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = req.user;
    const query = req.query;
    const result = await driver_service_1.DriverService.getAllDriverApplication(user.userId, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver applications fetched successfully",
        data: result,
    });
});
const getDriverRideHistory = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const user = req.user;
    const query = req.query;
    const result = await driver_service_1.DriverService.getDriverRideHistory(user, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver ride history fetched successfully",
        data: result,
    });
});
exports.DriverController = {
    applyForDriver,
    getAllDriverApplication,
    updateDriver,
    updateAvailability,
    getMyDriverProfile,
    updateMyDriverProfile,
    getDriverRideHistory,
};
