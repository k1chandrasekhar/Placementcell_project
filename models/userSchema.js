const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the schema for the user collection
const userSchema = new mongoose.Schema(
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
    // Define passwordHash field with required constraint
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Add timestamps for createdAt and updatedAt fields
);

// Create a virtual property to set hashed password
userSchema.virtual("password").set(function (value) {
  this.passwordHash = bcrypt.hashSync(value, 12); // Hash the password using bcrypt
});

// Method to compare hashed password with the provided password
userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compareSync(password, this.passwordHash); // Compare the provided password with the hashed password
};

// Create User model from the schema
const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
