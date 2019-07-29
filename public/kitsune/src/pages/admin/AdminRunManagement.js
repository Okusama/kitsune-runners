import React, {Component} from "react";
import {connect} from "react-redux";
import socketIOClient from "socket.io-client";

import {
    runActionClearMatchSelected,
    runActionGetMatchSelected, runActionRaceStopPlayerTime,
    runActionSetMatchSelected,
    runActionSetRacePlayers,
    runActionTournamentStopPlayerTime
} from "../../redux/actions";
import {
    url,
    getRound,
    initRound,
    adminStopPlayerTimer,
    validateScoreRound,
    clearRound,
    setRaceResult
} from "../../utils/Api";

import AdminMatchManagement from "../../components/admin/AdminMatchManagement";
import Timer from "../../components/layout/Timer";
import Match from "../../components/layout/Match";
import AdminStreamManagement from "../../components/admin/AdminStreamManagement";

class AdminRunManagement extends Component {

    constructor(props){
        super(props);

        this.state = {
            item: this.props.location.state.item,
            item_type:  this.props.location.state.item_type,
            token: localStorage.getItem("token")
        };

    }

    componentDidMount() {

        const socket = socketIOClient(url);

        switch (this.state.item_type) {

            case "tournament" : {

                let sendData = {
                    token: this.state.token,
                    tournament_id: this.state.item._id
                };

                getRound(sendData).then(json => {
                    return json.json();
                }).then(data => {
                    if (data.round === null){
                        this.props.runActionGetMatchSelected();
                    } else {
                        this.props.runActionSetMatchSelected(data.round);
                    }
                });

                socket.on("playerStopPlayerTimer", (time, playerId) => {
                    this.props.runActionTournamentStopPlayerTime(time, playerId);
                });

                break;

            } case "race" : {

                let racePlayers = this.state.item.players.map(player => {
                    return {
                        id: player.id,
                        pseudo: player.pseudo,
                        time: "0:00:00"
                    };
                });

                this.props.runActionSetRacePlayers(racePlayers);

                socket.on("playerStopPlayerTimer", (time, playerId) => {
                    this.props.runActionRaceStopPlayerTime(time, playerId);
                });

                break;

            } default : {
                break;
            }

        }

    }

    onStopPlayerTime = (playerId) => {

        let time = this.props.timer;
        this.props.runActionTournamentStopPlayerTime(time,playerId);
        adminStopPlayerTimer(time, playerId);

    };

    /***************** Tournament **********************/

    onLockMatches = () => {

        let sendData = {
            token: this.state.token,
            tournament_id: this.state.item._id,
            matches: this.props.matchSelected
        };

        initRound(sendData).then(json => {
            return json.json();
        }).then(data => {
           console.log(data);
        });

    }

    getTournamentPlayerList = () => {

        return this.props.matchSelected.map( match => {
            return(
                <React.Fragment>
                    <option value={match.player1.twitch_login}>{match.player1.pseudo}</option>
                    <option value={match.player2.twitch_login}>{match.player2.pseudo}</option>
                </React.Fragment>
            )
        });

    }

    onValidateScoreRound = () => {

        let matches = this.props.matchSelected;
        let winnerId;
        let score;

        for (let match of matches){

            if (match.player1.time < match.player2.time){
                winnerId = match.player1.challonge_id;
                score = "1-0";
            } else {
                winnerId = match.player2.challonge_id;
                score = "0-1";
            }

            let sendData = {
                token: this.state.token,
                tournament_id: this.state.item._id,
                match_id: match.match_id,
                winner_id: winnerId,
                score: score
            };

            validateScoreRound(sendData).then(json => {
                return json.json();
            }).then(res => {
                console.log(res);
            });

        }

        this.props.runActionClearMatchSelected();

        let sendData = {
            token: this.state.token,
            tournament_id: this.state.item._id
        };

        clearRound(sendData).then(json => {
            return json.json();
        }).then(res => {
            console.log(res);
        });

    }

    renderForTournament = () => {

        let matches = this.props.matchSelected.map( match =>
            <AdminMatchManagement
                key={match.match_id}
                player1={match.player1}
                player2={match.player2}
                onStopPlayerTime={(playerId) => this.onStopPlayerTime(playerId)}
            >
                <Match
                    matchId={match.match_id}
                    player1Pseudo={match.player1.pseudo}
                    player1Time={match.player1.time}
                    player2Pseudo={match.player2.pseudo}
                    player2Time={match.player2.time}
                />
            </AdminMatchManagement>
        );

        return(
            <React.Fragment>
                <button type="button" onClick={this.onLockMatches}>Lock Matches</button>
                <button type="button" onClick={this.onValidateScoreRound}>Validate Round</button>
                <section className="matchList">
                    {matches}
                </section>
            </React.Fragment>
        );

    }

    /***************** Race **********************/

    onValidateRace = () => {

        let racePlayersSortByTime = this.props.racePlayers.sort((a,b) => {
            return new Date("1970/01/01 " + a.time) - new Date("1970/01/01 " + b.time);
        });

        this.props.runActionSetRacePlayers(racePlayersSortByTime);

        let sendData = {
            token: this.state.token,
            race_id: this.state.item._id,
            result: racePlayersSortByTime
        };

        setRaceResult(sendData).then(json => {
            return json.json();
        }).then(res => {
            console.log(res);
        })

    }

    getRacePlayerList = () => {

        return this.state.item.players.map( player => {
            console.log(player);
           return(
             <option value={player.twitch_login}>{player.pseudo}</option>
           );
        });

    }

    renderForRace = () => {

        return(
            <React.Fragment>
                <button onClick={this.onValidateRace}>Validate Race</button>
                <ul>
                    {
                        this.props.racePlayers.map( player => {
                            return(
                              <li key={player.id}>
                                  <p>{player.pseudo}</p>
                                  <p>{player.time}</p>
                              </li>
                            );
                        })
                    }
                </ul>
            </React.Fragment>
        );

    }

    render(){

        let renderItem = null;
        let playerList = null;

        switch (this.state.item_type) {

            case "tournament" : {

                renderItem = this.renderForTournament();
                playerList = this.getTournamentPlayerList();
                break;

            } case "race" : {

                renderItem = this.renderForRace();
                playerList = this.getRacePlayerList();
                break;

            } default : {
                break;
            }

        }

        return(
            <div className="runManagement">
                <h2>Run Management</h2>
                <div className="timerManagement">
                    <Timer isControl={true}/>
                    <AdminStreamManagement playerList={playerList}/>
                </div>
                {renderItem}
            </div>
        );
    }

}

const NewAdminRunManagementWithRedux = connect( state => ({
        matchSelected: state.run.matchSelected,
        timer: state.timer.timer,
        racePlayers: state.run.racePlayers
    }),{
        runActionGetMatchSelected,
        runActionSetMatchSelected,
        runActionTournamentStopPlayerTime,
        runActionClearMatchSelected,
        runActionSetRacePlayers,
        runActionRaceStopPlayerTime
    }
)(AdminRunManagement);

export default NewAdminRunManagementWithRedux;