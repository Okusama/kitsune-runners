const mongoose = require("mongoose");

let tournamentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    start_at: {
        type: Date,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    players: {
        type: Array,
        default: []
    },
    bracket_url: {
        type: String,
        default: ""
    },
    matches: {
        type: Array,
        default: []
    },
    openMatches:{
        type: Array,
        default: []
    },
    currentRound: {
        type: Array,
        default: []
    }
});

tournamentSchema.methods = {
    isRegister : (user_id, tournament) => {
        return tournament.players.find(player => player.id === user_id);
    }
};

module.exports = mongoose.model("Tournament", tournamentSchema);