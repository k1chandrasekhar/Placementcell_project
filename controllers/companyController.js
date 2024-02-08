const Student = require("../models/studentSchema");
const Company = require("../models/companySchema");

// Render company page
module.exports.companyPage = async function (req, res) {
  try {
    // Find all students
    const students = await Student.find({});
    // Render company page with student data
    return res.render("company", { students });
  } catch (error) {
    console.log(`Error in rendering page: ${error}`);
    // Redirect back if error occurs
    return res.redirect("back");
  }
};

// Allocate interview
module.exports.allocateInterview = async function (req, res) {
  try {
    // Find all students
    const students = await Student.find({});
    let array = [];
    // Extract unique batches from students
    for (let student of students) {
      array.push(student.batch);
    }
    // Filter out duplicate batches
    array = [...new Set(array)];
    // Render allocateInterview page with students and unique batches
    return res.render("allocateInterview", { students, array });
  } catch (error) {
    console.log(`Error in allocating interview: ${error}`);
    // Redirect back if error occurs
    return res.redirect("back");
  }
};

// Schedule interview
module.exports.scheduleInterview = async function (req, res) {
  const { id, company, date } = req.body;
  try {
    // Find company by name
    const existingCompany = await Company.findOne({ name: company });
    const obj = {
      student: id,
      date,
      result: "Pending",
    };
    // If company doesn't exist
    if (!existingCompany) {
      // Create new company
      const newCompany = await Company.create({
        name: company,
      });
      // Add interview to new company
      newCompany.students.push(obj);
      newCompany.save();
    } else {
      // Check if interview with student already exists
      for (let student of existingCompany.students) {
        if (student.student._id === id) {
          console.log("Interview with this student already scheduled");
          return res.redirect("back");
        }
      }
      // Add interview to existing company
      existingCompany.students.push(obj);
      existingCompany.save();
    }

    // Find student by id
    const student = await Student.findById(id);

    if (student) {
      // Add interview to student
      const interview = {
        company,
        date,
        result: "Pending",
      };
      student.interviews.push(interview);
      student.save();
    }
    console.log("Interview Scheduled Successfully");
    return res.redirect("/company/home");
  } catch (error) {
    console.log(`Error in scheduling Interview: ${error}`);
    return res.redirect("back");
  }
};

// Update status of interview
module.exports.updateStatus = async function (req, res) {
  const { id } = req.params;
  const { companyName, companyResult } = req.body;
  try {
    // Find student by id
    const student = await Student.findById(id);
    if (student && student.interviews.length > 0) {
      // Update interview status for student
      for (let company of student.interviews) {
        if (company.company === companyName) {
          company.result = companyResult;
          student.save();
          break;
        }
      }
    }
    // Find company by name
    const company = await Company.findOne({ name: companyName });

    if (company) {
      // Update interview status for company
      for (let std of company.students) {
        if (std.student.toString() === id) {
          std.result = companyResult;
          company.save();
        }
      }
    }
    console.log("Interview Status Changed Successfully");
    return res.redirect("back");
  } catch (error) {
    console.log(`Error in updating status: ${error}`);
    // Redirect back if error occurs
    return res.redirect("back");
  }
};
