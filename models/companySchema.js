const mongoose = require("mongoose");

// Define the schema for the company collection
const companySchema = new mongoose.Schema(
  {
    // Define name field with unique constraint
    name: {
      type: String,
      unique: true,
    },
    // Define students subdocument array containing references to Student documents
    students: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId, // Reference to Student document
          ref: "Student", // Model name of referenced document
        },
        date: {
          type: Date, // Interview date
          required: true,
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

// Create Company model from the schema
const Company = mongoose.model("Company", companySchema);

// Export the Company model
module.exports = Company;
