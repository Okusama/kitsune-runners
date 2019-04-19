const Tournament = require("../../schema/tournamentSchema");
const User = require("../../schema/userSchema");
const jwt = require("jwt-simple");
const jwtConfig = require("../../config/jwt-config");
const client = require("../../config/challonge");
const userUtils = require("../../utils/userUtils");
const utils = require("../../utils/generalUtils");

const createTournament = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.name || !req.body.start_at){
                    res.status(400).json({
                        "res": "Bad Request Missing Info"
                    })
                } else {
                    let url = "kitsune";
                    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    for (var i = 0; i < 15; i++) {
                        url += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    client.tournaments.create({
                        tournament: {
                            name: req.body.name,
                            url: url,
                        },
                        callback: (err, data) => {
                            if (err) {
                                res.status(500).json({
                                    "res": "Generation Failed"
                                });
                            } else {
                                let tournament = {
                                    name: req.body.name,
                                    start_at: req.body.start_at,
                                    state: "open",
                                    bracket_url: url
                                };
                                let createTournament = new Tournament(tournament);
                                createTournament.save((err, tournament) => {
                                    if (err) {
                                        res.status(500).json({
                                            "res": "Internal Server Error For Create Tournament"
                                        })
                                    } else {
                                        res.status(200).json({
                                            "res": "Tournament created"
                                        })
                                    }
                                })
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
};

const register = (req, res) => {

    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getApiPermission(req.body.token).then(decoded => {
            if (decoded) {
                if (!req.body.tournament_id){
                    res.status(400).json({
                        "res": "Bad Request Miss Tournament Id"
                    })
                } else {
                    let user = jwt.decode(req.body.token, jwtConfig.secret);
                    Tournament.findOne({
                        _id: req.body.tournament_id
                    }, (err, tournament) => {
                        if (err) {
                            res.status(500).json({
                                "res": "Internal Server Error"
                            })
                        } else if (!tournament) {
                            res.status(404).json({
                                "res": "Tournament not Found"
                            })
                        } else if (tournament.state === "close" || tournament.state === "finished"){
                            res.status(423).json({
                                "res": "This Tournament is closed or finished"
                            })
                        } else if (tournament.isRegister(user._id, tournament) !== undefined){
                            res.status(400).json({
                                "res": "You are already register for this tournament"
                            })
                        } else {
                            client.participants.create({
                                id: tournament.bracket_url,
                                participant: {
                                    name: user.pseudo
                                },
                                callback: (err, data) => {
                                    if (err) {
                                        res.status(500).json({
                                            "res": "An Error occurred during register at Challonge"
                                        })
                                    } else {
                                        let player = {
                                            id: user._id,
                                            challonge_id: data.participant.id,
                                            pseudo: user.pseudo,
                                            twitch_login: user.twitch_login
                                        };
                                        tournament.updateOne({$push: {players: player}}).then( result => {
                                            if (result.nModified === 1){
                                                Tournament.findOne({
                                                    _id: req.body.tournament_id
                                                }, (err, tournament) => {
                                                    res.status(200).json({
                                                        "res": "You are registered for the tournament",
                                                        "tournament": tournament
                                                    })
                                                })
                                            } else {
                                                res.status(500).json({
                                                    "res": "An Error occurred during register"
                                                })
                                            }
                                        });
                                    }
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
                if (!req.body.tournament_id){
                    res.status(400).json({
                        "res": "Bad Request Miss Tournament Id"
                    })
                } else {
                    let user = jwt.decode(req.body.token, jwtConfig.secret);
                    Tournament.findOne({
                        _id: req.body.tournament_id
                    }, (err, tournament) => {
                        if (err) {
                            res.status(500).json({
                                "res": "Internal Server Error"
                            })
                        } else if (!tournament) {
                            res.status(404).json({
                                "res": "Tournament not Found"
                            })
                        } else if (tournament.state === "close" || tournament.state === "finished"){
                            res.status(423).json({
                                "res": "This Tournament is closed or finished"
                            })
                        } else if (tournament.isRegister(user._id, tournament) === undefined){
                            res.status(400).json({
                                "res": "You are not register for this tournament"
                            })
                        } else {

                            let challongeId = null;

                            for(let player of tournament.players){
                                console.log(player);
                                if (player.id === user._id){
                                    challongeId = player.challonge_id
                                }
                            }

                            if (challongeId !== null){
                                client.participants.destroy({
                                    id: tournament.bracket_url,
                                    participantId: challongeId,
                                    callback: (err, data) => {
                                        if (err){
                                            res.status(500).json({
                                                "res": "An Error occurred during unregistered on challonge"
                                            })
                                        } else {
                                            tournament.updateOne({$pull: { players: { id: user._id} }}).then( result => {
                                                if (result.nModified === 1){
                                                    Tournament.findOne({
                                                        _id: req.body.tournament_id
                                                    }, (err, tournament) => {
                                                        res.status(200).json({
                                                            "res": "You are Unregistered for the tournament",
                                                            "tournament": tournament
                                                        })
                                                    })
                                                } else {
                                                    res.status(500).json({
                                                        "res": "An Error occurred during unregistered of tournament"
                                                    })
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.status(500).json({
                                    "res": "An Error occurred during unregistered"
                                })
                            }
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

const getTournamentByState = (req, res) => {
    if(!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getApiPermission(req.body.token).then( decoded => {
            if(decoded){
                let stateFilter = utils.escapeHtml(req.body.state);
                Tournament.find({state: stateFilter}, (err, tournaments) => {
                    if (err) {
                        res.status(500).json({
                            "res": "Internal Server Error"
                        })
                    } else if (!tournaments) {
                        res.status(404).json({
                            "res": "Tournament not Found"
                        })
                    } else {
                        res.status(200).json({
                            "res": tournaments
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

const changeTournamentState = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.tournament_state || !req.body.tournament_id){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = utils.escapeHtml(req.body.tournament_id);
                    let state = utils.escapeHtml(req.body.tournament_state);
                    Tournament.findByIdAndUpdate(id, {state: state}, (err, tournament) => {
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

const startTournament = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.tournament_id){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = utils.escapeHtml(req.body.tournament_id);
                    Tournament.findOne({_id: id}, (err, tournament) => {
                        if(err){
                            res.status(500).json({
                                "res": "Update Failed"
                            })
                        } else {
                            client.tournaments.start({
                               id: tournament.bracket_url,
                                callback: (err, data) => {
                                   if (err){
                                       res.status(500).json({
                                           "res": "Start Failed"
                                       })
                                   } else {
                                       client.matches.index({
                                           id: tournament.bracket_url,
                                           callback: (err, data) => {
                                               if (err) {
                                                   client.tournaments.reset({
                                                       id: tournament.bracket_url,
                                                       callback: (err, data) => {
                                                           res.status(500).json({
                                                               "res": "Get Matches Failed"
                                                           })
                                                       }
                                                   });
                                               }
                                               tournament.updateOne({$set : {matches: data}}).then( result => {
                                                   if (result.nModified === 1){
                                                       res.status(200).json({
                                                           "res": "Tournament start"
                                                       })
                                                   } else {
                                                       client.tournaments.reset({
                                                           id: tournament.bracket_url,
                                                           callback: (err, data) => {
                                                               res.status(500).json({
                                                                   "res": "An Error occurred during registering Match"
                                                               })
                                                           }
                                                       });
                                                   }
                                               });
                                           }
                                       });
                                   }
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
};

const getOpenMatches = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.tournament_id){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = utils.escapeHtml(req.body.tournament_id);
                    Tournament.findOne({_id: id}, (err, tournament) => {
                        if(err){
                            res.status(500).json({
                                "res": "Update Failed"
                            })
                        } else {
                            client.matches.index({
                                id: tournament.bracket_url,
                                callback: (err, data) => {
                                    if (err) {
                                        res.status(500).json({
                                            "res": "Generation Failed"
                                        });
                                    } else {

                                        let matches = [];

                                        for (let item in data){

                                            let match = data[item].match;

                                            if(match.state === "open"){

                                                let player1 = tournament.players.find(player => player.challonge_id === match.player1Id);
                                                let player2 = tournament.players.find(player => player.challonge_id === match.player2Id);
                                                let obj = {
                                                    match_id: match.id,
                                                    player1: {
                                                        challonge_id: match.player1Id,
                                                        pseudo: player1.pseudo,
                                                        id: player1.id,
                                                        twitch_login: player1.twitch_login,
                                                        time: "0:00:00"
                                                    },
                                                    player2: {
                                                        challonge_id: match.player2Id,
                                                        pseudo: player2.pseudo,
                                                        id: player2.id,
                                                        twitch_login: player2.twitch_login,
                                                        time: "0:00:00"
                                                    },
                                                };
                                                matches.push(obj);
                                            }

                                        }
                                        res.status(200).json({
                                            "res": "Generation Success",
                                            "data": matches
                                        });
                                    }
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
};

const initRound = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.tournament_id || !req.body.matches){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = utils.escapeHtml(req.body.tournament_id);
                    Tournament.findOne({_id: id}, (err, tournament) => {
                        if(err){
                            res.status(500).json({
                                "res": "Update Failed"
                            })
                        } else {
                            let currentRound = req.body.matches;
                            tournament.updateOne({$set: {currentRound: currentRound}}).then( result => {
                                if (result.nModified === 1){
                                    res.status(200).json({
                                        "res": "Round Init"
                                    })
                                } else {
                                    res.status(500).json({
                                        "res": "An Error occurred during init Round"
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
};

const getRound = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getApiPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.tournament_id){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = utils.escapeHtml(req.body.tournament_id);
                    Tournament.findOne({_id: id}, (err, tournament) => {
                        if(err){
                            res.status(404).json({
                                "res": "Tournament not Found"
                            })
                        } else {
                            if (tournament.currentRound.length > 0){
                                res.status(200).json({
                                    "res": "Round",
                                    "round": tournament.currentRound
                                })
                            } else {
                                res.status(200).json({
                                    "res": "No round",
                                    "round": null
                                })
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
};

const validateScoreRound = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.tournament_id){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = utils.escapeHtml(req.body.tournament_id);
                    Tournament.findOne({_id: id}, (err, tournament) => {
                        if(err){
                            res.status(404).json({
                                "res": "Tournament not Found"
                            })
                        } else {
                            client.matches.update({
                               id: tournament.bracket_url,
                               matchId: req.body.match_id,
                               match: {
                                   scoresCsv: req.body.score,
                                   winnerId: req.body.winner_id
                               },
                                callback: (err, data) => {
                                   if (err) {
                                       console.log(err);
                                       res.status(500).json({
                                           "res": "Match Not Register",
                                           "match": req.body.match_id
                                       })
                                   } else {
                                       res.status(200).json({
                                           "res": "Match Register",
                                           "match": req.body.match_id
                                       })
                                   }
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
};

const clearRound = (req, res) => {
    if (!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getAdminPermission(req.body.token).then(decoded => {
            if (decoded){
                if (!req.body.tournament_id){
                    res.status(401).json({
                        "res": "Missing Info"
                    })
                } else {
                    let id = utils.escapeHtml(req.body.tournament_id);
                    Tournament.findOne({_id: id}, (err, tournament) => {
                        if (err) {
                            res.status(404).json({
                                "res": "Tournament not Found"
                            })
                        } else {
                            tournament.updateOne({$set: {currentRound: []}}).then(result => {
                                if (result.nModified === 1){
                                    client.matches.index({
                                        id: tournament.bracket_url,
                                        callback: (err, data) => {
                                            if (err) {
                                                client.tournaments.reset({
                                                    id: tournament.bracket_url,
                                                    callback: (err, data) => {
                                                        res.status(500).json({
                                                            "res": "Get Matches Failed"
                                                        })
                                                    }
                                                });
                                            }
                                            tournament.updateOne({$set : {matches: data}}).then( result => {
                                                if (result.nModified === 1){
                                                    res.status(200).json({
                                                        "res": "Tournament update"
                                                    })
                                                } else {
                                                    client.tournaments.reset({
                                                        id: tournament.bracket_url,
                                                        callback: (err, data) => {
                                                            res.status(500).json({
                                                                "res": "An Error occurred during update Match"
                                                            })
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    res.status(500).json({
                                        "res": "An Error occurred during Clear Round"
                                    })
                                }
                            })
                        }
                    });
                }
            }
        });
    }
}

exports.create = createTournament;
exports.register = register;
exports.unregister = unregister;
exports.getTournamentByState = getTournamentByState;
exports.changeTournamentState = changeTournamentState;
exports.startTournament = startTournament;
exports.getOpenMatches = getOpenMatches;
exports.initRound = initRound;
exports.getRound = getRound;
exports.validateScoreRound = validateScoreRound;
exports.clearRound = clearRound;