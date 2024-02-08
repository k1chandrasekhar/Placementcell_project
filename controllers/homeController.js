const Student = require("../models/studentSchema");

// Render home page
module.exports.homePage = async function (req, res) {
  try {
    // Fetch all students from the database
    const students = await Student.find({});
    // Render the home page template and pass the students data to it
    return res.render("home", { students });
  } catch (error) {
    // Handle any errors that occur during the process
    console.log(`Error in rendering home page: ${error}`);
    // Redirect back to the previous page if an error occurs
    return res.redirect("back");
  }
};
