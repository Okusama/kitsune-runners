const Championship = require("../../schema/championshipSchema");
const jwt = require("jwt-simple");
const jwtConfig = require("../../config/jwt-config");
const userPermissions = require("../../utils/userUtils");

const createChampionship = (req, res) => {
    if(!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userPermissions.getAdminPermission(req.body.token).then(decoded => {
            if(decoded){
                if (!req.body.name || !req.body.start_at || !req.body.state || !req.body.games || !req.body.params){
                    res.status(400).json({
                        "res": "Bad request Missing Info"
                    })
                } else {
                    let championship = {
                        name: req.body.name,
                        start_at: req.body.start_at,
                        state: req.body.state,
                        games: req.body.games,
                        params: req.body.params
                    };
                    let createChampionship = new Championship(championship);
                    createChampionship.save((err, championship) => {
                        if (err) {
                            res.status(500).json({
                                "res": "Internal Server Error For Create Championship"
                            })
                        } else {
                            res.status(200).json({
                                "res": "ChampionShip created"
                            })
                        }
                    })
                }
            } else {
                res.status(401).json({
                    "res": "You are not authorized"
                })
            }
        });
    }
};

const register = (req, res) => {
    if(!req.body.token) {
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userPermissions.getApiPermission(req.body.token).then(decoded => {
           if(decoded){
               if (!req.body.championship_id){
                   res.status(400).json({
                       "res": "Bad Request Miss Championship Id"
                   })
               } else {
                   let user = jwt.decode(req.body.token, jwtConfig.secret);
                   Championship.findOne({
                       _id: req.body.championship_id
                   }, (err, championship) => {
                       if (err) {
                           res.status(500).json({
                               "res": "Internal Server Error"
                           })
                       } else if (!championship) {
                           res.status(404).json({
                               "res": "Championship not Found"
                           })
                       } else if (championship.state === "close" || championship.state === "finished"){
                           res.status(423).json({
                               "res": "This Championship is closed or finished"
                           })
                       } else if (championship.isRegister(user._id, championship) !== undefined){
                           res.status(400).json({
                               "res": "You are already register for this championship"
                           })
                       } else {
                           let player = {
                               id: user._id,
                               pseudo: user.pseudo
                           }
                           championship.updateOne({$push: { players: player}}).then( result => {
                               if (result.nModified === 1){
                                   res.status(200).json({
                                       "res": "You are registered for the Championship"
                                   })
                               } else {
                                   res.status(500).json({
                                       "res": "An Error occurred during register"
                                   })
                               }
                           });

                       }
                   });
               }
           } else {
               res.status(401).json({
                   "res": "You use a bad account"
               })
           }
        });
    }
};

const unregister = (req, res) => {
    if(!req.body.token) {
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userPermissions.getApiPermission(req.body.token).then(decoded => {
            if(decoded){
                if (!req.body.championship_id){
                    res.status(400).json({
                        "res": "Bad Request Miss Championship Id"
                    })
                } else {
                    let user = jwt.decode(req.body.token, jwtConfig.secret);
                    Championship.findOne({
                        _id: req.body.championship_id
                    }, (err, championship) => {
                        if (err) {
                            res.status(500).json({
                                "res": "Internal Server Error"
                            })
                        } else if (!championship) {
                            res.status(404).json({
                                "res": "Championship not Found"
                            })
                        } else if (championship.state === "close" || championship.state === "finished"){
                            res.status(423).json({
                                "res": "This Championship is closed or finished"
                            })
                        } else if (championship.isRegister(user._id, championship) !== undefined){
                            res.status(400).json({
                                "res": "You are not register of this Championship"
                            })
                        } else {
                            let player = {
                                id: user._id,
                                pseudo: user.pseudo
                            }
                            championship.updateOne({$pull: { players: player}}).then( result => {
                                if (result.nModified === 1){
                                    res.status(200).json({
                                        "res": "You are unregistered for the Championship"
                                    })
                                } else {
                                    res.status(500).json({
                                        "res": "An Error occurred during register"
                                    })
                                }
                            });

                        }
                    });
                }
            } else {
                res.status(401).json({
                    "res": "You use a bad account"
                })
            }
        });
    }
};

const getChampionShipByState = (req, res) => {
    if(!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userPermissions.getApiPermission(req.body.token).then( decoded => {
            if(decoded){
                Championship.find({state: req.body.state}, (err, championships) => {
                    if (err) {
                        res.status(500).json({
                            "res": "Internal Server Error"
                        })
                    } else if (!championships) {
                        res.status(404).json({
                            "res": "Championships not Found"
                        })
                    } else {
                        res.status(200).json({
                            "res": championships
                        })
                    }
                });
            } else {
                res.status(401).json({
                    "res": "You use a bad account"
                })
            }
        });
    }
}

const changeChampionshipState = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userPermissions.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.championship_state || !req.body.championship_id){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = req.body.championship_id;
                    let state = req.body.championship_state;
                    Championship.findByIdAndUpdate(id, {state: state}, (err, championship) => {
                        if(err){
                            res.status(500).json({
                                "res": "Update Failed"
                            })
                        } else {
                            res.status(200).json({
                                "res": "Update Success"
                            })
                        }
                    });
                }
            } else {
                res.status(401).json({
                    "res": "You are not authorized"
                })
            }
        });
    }
}

const updateGameParam = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userPermissions.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.championship_id || !req.body.game || !req.body.min || !req.body.max || !req.body.difficulty_coef){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = req.body.championship_id;
                    Championship.findOne({_id: id}, (err, championship) => {
                        if(err){
                            res.status(500).json({
                                "res": "Update Failed"
                            })
                        } else {
                            let game = req.body.game;
                            let param = {
                                min: req.body.min,
                                max: req.body.max,
                                difficulty_coef: req.body.difficulty_coef
                            };
                            let newParams = championship.params;
                            newParams[0][game] =  param;
                            championship.updateOne({$set : {params: newParams}}).then(result => {
                                if (result.nModified === 1){
                                    res.status(200).json({
                                        "res": "Param Change",
                                        "championship": championship
                                    })
                                } else {
                                    res.status(500).json({
                                        "res": "An Error occurred during update"
                                    })
                                }
                            });
                        }
                    });
                }
            } else {
                res.status(401).json({
                    "res": "You are not authorized"
                })
            }
        });
    }
}

const submitRun = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userPermissions.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.championship_id || !req.body.game || !req.body.score || !req.body.time || !req.body.video_link){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = req.body.championship_id;
                    Championship.findOne({_id: id}, (err, championship) => {
                        if(err){
                            res.status(500).json({
                                "res": "Submit score Failed"
                            })
                        } else {
                            userPermissions.getUserInfo(req.body.token).then(user => {

                                let submitTime = {
                                    user_id: user.id,
                                    user_pseudo: user.pseudo,
                                    game: req.body.game,
                                    score: req.body.score,
                                    time: req.body.time,
                                    video_link: req.body.video_link
                                };

                                championship.updateOne({$push : {temp_run: submitTime}}).then(result => {
                                    if (result.nModified === 1){
                                        res.status(200).json({
                                            "res": "Run submit",
                                        })
                                    } else {
                                        res.status(500).json({
                                            "res": "An Error occurred during submit your run"
                                        })
                                    }
                                });
                            });
                        }
                    });
                }
            } else {
                res.status(401).json({
                    "res": "You are not authorized"
                })
            }
        });
    }
}

exports.create = createChampionship;
exports.register = register;
exports.getChampionshipByState = getChampionShipByState;
exports.changeChampionshipState = changeChampionshipState;
exports.updateGameParam = updateGameParam;
exports.submitRun = submitRun;