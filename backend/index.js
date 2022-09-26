const express = require("express");
const app = express();
const port = 5000;
require("./src/db/conn");
const cors = require("cors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors());
const register_user = require("./src/models/register_user");
const add_product = require("./src/models/add_product");
const res = require("express/lib/response");

app.get("/", (req, res) => {
  res.send("kk");
});
app.post("/register", async (req, res) => {
  try {
    const registerUser = new register_user({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      phone: req.body.phone,
      age: req.body.age,
      email: req.body.email,

      password: req.body.password,
      confirmpassword: req.body.reEnterPassword,
    });

    const token = await registerUser.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 50000),
      httpOnly: true,
    });
    let registered = await registerUser.save();
    registered.toObject();
    delete registered.password;
    delete registered.confirmpassword;

    res.status(201).send(registerUser);
  } catch (e) {
    res.send("error");
  }
});
app.post("/login", async (req, res) => {
  try {
    // email1 = req.body.email;
    const email = req.body.email;
    const password = req.body.password;
    let useremail = await register_user.findOne({ email: email });
    // console.log("ll", useremail.password);
    // console.log(password, useremail.password);
    const isMatch = await bcrypt.compare(password, useremail.password);
    // const id = useremail._id;
    // console.log("l");
    const token = await useremail.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 50000),
      httpOnly: true,
    });
    if (isMatch) {
      useremail = useremail.toObject();
      delete useremail.password;
      delete useremail.confirmpassword;
      res.status(201).send(useremail);
    } else {
      res.send("password not matching");
    }
    // console.log(`${email} and ${password} and ${useremail._id}`);
  } catch (erroe) {
    res.status(400).send("invalid Email");
  }
});
app.post("/add-product", async (req, res) => {
  let added_product = new add_product(req.body);
  let result = await added_product.save();
  res.send(result);
});

app.get("/products", async (req, resp) => {
  let products = await add_product.find();

  if (products.length > 0) {
    resp.send(products);
  } else {
    resp.send({ result: "No Products found" });
  }
});

app.delete("/product/:id", async (req, resp) => {
  const result = await add_product.deleteOne({ _id: req.params.id });
  resp.send(result);
});
app.get("/product/:id", async (req, res) => {
  let id = await add_product.findOne({ _id: req.params.id });
  if (id) {
    res.send(id);
  } else {
    res.send("No records found");
  }
});
app.put("/product/:id", async (req, res) => {
  let result = await add_product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
});

app.get("/search/:key", async (req, res) => {
  let result = await add_product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  });
  res.send(result);
});
app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
