const express = require("express");
const router = express.Router();
const { uploadImageAvatar, checkToken } = require("../middlewares");
const { register, login, getUserAuthenticated } = require("../controllers/authController");


router
  .post("/register", uploadImageAvatar.single("avatar"), register)
  .post("/login", login)
  .get("/me/:token?", checkToken, getUserAuthenticated);

module.exports = router;