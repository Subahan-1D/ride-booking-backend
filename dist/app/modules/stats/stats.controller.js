"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const stats_service_1 = require("./stats.service");
const sendResponse_1 = require("../../utils/sendResponse");
const getPublicHomepageStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const stats = await stats_service_1.StatsService.getPublicHomepageStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Public homepage stats fetched successfully",
        data: stats,
    });
});
const getRideStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const stats = await stats_service_1.StatsService.getRideStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Ride stats fetched successfully",
        data: stats,
    });
});
const getUserStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const stats = await stats_service_1.StatsService.getUserStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});
const getDriverStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const stats = await stats_service_1.StatsService.getDriverStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Driver stats fetched successfully",
        data: stats,
    });
});
const getRevenueStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const stats = await stats_service_1.StatsService.getRevenueStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Revenue stats fetched successfully",
        data: stats,
    });
});
const getDashboardStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const stats = await stats_service_1.StatsService.getDashboardStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Dashboard stats fetched successfully",
        data: stats,
    });
});
exports.StatsController = {
    getPublicHomepageStats,
    getRideStats,
    getUserStats,
    getDriverStats,
    getRevenueStats,
    getDashboardStats,
};
