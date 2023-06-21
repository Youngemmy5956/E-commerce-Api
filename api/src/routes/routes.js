import express from "express";
import Model from "../model/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Item_model from "../model/items.js";
import Cart_model from "../model/carts.js";

// import auth from "../middleware/auth.js";

const router = express.Router();

// auth createItems

router.post("/createItems", async (req, res) => {
  const { name, description, category, price } = req.body;
  if (!name || !description || !category || !price) {
    return res.status(400).json({ message: "all fields are required" });
  }
  try {
    await Item_model.create({ name, description, category, price }).then(
      (item) => {
        res.status(201).json({ message: "item successfully created", item });
      }
    );
  } catch (err) {
    res.status(400).json({
      message: "item not successfully created",
      error: err.message,
    });
  }
});

// auth getItemById

router.get("/getItemById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Item_model.findById(id).then((item) => {
      res.status(201).json({ message: "item successfully listed", item });
    });
  } catch (err) {
    res.status(400).json({
      message: "item not successfully listed",
      error: err.message,
    });
  }
});

// auth getAllItems

router.get("/getItems", async (req, res) => {
  try {
    await Item_model.find().then((item) => {
      res.status(201).json({ message: "All items successfully listed", item });
    });
  } catch (err) {
    res.status(400).json({
      message: "All items not successfully listed",
      error: err.message,
    });
  }
});

// auth updateById

router.put("/updateItemById/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price } = req.body;
  try {
    await Item_model.findByIdAndUpdate(id, {
      name,
      description,
      category,
      price,
    }).then((item) => {
      res.status(201).json({ message: "item successfully updated", item });
    });
  } catch (err) {
    res.status(400).json({
      message: "item not successfully updated",
      error: err.message,
    });
  }
});

// auth deleteById

router.delete("/deleteItemById/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Item_model.findByIdAndDelete(id).then((item) => {
      res.status(201).json({ message: "item successfully deleted", item });
    });
  } catch (err) {
    res.status(400).json({
      message: "item not successfully deleted",
      error: err.message,
    });
  }
});

//  get cartById

router.get("/getCartById/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }
  try {
    await Cart_model.findById(id).then((cart) => {
      res.status(201).json({ message: "cart successfully listed", cart });
    });
  } catch (err) {
    res.status(400).json({
      message: "cart not successfully listed",
      error: err.message,
    });
  }
});

// create cart



// router.post("/createCart", async (req, res) => {
//   const owner = req.user.id;
//   const { item, quantity } = req.body;
//   try {
//     const cart = await Cart_model.findById(owner);
//   const item = await Item_model.findById(item);
//     if (!item) {
//       return res.status(400).json({ message: "item does not exist" });
//     }
//     const price = item.price;
//     const name = item.name;
//     if (cart) {
//       //cart exists for user
//       let itemIndex = cart.items.findIndex((p) => p.item == item);
//       if (itemIndex > -1) {
//         //product exists in the cart, update the quantity
//         let productItem = cart.items[itemIndex];
//         productItem.quantity = quantity;

//         cart.bill = cart.items.reduce((a, b) => a + b.quantity * b.price, 0);
//         cart.items[itemIndex] = productItem;
//       } else {
//         //product does not exists in cart, add new item
//         cart.items.push({ item, quantity, price, name });
//         cart.bill = cart.items.reduce((a, b) => a + b.quantity * b.price, 0);
//       }
//       cart = await cart.save();
//       return res.status(201).json(cart);
//     } else {
//       //no cart for user, create new cart
//       const newCart = await Cart_model.create({
//         owner,
//         items: [{ item, quantity, price, name }],
//         bill: quantity * price,
//       });
//       return res.status(201).json(newCart);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// update cart
router.put("/updateCart/:id", async (req, res) => {
  const { id } = req.params;
  const { item, quantity } = req.body;
  try {
    await Cart_model.findByIdAndUpdate(id, { item, quantity }).then((cart) => {
      res.status(201).json({ message: "cart successfully updated", cart });
    });
  } catch (err) {
    res.status(400).json({
      message: "cart not successfully updated",
      error: err.message,
    });
  }
});

// delete cart
router.delete("/deleteCart/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Cart_model.findByIdAndDelete(id).then((cart) => {
      res.status(201).json({ message: "cart successfully deleted", cart });
    });
  } catch (err) {
    res.status(400).json({
      message: "cart not successfully deleted",
      error: err.message,
    });
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
  // if (email === email) {
  //   return res.status(400).json({ message: "email already exist" });
  // }
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
// router.get("/logout", (req, res) => {
//   res.cookie("jwt", "", { maxAge: "1" });
//   res.redirect("/");
// });

router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.status(200).json({ message: "logout successful" });
});

export default router;
