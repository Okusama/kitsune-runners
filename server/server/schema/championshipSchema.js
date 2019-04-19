const mongoose = require("mongoose");

let championshipSchema = mongoose.Schema({
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
    games: {
        type: [String],
        required: true
    },
    results: {
        type: {
            player: String,
            game: String,
            score: Number
        }
    }
});

championshipSchema.methods = {
    isRegister : (user_id, championship) => {
        return championship.players.find(player => player === user_id);
    }
};

module.exports = mongoose.model("Championship", championshipSchema);