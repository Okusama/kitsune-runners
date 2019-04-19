const userService = require("./userService");
const express = require("express");
const router = express.Router();

router.post("/signin", userService.signin);
router.post("/signup", userService.signup);
router.post("/authenticated", userService.authenticated);
router.post("/getByRole", userService.getUsersByRole);
router.post("/changeRole", userService.changeUserRole);
router.post("/registerTwitchLoginAndAvatar", userService.registerTwitchLoginAndAvatar);

module.exports = router;