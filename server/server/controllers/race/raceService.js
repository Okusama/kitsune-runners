const Race = require("../../schema/raceSchema");
const jwt = require("jwt-simple");
const jwtConfig = require("../../config/jwt-config");
const userUtils = require("../../utils/userUtils");

const create = (req, res) => {
    if(!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if(decoded){
                if (!req.body.name || !req.body.start_at){
                    res.status(400).json({
                        "res": "Bad request Missing Info"
                    })
                } else {
                    let race = {
                        name: req.body.name,
                        start_at: req.body.start_at,
                        state: "open"
                    };
                    let createRace = new Race(race);
                    createRace.save((err, race) => {
                        if (err) {
                            res.status(500).json({
                                "res": "Internal Server Error For Create Race"
                            })
                        } else {
                            res.status(200).json({
                                "res": "Race created"
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
                if (!req.body.race_id){
                    res.status(400).json({
                        "res": "Bad Request Miss Race Id"
                    })
                } else {
                    let user = jwt.decode(req.body.token, jwtConfig.secret);
                    Race.findOne({
                        _id: req.body.race_id
                    }, (err, race) => {
                        if (err) {
                            res.status(500).json({
                                "res": "Internal Server Error"
                            })
                        } else if (!race) {
                            res.status(404).json({
                                "res": "Race not Found"
                            })
                        } else if (race.state === "close" || race.state === "finished"){
                            res.status(423).json({
                                "res": "This Race is closed or finished"
                            })
                        } else if (race.isRegister(user._id, race) !== undefined){
                            res.status(400).json({
                                "res": "You are already register for this race"
                            })
                        } else {
                            let player = {
                                id: user._id,
                                pseudo: user.pseudo
                            }
                            race.updateOne({$push: { players: player}}).then( result => {
                                if (result.nModified === 1){
                                    Race.findOne({
                                        id: req.body.race_id
                                    }, (error, race) => {
                                        res.status(200).json({
                                            "res": "You are registered for the Race",
                                            "race": race
                                        })
                                    });
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
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getApiPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.race_id){
                    res.status(400).json({
                        "res": "Bad Request Miss Tournament Id"
                    })
                } else {
                    let user = jwt.decode(req.body.token, jwtConfig.secret);
                    Race.findOne({
                        _id: req.body.race_id
                    }, (err, race) => {
                        if (err) {
                            res.status(500).json({
                                "res": "Internal Server Error"
                            })
                        } else if (!race) {
                            res.status(404).json({
                                "res": "Race not Found"
                            })
                        } else if (race.state === "close" || race.state === "finished"){
                            res.status(423).json({
                                "res": "This race is closed or finished"
                            })
                        } else if (race.isRegister(user._id, race) === undefined){
                            res.status(400).json({
                                "res": "You are not register for this race"
                            })
                        } else {
                            race.updateOne({$pull: { players: { id: user._id} }}).then( result => {
                                if (result.nModified === 1){
                                    Race.findOne({
                                        _id: req.body.race_id
                                    }, (err, race) => {
                                        res.status(200).json({
                                            "res": "You are Unregistered for the race",
                                            "tournament": race
                                        })
                                    })
                                } else {
                                    res.status(500).json({
                                        "res": "An Error occurred during unregistered of race"
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

const getRaceByState = (req, res) => {
    if(!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getApiPermission(req.body.token).then( decoded => {
            if(decoded){
                let stateFilter = req.body.state;
                Race.find({state: stateFilter}, (err, races) => {
                    if (err) {
                        res.status(500).json({
                            "res": "Internal Server Error"
                        })
                    } else if (!races) {
                        res.status(404).json({
                            "res": "Tournament not Found"
                        })
                    } else {
                        res.status(200).json({
                            "res": races
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
};

const setRaceResult = (req, res) => {
    if (!req.body.token) {
        res.status(401).json({
            "res": "You must be connected"
        });
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.race_id || !req.body.result){
                    res.status(400).json({
                        "res": "Bad Request Missing info"
                    })
                } else {
                    Race.findOne({
                        _id: req.body.race_id
                    }, (err, race) => {
                        if (err) {
                            res.status(500).json({
                                "res": "Internal Server Error"
                            })
                        } else if (!race) {
                            res.status(404).json({
                                "res": "Race not Found"
                            })
                        } else {
                            race.updateOne({$set: {result: req.body.result}}).then( result => {
                                if (result.nModified === 1){
                                    res.status(200).json({
                                        "res": "Race validate"
                                    });
                                } else {
                                    res.status(500).json({
                                        "res": "An Error occurred during validate Race"
                                    });
                                }
                            });
                        }
                    });
                }
            }
        })
    }
}

exports.create = create;
exports.register = register;
exports.unregister = unregister;
exports.getByState = getRaceByState;
exports.setRaceResult = setRaceResult;