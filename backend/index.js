const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

// Models
const User = require("./models/userModel");

// http://www.unit-conversion.info/texttools/random-string-generator/ : 30 characters
const secret = "5uzhJWUDUDHpTCE5Wbl3uv5Svdo3cT";

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
	origin:"http://localhost:3000",
	credential: true,
})
);

// Connexion à MongoDB
mongoose
  .connect(
    "mongodb+srv://chibienayme:UCPC3bbpkpuoROqt@cluster0.pg9q2.mongodb.net/login?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  });

// Routes
// Homepage
app.get("/", (_req, res) => {
  res.send("Login page");
});

// Signup: email, password, confirm password, firstName, surname, date of birth
app.post("/signup", async (req, res) => {

  if (req.body.confirmPassword != req.body.password ){
    return res.status(400).json({
      message: "Confirmation password does not match",
    });
  }
  // 1 - Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const hashedConfirmPassword = await bcrypt.hash(req.body.confirmPassword, 12);

  // 2 - Créer un utilisateur
  try {
    await User.create({
      email: req.body.email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      firstName: req.body.firstName,
      surname: req.body.surname,
      dateOfBirth: req.body.dateOfBirth,
    });
  } catch (err) {
    return res.status(400).json({
      message: "This account already exists",
    });
  }

  res.status(201).json({
    message: `User ${req.body.email} created`,
  });
});

// Login: email + password
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1 - Vérifier si le compte associé à l'email existe
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  // 2 - Comparer le mot de passe au hash qui est dans la DB
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  // 3 - Générer un token
  const token = jwt.sign({ id: user._id }, secret);

  // 4 - On met le token dans un cookie
  res.cookie("jwt", token, { httpOnly: true, secure: false });

  // 5 - Envoyer le cookie au client
  res.json({
    message: "Here is your cookie",
  });
});

// Users: surname, name, age
app.get("/users", (req, res) => {
  // 1 - Vérifier le token qui est dans le cookie
  let data;
  try {
    data = jwt.verify(req.cookies.jwt, secret);
  } catch (err) {
    return res.status(401).json({
      message: "Your token is not valid",
    });
  }

  // L'utilisateur est authentifié/autorisé
  res.json({
    message: "Your token is valid",
    data,
  });
});

// Start server
app.listen(8000, () => {
  console.log("Listening in the port 8000");
});
