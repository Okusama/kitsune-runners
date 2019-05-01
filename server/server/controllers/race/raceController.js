const raceService = require("./raceService");
const express = require("express");
const router = express.Router();

router.post("/create", raceService.create);
router.post("/register", raceService.register);
router.post("/unregister", raceService.unregister);
router.post("/getByState", raceService.getByState);
router.post("/changeState", raceService.changeState);

module.exports = router;