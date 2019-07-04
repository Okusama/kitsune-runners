const tournamentService = require("./tournamentService");
const express = require("express");
const router = express.Router();

router.post("/create", tournamentService.create);
router.post("/register", tournamentService.register);
router.post("/unregister", tournamentService.unregister);
router.post("/getByState", tournamentService.getTournamentByState);
router.post("/changeState", tournamentService.changeTournamentState);
router.post("/start", tournamentService.startTournament);
router.post("/getOpenMatches", tournamentService.getOpenMatches);
router.post("/initRound", tournamentService.initRound);
router.post("/getRound", tournamentService.getRound);
router.post("/validateScoreRound", tournamentService.validateScoreRound);
router.post("/clearRound", tournamentService.clearRound);

module.exports = router;
