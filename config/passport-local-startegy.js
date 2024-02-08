const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/userSchema");

// Local strategy for authenticating users using email and password
const local = new LocalStrategy({ usernameField: "email" }, function (
  email,
  password,
  done
) {
  // Find user by email in the database
  User.findOne({ email }, function (error, user) {
    if (error) {
      // If an error occurs during the search, log the error
      console.log(`Error in finding user: ${error}`);
      return done(error);
    }

    // If user is not found or password is incorrect, return false
    if (!user || !user.isPasswordCorrect(password)) {
      console.log("Invalid Username/Password");
      return done(null, false);
    }
    // If user is found and password is correct, return the user object
    return done(null, user);
  });
});

// Use the local strategy for authentication
passport.use("local", local);

// Serialize user object into the session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize user object from the session
passport.deserializeUser(function (id, done) {
  // Find user by id in the database
  User.findById(id, function (err, user) {
    if (err) {
      // If an error occurs during the search, log the error
      console.log("Error in finding user during deserialization");
      return done(err);
    }
    // Return user object
    return done(null, user);
  });
});

// Middleware to check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // If user is authenticated, proceed to next middleware
  if (req.isAuthenticated()) {
    return next();
  }
  // If user is not authenticated, redirect to signin page
  return res.redirect("/users/signin");
};

// Middleware to set authenticated user for views
passport.setAuthenticatedUser = function (req, res, next) {
  // If user is authenticated, set user object in locals
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
