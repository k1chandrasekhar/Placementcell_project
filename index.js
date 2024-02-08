const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-startegy");
const port = process.env.PORT || 8000;

dotenv.config({ path: "config/.env" });

const app = express();

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Set up session middleware for managing user sessions
app.use(
  session({
    // Change the secret before deployment in production mode
    secret: "hello", // The SECRET is stored in the system variable
    // If the session data is already stored, we don't need to rewrite it again and again, so this is set to false
    resave: false,
    // When the user is not logged in or identity is not established, we don't need to save extra data in the session cookie, so this is set to false
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 100 },
  })
);

// Extract styles and scripts from sub-pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// Parse URL-encoded bodies for form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'assets' directory
app.use(express.static("./assets"));

// Set up passport for authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Set up routes using express router
app.use("/", require("./routes"));

// Start listening on the defined port
app.listen(port, function (error) {
  if (error) {
    console.log(`Error in connecting to server: ${error}`);
    return;
  }
  console.log(`Server running on port: ${port}`);
});
