const User = require("../../schema/userSchema");
const bcrypt = require("bcrypt");
const bcryptConfig = require("../../config/bcrypt-config");
const userUtils = require("../../utils/userUtils");
const generalUtils = require("../../utils/generalUtils");

/**
 * Register User
 * @param req Request Object
 * @param res Response Object
 */
const signup = (req, res) => {
    //Verify required inputs
    if (!req.body.email || !req.body.password || !req.body.pseudo){
        //Missing input
        res.status(400).json({
            "res": "Bad Request"
        })

    } else {
        //Init User
        bcrypt.hash(req.body.password, bcryptConfig.saltRounds).then( hash => {
            let user = {
                email: req.body.email,
                password: hash,
                pseudo: req.body.pseudo,
                twitch_login: ""
            };
            //Create a Promise if user's email already exist
            let findUser = new Promise((resolve, reject) => {
                User.findOne({
                    email: user.email
                }, (err, result) => {
                    if (err) {
                        reject(500);
                    } else {
                        if (result) {
                            reject(204)
                        } else {
                            resolve(true)
                        }
                    }
                })
            });

            //Generate a User or throw error
            findUser.then(() => {
                let createUser = new User(user);
                createUser.save((err, user) => {
                    if (err) {
                        res.status(500).json({
                            "res": "Internal Server Error For Create User"
                        })
                    } else {
                        res.status(200).json({
                            "res": "User Register",
                        })
                    }
                })
            }).catch( err => {
                switch (err) {
                    case 500:
                        res.status(500).json({
                            "res": "Internal Server Error In Promise"
                        });
                        break;
                    case 204:
                        res.status(204).json({
                            "res" : "User already exist"
                        });
                        break;
                    default:
                        res.status(500).json({
                            "res": "Internal Server Error In Promise"
                        });
                        break;
                }
            });
        }).catch( err => {
            throw err;
        });

    }
};

const signin = (req, res) => {
    if (!req.body.email || !req.body.password){
        res.status(400).json({
            "res": "Bad Request"
        })
    } else {
        User.findOne({
            email: req.body.email
        }, (err, user) => {
            if (err) {
                res.status(500).json({
                    "res": "Internal Server Error"
                })
            } else if (!user){
                res.status(401).json({
                    "res": "User doesn't exist"
                })
            } else {
                console.log(user);
                if (user.authenticate(req.body.password)){

                    res.status(200).json({
                        "res": "Successful authentication",
                        "token": user.getToken(),
                        "isLogin": true,
                        "isAdmin": user.role === "admin",
                        "userId": user._id,
                        "avatar": user.avatar
                    })
                } else {
                    res.status(401).json({
                        "res": "Bad Password",
                        "isLogin": false
                    })
                }
            }
        });
    }
};

//
const authenticated = (req, res) => {
    if(!req.body.token){
        res.status(400).json({
            "res": "Bad Request"
        })
    } else {
        userUtils.getApiPermission(req.body.token).then(decoded => {
            if(decoded){
                let userInfo = userUtils.getUserInfo(req.body.token);
                userUtils.getAdminPermission(req.body.token).then(decoded => {
                    let isAdmin = false;
                    if (decoded){
                        isAdmin = true;
                    }
                    userInfo.then(user => {
                        res.status(200).json({
                            "res": "Valid User",
                            "isLogin": true,
                            "isAdmin": isAdmin,
                            "userId": user.id,
                            "avatar": user.avatar
                        })
                    });
                });
            } else {
                res.status(401).json({
                    "res": "You are not authorized"
                })
            }
        })
    }
};

const getUsersByRole = (req, res) => {
    if(!req.body.token){
        res.status(400).json({
            "res": "Bad Request"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if(decoded){
                if(!req.body.role){
                    res.status(400).json({
                        "res": "Missing wanted role"
                    })
                } else {
                    let role = generalUtils.escapeHtml(req.body.role);
                    User.find({role: role}, (err, users) => {
                        if(err){
                            res.status(500).json({
                                "res": "Update Failed"
                            })
                        } else {
                            let infoProcess = users.map(user => {
                                return userUtils.getUserPseudo(user._id).then( user => {
                                    return user
                                })
                            })
                           Promise.all(infoProcess).then(users => {
                               res.status(200).json({
                                   "res": users
                               })
                           })
                        }
                    });
                }
            } else {
                res.status(401).json({
                    "res": "You are not authorized"
                })
            }
        })
    }
}

const changeUserRole = (req, res) => {
    if(!req.body.token){
        res.status(400).json({
            "res": "Bad Request"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if(decoded){
                if(!req.body.user_id){
                    res.status(400).json({
                        "res": "Missing User Id"
                    })
                } else if(!req.body.role){
                    res.status(400).json({
                        "res": "Missing new role"
                    })
                } else {
                    let userId = generalUtils.escapeHtml(req.body.user_id);
                    let newRole = generalUtils.escapeHtml(req.body.role);
                    User.findByIdAndUpdate(userId, {role: newRole}, (err, user) => {
                        if(err){
                            res.status(500).json({
                                "res": "Update Failed"
                            })
                        } else {
                            res.status(200).json({
                                "res": "Role update"
                            })
                        }
                    });
                }
            } else {
                res.status(401).json({
                    "res": "You are not authorized"
                })
            }
        })
    }
};

const registerTwitchLoginAndAvatar = (req, res) => {
    if(!req.body.token){
        res.status(400).json({
            "res": "Bad Request"
        })
    } else {
        userUtils.getApiPermission(req.body.token).then(decoded => {
            if(decoded){
                if(!req.body.user_id){
                    res.status(400).json({
                        "res": "Missing User Id"
                    });
                } else if(!req.body.profile_image_url){
                    res.status(400).json({
                        "res": "Missing profile image"
                    });
                } else if(!req.body.twitch_login) {
                    res.status(400).json({
                        "res": "Missing twitch login"
                    });
                } else {
                    let userId = generalUtils.escapeHtml(req.body.user_id);
                    let avatar = generalUtils.escapeHtml(req.body.profile_image_url);
                    let twitchLogin = generalUtils.escapeHtml(req.body.twitch_login);
                    User.findByIdAndUpdate(userId, {twitch_login: twitchLogin, avatar: avatar}, (err, user) => {
                        if(err){
                            res.status(500).json({
                                "res": "Update Failed"
                            })
                        } else {
                            res.status(200).json({
                                "res": "Twitch Profile Register"
                            })
                        }
                    });
                }
            } else {
                res.status(401).json({
                    "res": "You are not authorized"
                })
            }
        })
    }
}

exports.signup = signup;
exports.signin = signin;
exports.authenticated = authenticated;
exports.getUsersByRole = getUsersByRole;
exports.changeUserRole = changeUserRole;
exports.registerTwitchLoginAndAvatar = registerTwitchLoginAndAvatar;
