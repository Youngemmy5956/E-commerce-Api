import express from "express";
import Model from "../model/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import FormModel from "../model/form.js";

// import auth from "../middleware/auth.js";

const router = express.Router();

// auth createform

router.post("/createform", async (req, res) => {
  const { title, description } = req.body;
  try {
    await FormModel.create({ title, description }).then((form) => {
      res.status(201).json({ message: "form created successfully", form });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// auth getform

router.get("/getform", async (req, res) => {
  try {
    await FormModel.find().then((form) => {
      res.status(201).json({ message: "form created successfully", form });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// auth getbyId

router.get("/getform/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await FormModel.findById(id).then((form) => {
      res.status(201).json({ message: "form created successfully", form });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// auth deletebyId

router.delete("/deleteform/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await FormModel.findByIdAndDelete(id);
    res.status(201).json({ message: "form deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// auth updatebyId

router.put("/updateform/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    await FormModel.findByIdAndUpdate(id, { title, description });
    res.status(201).json({ message: "form updated successfully"});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// auth register

router.post("/auth/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "password is less than 8 characters" });
  }
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }
  if (email.indexOf("@") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  if (email.indexOf(".") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  if (email === email) {
    return res.status(400).json({ message: "email already exist" });
  }
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await Model.create({ firstName, lastName, email, password: hash }).then(
        (user) => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email },
            process.env.JWT_SECRECT_KEY,
            { expiresIn: maxAge }
          );
          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(201).json({ message: "User successfully created", user });
        }
      );
    });
  } catch (err) {
    res.status(400).json({
      message: "User not successfully created",
      error: err.message,
    });
  }
});

// auth login

router.post("/auth/login", async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password is provided
  if (!email || !password) {
    return res.status(400).json({ message: "email or password not provided " });
  }
  try {
    const user = await Model.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ message: "Login not successful", error: "User not found" });
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email },
            process.env.JWT_SECRECT_KEY,
            { expiresIn: maxAge }
          );

          // user.token = token;

          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(201).json({ message: "Login successful", user, token });
        } else {
          res.status(400).json({ message: "Invalid Credentials" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: "An error occurred", error: err.message });
  }
});

// get all data

router.get("/getAll", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// get by id

router.get("/getById/:id", async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// update by id
router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const options = { new: true };

    const data = await Model.findByIdAndUpdate(id, updateData, options);
    res.json(data);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// delete by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Model.findByIdAndDelete(id);
    res.status(201).json({ message: "User successfully deleted", data });
    // res.send(`User with name ${data.name} has been deleted..`);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "An error occurred",
      error: err.message,
    });
  }
});

// logout
router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});

export default router;
