const express = require("express"),
  router = express.Router(),
  controller = require("../controllers/user.controller"),
  middleware = require("../middlewares/user.middleware"),
  authMiddleware = require("../middlewares/auth.middleware");

router.get("/", controller.index);
router.get("/email", middleware.getUserByEmail, controller.show);
router.get("/:id", middleware.getUserById, controller.show);

router.post("/register", controller.register);
router.post("/login", middleware.getUserByEmail, controller.login);
// router.post("/signout", middleware.getUserByEmail, controller.signout);

router.put(
  "/deleteAccount/:id",
  middleware.getUserById,
  controller.deleteAccount
);
// router.put(
//   "/changePassword/:id",
//   middleware.getUserById,
//   controller.deleteAccount
// );
router.put(
  "/:id",
  middleware.getUserById,
  middleware.upload.single("profileImage"),
  controller.updateData
);

module.exports = router;
