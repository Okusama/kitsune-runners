const championshipService = require("./championshipService");
const express = require("express");
const router = express.Router();

router.post("/create", championshipService.create);
router.post("/register", championshipService.register);
router.post("/getByState", championshipService.getChampionshipByState);
router.post("/changeState", championshipService.changeChampionshipState);
router.post("/updateGameParam", championshipService.updateGameParam);
router.post("/submitRun", championshipService.submitRun);

module.exports = router;