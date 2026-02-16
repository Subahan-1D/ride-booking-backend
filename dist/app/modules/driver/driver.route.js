"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoute = void 0;
// driver.route.ts
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const validateRequest_1 = require("../../middlewares/validateRequest");
const driver_controller_1 = require("./driver.controller");
const driver_validation_1 = require("./driver.validation");
const router = (0, express_1.Router)();
router.post("/apply-driver", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RIDER), (0, validateRequest_1.validateRequest)(driver_validation_1.driverApplicationZodSchema), driver_controller_1.DriverController.applyForDriver);
router.get("/driver-application", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN, ...Object.values(user_interface_1.Role)), driver_controller_1.DriverController.getAllDriverApplication);
router.patch("/driver-application/status/:driverId", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(driver_validation_1.updateDriverApplicationZodSchema), driver_controller_1.DriverController.updateDriver);
router.patch("/update-availability", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), (0, validateRequest_1.validateRequest)(driver_validation_1.updateAvailabilityZodSchema), driver_controller_1.DriverController.updateAvailability);
router.get("/my-profile", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.getMyDriverProfile);
router.patch("/update-my-profile", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), (0, validateRequest_1.validateRequest)(driver_validation_1.updateMyDriverProfileZodSchema), driver_controller_1.DriverController.updateMyDriverProfile);
router.get("/my-ride-history", (0, checkAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverController.getDriverRideHistory);
//
exports.DriverRoute = router;
