const mongoose = require("mongoose");

// MongoDB Atlas connection string
const DB =
  "mongodb+srv://chandrasekhar:chadru11235@cluster0.cq1slu9.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB Atlas
mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event listener for connection error
db.on("error", console.error.bind(console, "Error in connecting to MongoDB"));

// Event listener for successful connection
db.once("open", function () {
  console.log("Connected to Database :: Mongodb");
});

module.exports = mongoose;
