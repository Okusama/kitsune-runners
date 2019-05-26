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
                if (!req.body.name || !req.body.start_at || !req.body.state || !req.body.games){
                    res.status(400).json({
                        "res": "Bad request Missing Info"
                    })
                } else {
                    let championship = {
                        name: req.body.name,
                        start_at: req.body.start_at,
                        state: req.body.state,
                        games: req.body.games
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

const getChampionShipByState = (req, res) => {
    if(!req.body.token){
        res.status(401).json({
            "res": "You must be connected"
        })
    } else {
        userUtils.getApiPermission(req.body.token).then( decoded => {
            if(decoded){
                let stateFilter = utils.escapeHtml(req.body.state);
                Championship.find({state: stateFilter}, (err, championships) => {
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
                    let id = utils.escapeHtml(req.body.championship_id);
                    let state = utils.escapeHtml(req.body.championship_state);
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

exports.create = createChampionship;
exports.register = register;
exports.getChampionshipByState = getChampionShipByState;
exports.changeChampionshipState = changeChampionshipState;