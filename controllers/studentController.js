const Company = require("../models/companySchema");
const Student = require("../models/studentSchema");

// Render create student page
module.exports.createStudentPage = async function (req, res) {
  // Render the add_student page
  return res.render("add_student");
};

// Create student
module.exports.createStudent = async function (req, res) {
  // Extract necessary information from the request body
  const {
    name,
    email,
    batch,
    college,
    placement,
    contactNumber,
    dsa,
    webd,
    react,
  } = req.body;
  try {
    // Check if the student with the given email already exists
    const student = await Student.findOne({ email });

    if (student) {
      // If the student already exists, log an error and redirect back
      console.log("Email already exists");
      return res.redirect("back");
    }

    // Create a new student with the provided information
    const newStudent = await Student.create({
      name,
      email,
      college,
      batch,
      placement,
      contactNumber,
      dsa,
      webd,
      react,
    });
    // Save the newly created student
    await newStudent.save();

    // Redirect to the home page
    return res.redirect("/");
  } catch (error) {
    // Handle any errors that occur during the process
    console.log(`Error in creating student: ${error}`);
    // Redirect back to the previous page if an error occurs
    return res.redirect("back");
  }
};

// Delete student
module.exports.deleteStudent = async function (req, res) {
  const { id } = req.params;
  try {
    // Find the student using the id provided in the request parameters
    const student = await Student.findById(id);

    // Find the companies for which interviews are scheduled
    // and remove the student from the company interviews list
    if (student && student.interviews.length > 0) {
      for (let item of student.interviews) {
        const company = await Company.findOne({ name: item.company });
        if (company) {
          for (let i = 0; i < company.students.length; i++) {
            if (company.students[i].student.toString() === id) {
              company.students.splice(i, 1);
              company.save();
              break;
            }
          }
        }
      }
    }
    // Delete the student from the database
    await Student.findByIdAndDelete(id);
    // Redirect back to the previous page
    res.redirect("back");
  } catch (error) {
    // Handle any errors that occur during the process
    console.log("Error in deleting student");
    // Redirect back to the previous page if an error occurs
    return res.redirect("back");
  }
};
