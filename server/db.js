const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://raffi4244:GP9ZRKo4SksOi218@cluster0.f0xi0.mongodb.net/confessit?retryWrites=true&w=majority"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
