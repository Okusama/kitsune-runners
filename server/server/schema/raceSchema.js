const mongoose = require("mongoose");

let raceSchema = mongoose.Schema({
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
});

raceSchema.methods = {
    isRegister : (user_id, race) => {
        return race.players.find(player => player.id === user_id);
    }
};

module.exports = mongoose.model("Race", raceSchema);