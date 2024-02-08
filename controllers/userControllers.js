const User = require("../models/userSchema");
const Student = require("../models/studentSchema");
const fs = require("fs");
const fastcsv = require("fast-csv");

// Render sign up page
module.exports.signup = function (req, res) {
  // Check if the user is already authenticated, if yes, redirect back
  if (req.isAuthenticated()) {
    return res.redirect("back");
  }
  // Render the signup page
  res.render("signup");
};

// Render sign in page
module.exports.signin = function (req, res) {
  // Check if the user is already authenticated, if yes, redirect back
  if (req.isAuthenticated()) {
    return res.redirect("back");
  }
  // Render the signin page
  res.render("signin");
};

// Create session
module.exports.createSession = function (req, res) {
  // Log a success message indicating that the session was created successfully
  console.log("Session created successfully");
  // Redirect to the home page
  return res.redirect("/");
};

// Signout
module.exports.signout = function (req, res) {
  // Use the logout() function provided by Passport to logout the user
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  // Redirect to the signin page
  return res.redirect("/users/signin");
};

// Create user
module.exports.createUser = async function (req, res) {
  // Extract necessary information from the request body
  const { name, email, password, confirmPassword } = req.body;
  try {
    // Check if the passwords match
    if (password !== confirmPassword) {
      console.log(`Passwords don't match`);
      return res.redirect("back");
    }
    // Check if a user with the provided email already exists
    const user = await User.findOne({ email });

    if (user) {
      console.log(`Email already exists`);
      return res.redirect("back");
    }

    // Create a new user with the provided information
    const newUser = await User.create({
      name,
      email,
      password,
    });

    await newUser.save();

    // If user creation is successful, redirect to the signin page
    return res.redirect("/users/signin");
  } catch (error) {
    // Handle any errors that occur during the process
    console.log(`Error in creating user: ${error}`);
    res.redirect("back");
  }
};

// Download report
module.exports.downloadCsv = async function (req, res) {
  try {
    // Fetch all students from the database
    const students = await Student.find({});

    let data = "";
    let no = 1;
    let csv =
      "S.No, Name, Email, College, Placement, Contact Number, Batch, DSA Score, WebDev Score, React Score, Interview, Date, Result";

    // Iterate over each student and append their information to the CSV data
    for (let student of students) {
      data =
        no +
        "," +
        student.name +
        "," +
        student.email +
        "," +
        student.college +
        "," +
        student.placement +
        "," +
        student.contactNumber +
        "," +
        student.batch +
        "," +
        student.dsa +
        "," +
        student.webd +
        "," +
        student.react;

      if (student.interviews.length > 0) {
        for (let interview of student.interviews) {
          data +=
            "," +
            interview.company +
            "," +
            interview.date.toString() +
            "," +
            interview.result;
        }
      }
      no++;
      csv += "\n" + data;
    }

    // Write the CSV data to a file
    const dataFile = fs.writeFile(
      "report/data.csv",
      csv,
      function (error, data) {
        if (error) {
          console.log(error);
          return res.redirect("back");
        }
        // Log a success message indicating that the report was generated successfully
        console.log("Report generated successfully");
        // Download the generated CSV file
        return res.download("report/data.csv");
      }
    );
  } catch (error) {
    // Handle any errors that occur during the process
    console.log(`Error in downloading file: ${error}`);
    return res.redirect("back");
  }
};
