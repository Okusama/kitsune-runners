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
        type: Array,
        required: true
    },
    results: {
        type: Array,
        default: []
    },
    temp_run: {
        type: Array,
        default: []
    },
    params: {
        type: Array,
        default: []
    }
});

championshipSchema.methods = {
    isRegister : (user_id, championship) => {
        return championship.players.find(player => player.id === user_id);
    }
};

module.exports = mongoose.model("Championship", championshipSchema);