const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");
const jwtConfig = require("../config/jwt-config");

//Schema users
let userSchema = mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    twitch_login:{
        type: String
    },
    pseudo: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "visitor"
    },
    avatar: {
        type: String,
        default: ""
    }
},{
    timestamp: {
        createdAt: "created_at"
    }
});

userSchema.methods = {
    authenticate: function(password) {
        return bcrypt.compare(password, this.password).then(res => {
            if (this.role === "visitor") {
                return false;
            } else {
                return res;
            }
        }).catch( err => {
            return err;
        });
    },
    getToken: function(user){
        return jwt.encode(user, jwtConfig.secret);
    }
};

module.exports = mongoose.model("User", userSchema);