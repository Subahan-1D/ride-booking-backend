"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRoute = void 0;
// ride.route.ts
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const ride_controller_1 = require("./ride.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const ride_validation_1 = require("./ride.validation");
const router = (0, express_1.Router)();
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), (0, validateRequest_1.validateRequest)(ride_validation_1.createRideZodSchema), ride_controller_1.RideController.requestRide);
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN, user_interface_1.Role.DRIVER), ride_controller_1.RideController.getAllRides);
router.patch("/rideStatus/:rideId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), ride_controller_1.RideController.updateRideStatus);
router.patch("/cancel/:rideId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), ride_controller_1.RideController.cancelRide);
router.get("/rideHistory", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), ride_controller_1.RideController.rideHistory);
router.get("/rideHistory/:rideId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), ride_controller_1.RideController.getRideById);
router.get("/earnings", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), ride_controller_1.RideController.viewEarningHistory);
exports.RideRoute = router;
