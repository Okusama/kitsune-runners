const Championship = require("../../schema/championshipSchema");
const jwt = require("jwt-simple");
const jwtConfig = require("../../config/jwt-config");
const userUtils = require("../../utils/userUtils");
const mongoose = require("mongoose");
const sanitize = require("mongo-sanitize");

const createChampionship = (req, res) => {
    if(!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if(decoded){
                if (!req.body.name || !req.body.start_at || !req.body.state || !req.body.games || !req.body.params){
                    res.status(400).json({
                        "res": "Bad request Missing Info"
                    })
                } else {

                    let name = sanitize(req.body.name);
                    let startAt = sanitize(req.body.start_at);
                    let state = sanitize(req.body.state);
                    let games = sanitize(req.body.games);
                    let params = sanitize(req.body.params);

                    let championship = {
                        name: name,
                        start_at: startAt,
                        state: state,
                        games: games,
                        params: params
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
        userUtils.getApiPermission(req.body.token).then(decoded => {
            if(decoded){
                if (!req.body.championship_id){
                    res.status(400).json({
                        "res": "Bad Request Miss Championship Id"
                    })
                } else {
                    userUtils.getUserInfo(req.body.token).then(user => {
                        let id = sanitize(req.body.championship_id);
                        Championship.findOne({
                            _id: id
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
                                };

                                let games = {
                                    "user_id": user._id,
                                    "total": 0,
                                    "scores": []
                                };

                                for (let game of championship.games){

                                    let temp = {
                                        "game": game,
                                        "time": "None",
                                        "score": 0
                                    };

                                    games.scores.push(temp);

                                }

                                championship.updateOne({$push: { players: player, results: games}}).then( result => {
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
        userUtils.getApiPermission(req.body.token).then(decoded => {
            if(decoded){
                if (!req.body.championship_id){
                    res.status(400).json({
                        "res": "Bad Request Miss Championship Id"
                    })
                } else {
                    userUtils.getUserInfo(req.body.token).then(user => {
                        let id = sanitize(req.body.championship_id);
                        Championship.findOne({
                            _id: id
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
                            } else if (championship.isRegister(user._id, championship) === undefined){
                                res.status(400).json({
                                    "res": "You are not register of this Championship"
                                })
                            } else {

                                let player = {
                                    id: user._id,
                                    pseudo: user.pseudo
                                };

                                let newResults = championship.results.filter(run => run.user_id !== user._id);

                                championship.updateOne({$pull: {players: player}, $set: {results: newResults}}).then( result => {
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
        userUtils.getApiPermission(req.body.token).then( decoded => {
            if(decoded){
                let state = sanitize(req.body.state)
                Championship.find({state: state}, (err, championships) => {
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
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.championship_state || !req.body.championship_id){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = sanitize(req.body.championship_id);
                    let state = sanitize(req.body.championship_state);
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
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.championship_id || !req.body.game || !req.body.min || !req.body.max || !req.body.difficulty_coef){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = sanitize(req.body.championship_id);
                    Championship.findOne({_id: id}, (err, championship) => {
                        if(err){
                            res.status(500).json({
                                "res": "Update Failed"
                            })
                        } else {
                            let game = sanitize(req.body.game);
                            let min = sanitize(req.body.min);
                            let max = sanitize(req.body.max);
                            let difficultyCoef = sanitize(req.body.difficulty_coef);
                            let param = {
                                min: min,
                                max: max,
                                difficulty_coef: difficultyCoef
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
        userUtils.getApiPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.championship_id || !req.body.game || !req.body.score || !req.body.time || !req.body.video_link){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = sanitize(req.body.championship_id);
                    Championship.findOne({_id: id}, (err, championship) => {
                        if(err){
                            res.status(500).json({
                                "res": "Submit score Failed"
                            })
                        } else {
                            userUtils.getUserInfo(req.body.token).then(user => {

                                let game = sanitize(req.body.game);
                                let score = sanitize(req.body.score);
                                let time = sanitize(req.body.time);
                                let videoLink = sanitize(req.body.video_link);

                                let submitTime = {
                                    run_id: mongoose.Types.ObjectId(),
                                    user_id: user._id,
                                    user_pseudo: user.pseudo,
                                    game: game,
                                    score: score,
                                    time: time,
                                    video_link: videoLink
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

const validateOrRejectRun = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.championship_id || !req.body.run_id || !req.body.action){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = sanitize(req.body.championship_id);
                    Championship.findOne({_id: id}, (err, championship) => {
                        if(err){
                            res.status(500).json({
                                "res": "Action Failed"
                            })
                        } else {

                            let runId = sanitize(req.body.run_id);
                            let newTempRun = championship.temp_run.filter(run => run.run_id.toString() !== runId);

                            if (req.body.action === "validate"){

                                let run = championship.temp_run.filter(run => run.run_id.toString() === runId);

                                let resultUpdate = championship.results.map(result => {

                                    if (result.user_id === run[0].user_id){
                                        let newResult = 0;
                                        for (let score of result.scores){
                                            if (score.game === run[0].game){
                                                score.time = run[0].time;
                                                score.score = run[0].score;
                                            }
                                            newResult += score.score;
                                            result.total = newResult;
                                        }
                                    }
                                    return result;
                                });

                                championship.updateOne({$set: {temp_run: newTempRun, results: resultUpdate}}).then(result => {
                                    if (result.nModified === 1){
                                        res.status(200).json({
                                            "res": "Run Validate",
                                        })
                                    } else {
                                        res.status(500).json({
                                            "res": "An Error occurred during validate run"
                                        })
                                    }
                                });

                            } else if (req.body.action === "reject"){

                                championship.updateOne({$set: {temp_run: newTempRun}}).then(result => {
                                    if (result.nModified === 1){
                                        res.status(200).json({
                                            "res": "Run reject",
                                        })
                                    } else {
                                        res.status(500).json({
                                            "res": "An Error occurred during reject run"
                                        })
                                    }
                                });

                            }
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
exports.unregister = unregister;
exports.getChampionshipByState = getChampionShipByState;
exports.changeChampionshipState = changeChampionshipState;
exports.updateGameParam = updateGameParam;
exports.submitRun = submitRun;
exports.validateOrRejectRun = validateOrRejectRun;