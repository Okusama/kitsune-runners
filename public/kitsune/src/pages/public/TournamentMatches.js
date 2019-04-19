import React, {Component} from "react";
import {connect} from "react-redux";
import socketIOClient from "socket.io-client";

import {getRound, playerStopPlayerTimer} from "../../utils/Api";
import {runActionSetMatchSelected, runActionStopPlayerTime} from "../../redux/actions";

import Match from "../../components/layout/Match";
import Timer from "../../components/layout/Timer";

class TournamentMatches extends Component {

    constructor(props){

        super(props);
        this.state = {
            tournament_id: this.props.location.state.id,
            token: localStorage.getItem("token"),
            matchList: []
        };

    }

    componentDidMount() {

        //Init Socket listener for timer
        const socket = socketIOClient("https://aqueous-taiga-46436.herokuapp.com");

        socket.on("adminStopPlayerTimer", (time, playerId) => {
            this.props.runActionStopPlayerTime(time, playerId);
        });

        socket.on("playerStopPlayerTimer", (time, playerId) => {
            if(playerId !== this.props.user.id) {
                this.props.runActionStopPlayerTime(time, playerId);
            }
        });

        this.getRound();

    }

    getRound = () => {

        let sendData = {
            token: this.state.token,
            tournament_id: this.state.tournament_id
        }

        getRound(sendData).then(json => {
            return json.json();
        }).then(data => {
            if (data.round === null){

            } else {
                this.props.runActionSetMatchSelected(data.round);
            }
        });

    }

    onPlayerStopTimer = () => {

        let time = this.props.timer;
        let playerId = this.props.user.id;

        this.props.runActionStopPlayerTime(time, playerId);
        playerStopPlayerTimer(time, playerId);

    }

    render(){

        let matches = this.props.matchSelected.map(match =>
            <Match
                key={match.match_id}
                matchId={match.match_id}
                player1Pseudo={match.player1.pseudo}
                player1Time={match.player1.time}
                player2Pseudo={match.player2.pseudo}
                player2Time={match.player2.time}
            />
        );

        return(
            <div className="tournamentMatches">
                <div>
                    <button className="button-form" onClick={this.onPlayerStopTimer}>Stop you're time</button>
                    <Timer isControl={false}/>
                </div>
                <div className="matchList">
                    {matches}
                </div>
            </div>
        );
    }

}

const NewTournamentMatchesWithRedux = connect(state => ({
        user: state.user.user,
        matchSelected: state.run.matchSelected,
        timer: state.timer.timer
    }),{
        runActionSetMatchSelected,
        runActionStopPlayerTime
    }
)(TournamentMatches);

export default NewTournamentMatchesWithRedux;