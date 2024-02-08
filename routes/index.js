const express = require("express");

// Create a router instance
const router = express.Router();

// Importing route modules
const userRoutes = require("./userRoutes");
const studentRoutes = require("./studentRoute");
const homeController = require("../controllers/homeController");
const companyRoutes = require("./companyRoute");

// Importing passport for authentication
const passport = require("passport");

// Define routes
// Home route with authentication check
router.get("/", passport.checkAuthentication, homeController.homePage);

// Middleware to handle user routes
router.use("/users", userRoutes);

// Middleware to handle student routes
router.use("/students", studentRoutes);

// Middleware to handle company routes
router.use("/company", companyRoutes);

// Export the router for use in the main application
module.exports = router;
