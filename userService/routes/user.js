const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage({
  destination(req, file, callback) {
    callback(null, "");
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
  fileFilter(req, file, callback) {
    checkFileType(file, callback);
  },
});
function checkFileType(file, callback) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  console.log(file.originalname);
  const mimetype = fileTypes.test(file.mimetype);
  console.log("check mimetype", mimetype);
  console.log("check extname", extname);
  if (extname && mimetype) {
    return callback(null, true);
  }
  return callback("Error: Images Only!");
}
const authController = require("../controllers/user");
const { verifyToken } = require("../middlewares/authFB");
router.post("/verifyEmail", authController.verifyEmail);
router.post("/verifyToken", authController.verifyToken);
router.post("/signIn", authController.signIn);
router.post("/signUp", authController.signUp);
router.post("/refreshToken", authController.refreshToken);
router.post("/signOut", authController.signOut);
router.put("/:id/changePassword", authController.changePassword);
router.post("/google", authController.signInOrRegisterWithGoogle);
router.use("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Access granted", user: req.user });
});
router.get("/:id", authController.getUserById);
router.put("/:id", authController.editUserById);
router.post("/sendOTP", authController.sendOTP);
router.post("/verifyOTP", authController.verifyOTP);
router.post("/resetPassword", authController.resetPassword);
router.put("/:id/changeAVT", upload.single("avatar"), authController.changeAVT);
module.exports = router;
