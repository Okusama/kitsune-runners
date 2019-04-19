import React, {Component} from "react";
import {connect} from "react-redux";
import socketIOClient from "socket.io-client";

import {
    runActionClearMatchSelected,
    runActionGetMatchSelected,
    runActionSetMatchSelected,
    runActionStopPlayerTime
} from "../../redux/actions";
import {getRound, initRound, adminStopPlayerTimer, validateScoreRound, clearRound} from "../../utils/Api";

import AdminMatchManagement from "../../components/admin/AdminMatchManagement";
import Timer from "../../components/layout/Timer";
import Match from "../../components/layout/Match";
import AdminStreamManagement from "../../components/admin/AdminStreamManagement";

class AdminRunManagement extends Component {

    constructor(props){
        super(props);

        this.state = {
            tournament: this.props.location.state.tournament,
            token: localStorage.getItem("token")
        };

    }

    componentDidMount() {

        let sendData = {
            token: this.state.token,
            tournament_id: this.state.tournament._id
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

        const socket = socketIOClient("https://aqueous-taiga-46436.herokuapp.com");

        socket.on("playerStopPlayerTimer", (time, playerId) => {
            this.props.runActionStopPlayerTime(time, playerId);
        });

    }

    onLockMatches = () => {

        let sendData = {
            token: this.state.token,
            tournament_id: this.state.tournament._id,
            matches: this.props.matchSelected
        };

        initRound(sendData).then(json => {
            return json.json();
        }).then(data => {
           console.log(data);
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
                tournament_id: this.state.tournament._id,
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
            tournament_id: this.state.tournament._id
        };

        clearRound(sendData).then(json => {
            return json.json();
        }).then(res => {
            console.log(res);
        });

    }

    onStopPlayerTime = (playerId) => {

        let time = this.props.timer;
        this.props.runActionStopPlayerTime(time,playerId);
        adminStopPlayerTimer(time, playerId);

    };

    render(){

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
            <div className="runManagement">
                <h2>Run Management</h2>
                <button type="button" onClick={this.onLockMatches}>Lock Matches</button>
                <button type="button" onClick={this.onValidateScoreRound}>Validate Round</button>
                <div className="timerManagement">
                    <Timer isControl={true}/>
                </div>
                <section className="matchList">
                    {matches}
                </section>
                <AdminStreamManagement/>
            </div>
        );
    }

}

const NewAdminRunManagementWithRedux = connect( state => ({
        matchSelected: state.run.matchSelected,
        timer: state.timer.timer
    }),{
        runActionGetMatchSelected,
        runActionSetMatchSelected,
        runActionStopPlayerTime,
        runActionClearMatchSelected
    }
)(AdminRunManagement);

export default NewAdminRunManagementWithRedux;