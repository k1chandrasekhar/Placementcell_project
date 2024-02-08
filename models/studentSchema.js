const mongoose = require("mongoose");

// Define the schema for the student collection
const studentSchema = new mongoose.Schema(
  {
    // Define name field with required constraint
    name: {
      type: String,
      required: true,
    },
    // Define email field with unique and required constraints
    email: {
      type: String,
      unique: true,
      required: true,
    },
    // Define college field with required constraint
    college: {
      type: String,
      required: true,
    },
    // Define placement field with required constraint and enum for allowed values
    placement: {
      type: String,
      required: true,
      enum: ["Placed", "Not Placed"],
    },
    // Define contactNumber field with required constraint
    contactNumber: {
      type: Number,
      required: true,
    },
    // Define batch field with required constraint
    batch: {
      type: String,
      required: true,
    },
    // Define fields for different subjects with required constraint
    dsa: {
      type: Number,
      required: true,
    },
    webd: {
      type: Number,
      required: true,
    },
    react: {
      type: Number,
      required: true,
    },
    // Define interviews subdocument array containing interview details
    interviews: [
      {
        company: {
          type: String, // Company name
        },
        date: {
          type: String, // Interview date
        },
        result: {
          type: String, // Interview result
          enum: [
            "On Hold",
            "Selected",
            "Pending",
            "Not Selected",
            "Did not Attempt",
          ], // Allowed values for result
        },
      },
    ],
  },
  { timestamps: true } // Add timestamps for createdAt and updatedAt fields
);

// Create Student model from the schema
const Student = mongoose.model("Student", studentSchema);

// Export the Student model
module.exports = Student;
