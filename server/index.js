const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");
const cookieParser = require("cookie-parser");

const User = require("./models/User");
const authMiddleware = require("./authMiddleware");
const Card = require("./models/Card");

const app = express();
const PORT = 5000;

connectDB();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser());

// Route: Register User
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists!" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  // users.push({ username, password: hashedPassword });
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: "User registered successfully!" });
});

// Route: Login User
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find user
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Invalid username or password!" });
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid username or password!" });
  }

  // Generate JWT
  jwt.sign(
    { username: user.username, id: user._id },
    "piggyback", // Replace with a secure secret key
    { expiresIn: "24h" },
    (err, token) => {
      if (err) throw err;

      // Set token in HTTP-only cookie
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: false, // Use true in production (requires HTTPS)
          sameSite: "lax", // Adjust this based on your deployment setup
        })
        .json({ message: "Login successful", token });
    }
  );
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user, // Middleware already verifies and attaches the user
  });
});

app.post("/submit", async (req, res) => {
  const { name, recipient, confession, passkey, clue } = req.body;

  try {
    const newCard = new Card({
      name,
      recipient,
      confession,
      passkey,
      clue,
    });

    await newCard.save();
    res.status(200).json({ message: "Confession submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving confession", error: err });
  }
});

app.get("/confessions", async (req, res) => {
  try {
    const confessions = await Card.find(); // Assuming you're using MongoDB with Mongoose
    res.json(confessions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching confessions" });
  }
});

app.get("/confessions/:id", async (req, res) => {
  try {
    const confession = await Card.findById(req.params.id); // Find by ID
    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }
    res.json(confession); // Send confession data as JSON response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

const multer = require("multer");
const { encode, decode } = require("./steganographyUtils");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: "uploads/" });

app.post("/encode", upload.single("imageToHide"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Path to your default cover image
    const coverImagePath = path.join(__dirname, "assets", "default_cover.png");

    const result = await encode(req.file.path, coverImagePath);

    // Convert result to base64
    const encodedImageBase64 = result.toString("base64");

    // Clean up temporary files
    fs.unlinkSync(req.file.path);

    res.json({ encodedImage: encodedImageBase64 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Encoding failed" });
  }
});

app.post("/decode", upload.single("encodedImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const decodedBuffer = await decode(req.file.path);

    // Convert to Base64
    const decodedImageBase64 = decodedBuffer.toString("base64");

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ decodedImage: decodedImageBase64 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Decoding failed" });
  }
});

module.exports = app;
