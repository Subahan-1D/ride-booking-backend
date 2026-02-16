"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const ride_service_1 = require("./ride.service");
// const requestRide = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const rideData = req.body;
//     const user = req.user as JwtPayload;
//     const result = await RideService.requestRide(rideData, user.userId);
//     sendResponse(res, {
//       statusCode: httpStatus.CREATED,
//       success: true,
//       message: "Your ride request was successful",
//       data: result,
//     });
//   }
// );
const requestRide = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const rideData = req.body;
    const result = await ride_service_1.RideService.requestRide(rideData, user.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Ride requested successfully",
        data: result,
    });
});
const getAllRides = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const query = req.query;
    const decodedToken = req.user;
    const result = await ride_service_1.RideService.getAllRides(decodedToken.userId, query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All Ride has been retrieve successfully",
        data: result.data,
        meta: result.meta,
    });
});
const updateRideStatus = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { rideStatus } = req.body;
    const { rideId } = req.params;
    const decodedToken = req.user;
    const result = await ride_service_1.RideService.updateRideStatus(decodedToken.userId, rideId, rideStatus);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `Ride status has been updated to '${result?.status}' successfully`,
        data: result,
    });
});
const cancelRide = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const { rideStatus } = req.body;
    const { rideId } = req.params;
    const decodedToken = req.user;
    const result = await ride_service_1.RideService.cancelRide(decodedToken.userId, rideId, rideStatus);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Your ride has been cancelled successfully",
        data: result,
    });
});
const rideHistory = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodedToken = req.user;
    const result = await ride_service_1.RideService.rideHistory(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Ride history retrieved successfully",
        data: result,
    });
});
const viewEarningHistory = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    const decodedToken = req.user;
    const result = await ride_service_1.RideService.viewEarningHistory(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver Earning History has been retrieve successfully",
        data: result,
    });
});
const getRideById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const decodedToken = req.user;
    const { rideId } = req.params;
    const result = await ride_service_1.RideService.getRideById(decodedToken.userId, rideId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Ride retrieved successfully",
        data: result,
    });
});
exports.RideController = {
    requestRide,
    getAllRides,
    updateRideStatus,
    cancelRide,
    rideHistory,
    getRideById,
    viewEarningHistory,
};
