const dotenv = require("dotenv").config();

const express = require("express");
const server = express();

const client = require("./db/client");
client.connect();

const cors = require("cors");
server.use(cors());

server.use(express.json());
const jwt = require("jsonwebtoken");

const apiRouter = require("./api");
const { getUserByEmail } = require("./db/users");

//==========================================================

server.use(async (req, res, next) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!token) {
    return next();
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (decodedToken) {
    const user = await getUserByEmail(decodedToken.email);
    delete user.password;
    req.user = user;
    // console.log(user);
    // console.log(req.user);
    return next();
  }
});

server.use("/api", apiRouter);

//==========================================================

server.listen(process.env.PORT || 3000, () => {
  console.log("The server is up");
});