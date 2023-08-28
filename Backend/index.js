import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("port", PORT);

// app.use(express.json());
// app.use(
//   cors({
//     origin: ["https://blitzgaming777frontend.onrender.com/", "https://blitzgaming777frontend.onrender.com/register"], // Replace with your frontend URL
//     credentials: true,
//   })
// );

// Allow request from a specific domain
const allowedOrigins = ['https://blitzgaming777frontend.onrender.com'];
app.use(cors({
  origin:(origin, callback) =>{
    if (allowedOrigins.includes (origin) || !origin) {
      callback(null, true);
    } else{
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Connect to MongoDB

mongoose
  .connect("mongodb+srv://ultimateblitz777:biDnAdK8KnLWFBBv@cluster0.yxhkjnl.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Define Recipe Schema
const recipeSchema = new mongoose.Schema({
  image: String,
  title: String,
  description: String,
  ingredients: {
    type: [String],
    default: [],
  },
  instructions: {
    type: [String],
    default: [],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// Define Recipe Model
const Recipe = mongoose.model("Recipe", recipeSchema);

// Define User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
// Define User Model
const User = mongoose.model("User", userSchema);

// Routes
// Get all non-deleted recipes
app.get("/all-recipes", async (req, res) => {
  try {
    // Fetch all recipes with isDeleted: false
    const recipes = await Recipe.find({ isDeleted: false });
    res.json(recipes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get a specific non-deleted recipe by ID
app.get("/recipe/:id", async (req, res) => {
  const recipeId = req.params.id;

  const recipe = await Recipe.findOne({
    _id: recipeId,
    isDeleted: false,
  });

  if (!recipe) {
    return res.status(404).send("Recipe not found");
  }

  res.json(recipe);
});

// Create a new recipe
app.post("/recipe", async (req, res) => {
  const { image, title, description, ingredients, instructions } = req.body;

  const newRecipe = new Recipe({
    image,
    title,
    description,
    ingredients,
    instructions,
  });

  const savedRecipe = await newRecipe.save();
  res.json(savedRecipe);
});

// Get recipes by title (partial match)
app.get("/recipes", async (req, res) => {
  const { title } = req.query;
  console.log("Title:", title);

  try {
    // Case-insensitive search using regular expression
    const regex = new RegExp(title, "i");
    const recipes = await Recipe.find({ title: regex, isDeleted: false });

    if (recipes.length === 0) {
      return res
        .status(404)
        .json({ message: "No recipes found, please try again." });
    }

    res.json(recipes);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching recipes.");
  }
});

// Update a recipe
app.put("/recipe/:id", async (req, res) => {
  const recipeId = req.params.id;
  const updatedRecipe = req.body;
  console.log("Recipe ID:", recipeId);
  console.log("Updated Recipe:", updatedRecipe);

  try {
    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { ...updatedRecipe },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }

    res.json(recipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).send("An error occurred while updating the recipe.");
  }
});

// Soft delete a recipe
app.delete("/recipe/:id", async (req, res) => {
  const recipeId = req.params.id;

  try {
    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { isDeleted: true },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }

    res.send("Recipe deleted");
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).send("An error occurred while deleting the recipe.");
  }
});

// Handle user registration
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Check if the username is already taken
    const existingUsername = await User.findOne({ name });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Create a new user document
    const newUser = new User({
      name,
      email,
      password,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Respond with success message
    res.json({ message: "Registration successful", user: savedUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "An error occurred while registering user" });
  }
});

// Handle user login
app.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;

  try {
    console.log("Finding user with email:", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("Retrieved User:", user);

    // Temporary comparison without bcrypt
    console.log("Entered Password:", password);
    console.log("Stored Password:", user.password);
    if (password !== user.password) {
      console.log("Password comparison failed for user:", user.email);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("Login successful for user:", user.email);
    
    res.json({ message: "Login successful"});
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

// Handle user logout
app.post("/logout", async (req, res) => {
  const { authToken } = req.body;

  try {
    
    // Respond with success message
    res.json({ message: "Logout successful." });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "An error occurred during logout." });
  }
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

// Protected route example
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
