"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const ride_model_1 = require("../ride/ride.model");
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("../driver/driver.model");
const user_interface_1 = require("../user/user.interface");
const ride_interface_1 = require("../ride/ride.interface");
const driver_interface_1 = require("../driver/driver.interface");
const now = new Date();
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const currentYear = new Date(now.getFullYear(), 0, 1);
// Public, non-sensitive homepage stats (safe to expose without auth)
const getPublicHomepageStats = async () => {
    const [totalCompletedRides, totalApprovedDrivers, totalRiders, coverageLocationsCount, topPickupLocations,] = await Promise.all([
        ride_model_1.Ride.countDocuments({ status: ride_interface_1.RideStatus.COMPLETED }),
        driver_model_1.Driver.countDocuments({ status: driver_interface_1.DRIVER_STATUS.APPROVED }),
        user_model_1.User.countDocuments({ role: user_interface_1.Role.RIDER }),
        ride_model_1.Ride.distinct("pickupLocation.name").then((names) => names.length),
        ride_model_1.Ride.aggregate([
            { $group: { _id: "$pickupLocation.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]),
    ]);
    return {
        totalCompletedRides,
        totalApprovedDrivers,
        totalRiders,
        coverageLocationsCount,
        vehicleTypesOffered: Object.values(ride_interface_1.VEHICLE_TYPE),
        topPickupLocations,
    };
};
// Dashboard Stats - Overview of all key metrics
const getDashboardStats = async () => {
    const [totalUsers, totalRides, totalDrivers, totalRevenue, activeRides, completedRidesToday, newUsersThisWeek, newDriversThisWeek,] = await Promise.all([
        user_model_1.User.countDocuments(),
        ride_model_1.Ride.countDocuments(),
        driver_model_1.Driver.countDocuments(),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interface_1.RideStatus.COMPLETED } },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => result[0]?.total || 0),
        ride_model_1.Ride.countDocuments({
            status: {
                $in: [ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.PICKED_UP, ride_interface_1.RideStatus.IN_TRANSIT],
            },
        }),
        ride_model_1.Ride.countDocuments({
            status: ride_interface_1.RideStatus.COMPLETED,
            "timestamps.completedAt": {
                $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            },
        }),
        user_model_1.User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        driver_model_1.Driver.countDocuments({ appliedAt: { $gte: sevenDaysAgo } }),
    ]);
    return {
        overview: {
            totalUsers,
            totalRides,
            totalDrivers,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            activeRides,
            completedRidesToday,
            newUsersThisWeek,
            newDriversThisWeek,
        },
    };
};
// User Statistics
const getUserStats = async () => {
    const [totalUsers, totalRiders, totalDrivers, totalAdmins, activeUsers, blockedUsers, suspendedUsers, newUsersLast7Days, newUsersLast30Days, usersByRole, usersByStatus, verifiedUsers, unverifiedUsers,] = await Promise.all([
        user_model_1.User.countDocuments(),
        user_model_1.User.countDocuments({ role: user_interface_1.Role.RIDER }),
        user_model_1.User.countDocuments({ role: user_interface_1.Role.DRIVER }),
        user_model_1.User.countDocuments({ role: { $in: [user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN] } }),
        user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE }),
        user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.BLOCKED }),
        user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.SUSPENDED }),
        user_model_1.User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        user_model_1.User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        user_model_1.User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        user_model_1.User.aggregate([
            { $group: { _id: "$isActive", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        user_model_1.User.countDocuments({ isVerified: true }),
        user_model_1.User.countDocuments({ isVerified: false }),
    ]);
    return {
        totalUsers,
        totalRiders,
        totalDrivers,
        totalAdmins,
        activeUsers,
        blockedUsers,
        suspendedUsers,
        newUsersLast7Days,
        newUsersLast30Days,
        usersByRole,
        usersByStatus,
        verifiedUsers,
        unverifiedUsers,
    };
};
// Driver Statistics
const getDriverStats = async () => {
    const [totalDrivers, approvedDrivers, pendingDrivers, rejectedDrivers, suspendedDrivers, availableDrivers, unavailableDrivers, onTripDrivers, driversByVehicleType, driversByStatus, driversByAvailability, totalEarnings, avgEarnings, newDriversLast7Days, newDriversLast30Days, topEarningDrivers,] = await Promise.all([
        driver_model_1.Driver.countDocuments(),
        driver_model_1.Driver.countDocuments({ status: driver_interface_1.DRIVER_STATUS.APPROVED }),
        driver_model_1.Driver.countDocuments({ status: driver_interface_1.DRIVER_STATUS.PENDING }),
        driver_model_1.Driver.countDocuments({ status: driver_interface_1.DRIVER_STATUS.REJECTED }),
        driver_model_1.Driver.countDocuments({ status: driver_interface_1.DRIVER_STATUS.SUSPEND }),
        driver_model_1.Driver.countDocuments({ availability: driver_interface_1.AVAILABILITY.AVAILABLE }),
        driver_model_1.Driver.countDocuments({ availability: driver_interface_1.AVAILABILITY.UNAVAILABLE }),
        driver_model_1.Driver.countDocuments({ availability: driver_interface_1.AVAILABILITY.ON_TRIP }),
        driver_model_1.Driver.aggregate([
            { $group: { _id: "$vehicleType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        driver_model_1.Driver.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        driver_model_1.Driver.aggregate([
            { $group: { _id: "$availability", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        driver_model_1.Driver.aggregate([
            { $group: { _id: null, total: { $sum: "$earnings" } } },
        ]).then((result) => result[0]?.total || 0),
        driver_model_1.Driver.aggregate([
            { $group: { _id: null, avg: { $avg: "$earnings" } } },
        ]).then((result) => result[0]?.avg || 0),
        driver_model_1.Driver.countDocuments({ appliedAt: { $gte: sevenDaysAgo } }),
        driver_model_1.Driver.countDocuments({ appliedAt: { $gte: thirtyDaysAgo } }),
        driver_model_1.Driver.aggregate([
            { $sort: { earnings: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    driverName: "$user.name",
                    vehicleType: 1,
                    vehicleModel: 1,
                    earnings: 1,
                    status: 1,
                },
            },
        ]),
    ]);
    return {
        totalDrivers,
        approvedDrivers,
        pendingDrivers,
        rejectedDrivers,
        suspendedDrivers,
        availableDrivers,
        unavailableDrivers,
        onTripDrivers,
        driversByVehicleType,
        driversByStatus,
        driversByAvailability,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        avgEarnings: Math.round(avgEarnings * 100) / 100,
        newDriversLast7Days,
        newDriversLast30Days,
        topEarningDrivers,
    };
};
// Ride Statistics
const getRideStats = async () => {
    const [totalRides, ridesByStatus, ridesByVehicleType, totalDistance, avgDistance, totalFare, avgFare, ridesLast7Days, ridesLast30Days, ridesThisMonth, ridesThisYear, completedRides, cancelledRides, activeRides, ridesByHour, topPickupLocations, topDestinationLocations, avgRideDuration,] = await Promise.all([
        ride_model_1.Ride.countDocuments(),
        ride_model_1.Ride.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $group: { _id: "$vehicleType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $group: { _id: null, total: { $sum: "$distance" } } },
        ]).then((result) => result[0]?.total || 0),
        ride_model_1.Ride.aggregate([
            { $group: { _id: null, avg: { $avg: "$distance" } } },
        ]).then((result) => result[0]?.avg || 0),
        ride_model_1.Ride.aggregate([{ $group: { _id: null, total: { $sum: "$fare" } } }]).then((result) => result[0]?.total || 0),
        ride_model_1.Ride.aggregate([{ $group: { _id: null, avg: { $avg: "$fare" } } }]).then((result) => result[0]?.avg || 0),
        ride_model_1.Ride.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        ride_model_1.Ride.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        ride_model_1.Ride.countDocuments({ createdAt: { $gte: currentMonth } }),
        ride_model_1.Ride.countDocuments({ createdAt: { $gte: currentYear } }),
        ride_model_1.Ride.countDocuments({ status: ride_interface_1.RideStatus.COMPLETED }),
        ride_model_1.Ride.countDocuments({ status: ride_interface_1.RideStatus.CANCELLED }),
        ride_model_1.Ride.countDocuments({
            status: {
                $in: [ride_interface_1.RideStatus.ACCEPTED, ride_interface_1.RideStatus.PICKED_UP, ride_interface_1.RideStatus.IN_TRANSIT],
            },
        }),
        ride_model_1.Ride.aggregate([
            {
                $group: {
                    _id: { $hour: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]),
        ride_model_1.Ride.aggregate([
            {
                $group: {
                    _id: "$pickupLocation.name",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]),
        ride_model_1.Ride.aggregate([
            {
                $group: {
                    _id: "$destinationLocation.name",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interface_1.RideStatus.COMPLETED } },
            {
                $addFields: {
                    duration: {
                        $divide: [
                            {
                                $subtract: [
                                    "$timestamps.completedAt",
                                    "$timestamps.requestedAt",
                                ],
                            },
                            1000 * 60, // Convert to minutes
                        ],
                    },
                },
            },
            { $group: { _id: null, avgDuration: { $avg: "$duration" } } },
        ]).then((result) => result[0]?.avgDuration || 0),
    ]);
    return {
        totalRides,
        ridesByStatus,
        ridesByVehicleType,
        totalDistance: Math.round(totalDistance * 100) / 100,
        avgDistance: Math.round(avgDistance * 100) / 100,
        totalFare: Math.round(totalFare * 100) / 100,
        avgFare: Math.round(avgFare * 100) / 100,
        ridesLast7Days,
        ridesLast30Days,
        ridesThisMonth,
        ridesThisYear,
        completedRides,
        cancelledRides,
        activeRides,
        ridesByHour,
        topPickupLocations,
        topDestinationLocations,
        avgRideDuration: Math.round(avgRideDuration * 100) / 100,
    };
};
// Revenue Statistics
const getRevenueStats = async () => {
    const [totalRevenue, revenueThisMonth, revenueThisYear, revenueLast7Days, revenueLast30Days, avgRevenuePerRide, revenueByVehicleType, revenueByStatus, revenueByHour, revenueByDay, topRevenueLocations, cancellationRevenueLoss, pendingRevenue,] = await Promise.all([
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interface_1.RideStatus.COMPLETED } },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => result[0]?.total || 0),
        ride_model_1.Ride.aggregate([
            {
                $match: {
                    status: ride_interface_1.RideStatus.COMPLETED,
                    "timestamps.completedAt": { $gte: currentMonth },
                },
            },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => result[0]?.total || 0),
        ride_model_1.Ride.aggregate([
            {
                $match: {
                    status: ride_interface_1.RideStatus.COMPLETED,
                    "timestamps.completedAt": { $gte: currentYear },
                },
            },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => result[0]?.total || 0),
        ride_model_1.Ride.aggregate([
            {
                $match: {
                    status: ride_interface_1.RideStatus.COMPLETED,
                    "timestamps.completedAt": { $gte: sevenDaysAgo },
                },
            },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => result[0]?.total || 0),
        ride_model_1.Ride.aggregate([
            {
                $match: {
                    status: ride_interface_1.RideStatus.COMPLETED,
                    "timestamps.completedAt": { $gte: thirtyDaysAgo },
                },
            },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => result[0]?.total || 0),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interface_1.RideStatus.COMPLETED } },
            { $group: { _id: null, avg: { $avg: "$fare" } } },
        ]).then((result) => result[0]?.avg || 0),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interface_1.RideStatus.COMPLETED } },
            { $group: { _id: "$vehicleType", total: { $sum: "$fare" } } },
            { $sort: { total: -1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $group: { _id: "$status", total: { $sum: "$fare" } } },
            { $sort: { total: -1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interface_1.RideStatus.COMPLETED } },
            {
                $group: {
                    _id: { $hour: "$timestamps.completedAt" },
                    total: { $sum: "$fare" },
                },
            },
            { $sort: { _id: 1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interface_1.RideStatus.COMPLETED } },
            {
                $group: {
                    _id: { $dayOfWeek: "$timestamps.completedAt" },
                    total: { $sum: "$fare" },
                },
            },
            { $sort: { _id: 1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interface_1.RideStatus.COMPLETED } },
            {
                $group: {
                    _id: "$destinationLocation.name",
                    total: { $sum: "$fare" },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 10 },
        ]),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interface_1.RideStatus.CANCELLED } },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => result[0]?.total || 0),
        ride_model_1.Ride.aggregate([
            {
                $match: {
                    status: {
                        $in: [
                            ride_interface_1.RideStatus.ACCEPTED,
                            ride_interface_1.RideStatus.PICKED_UP,
                            ride_interface_1.RideStatus.IN_TRANSIT,
                        ],
                    },
                },
            },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => result[0]?.total || 0),
    ]);
    return {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        revenueThisMonth: Math.round(revenueThisMonth * 100) / 100,
        revenueThisYear: Math.round(revenueThisYear * 100) / 100,
        revenueLast7Days: Math.round(revenueLast7Days * 100) / 100,
        revenueLast30Days: Math.round(revenueLast30Days * 100) / 100,
        avgRevenuePerRide: Math.round(avgRevenuePerRide * 100) / 100,
        revenueByVehicleType,
        revenueByStatus,
        revenueByHour,
        revenueByDay,
        topRevenueLocations,
        cancellationRevenueLoss: Math.round(cancellationRevenueLoss * 100) / 100,
        pendingRevenue: Math.round(pendingRevenue * 100) / 100,
    };
};
exports.StatsService = {
    getDashboardStats,
    getRideStats,
    getUserStats,
    getDriverStats,
    getRevenueStats,
    getPublicHomepageStats,
};
