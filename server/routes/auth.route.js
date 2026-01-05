const express = require("express");
const { logout, signup, login } = require("../controller/auth.controller");
const authRouter = express.Router();
//Login,logut,singup Route
authRouter.route("/login").post(login);
authRouter.route("/signup").post(signup);
authRouter.route("/logout").get(logout);

module.exports = authRouter;
