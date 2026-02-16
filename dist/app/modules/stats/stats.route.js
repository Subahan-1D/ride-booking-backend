"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_interface_1 = require("../user/user.interface");
const checkAuth_1 = require("../../middlewares/checkAuth");
const stats_controller_1 = require("./stats.controller");
const router = express_1.default.Router();
// Public, unauthenticated homepage stats (safe aggregates only)
router.get("/public", stats_controller_1.StatsController.getPublicHomepageStats);
// Dashboard stats - overview of all key metrics
router.get("/dashboard", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), stats_controller_1.StatsController.getDashboardStats);
// Ride statistics
router.get("/rides", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), stats_controller_1.StatsController.getRideStats);
// User statistics
router.get("/users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), stats_controller_1.StatsController.getUserStats);
// Driver statistics
router.get("/drivers", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), stats_controller_1.StatsController.getDriverStats);
// Revenue statistics
router.get("/revenue", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), stats_controller_1.StatsController.getRevenueStats);
exports.StatsRoutes = router;
