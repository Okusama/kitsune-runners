const championshipService = require("./championshipService");
const express = require("express");
const router = express.Router();

router.post("/create", championshipService.create);
router.post("/register", championshipService.register);
router.post("/unregister", championshipService.unregister);
router.post("/getByState", championshipService.getChampionshipByState);
router.post("/changeState", championshipService.changeChampionshipState);
router.post("/updateGameParam", championshipService.updateGameParam);
router.post("/submitRun", championshipService.submitRun);
router.post("/validateOrRejectRun", championshipService.validateOrRejectRun);

module.exports = router;