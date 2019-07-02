import React , {Component} from "react";
import Timer from "../../components/layout/Timer";
import {connect} from "react-redux";
import {runActionRaceStopPlayerTime, runActionSetRacePlayers} from "../../redux/actions";
import {url, playerStopPlayerTimer} from "../../utils/Api";
import socketIOClient from "socket.io-client";

class RaceMatch extends Component {

    constructor(props){
        super(props);
        this.state = {
            race: this.props.location.state.race
        }
    }

    componentDidMount() {

        const socket = socketIOClient(url);

        socket.on("adminStopPlayerTimer", (time, playerId) => {
            this.props.runActionRaceStopPlayerTime(time, playerId);
        });

        socket.on("playerStopPlayerTimer", (time, playerId) => {
            if(playerId !== this.props.user.id) {
                this.props.runActionRaceStopPlayerTime(time, playerId);
            }
        });

        let racePlayers = this.state.race.players.map(player => {
            return {
                id: player.id,
                pseudo: player.pseudo,
                time: "0:00:00"
            };
        });

        this.props.runActionSetRacePlayers(racePlayers);

    }

    onPlayerStopTimer = () => {

        let time = this.props.timer;
        let playerId = this.props.user.id;

        this.props.runActionRaceStopPlayerTime(time, playerId);
        playerStopPlayerTimer(time, playerId);

    }

    render(){

        let playerList = this.props.racePlayers.map(player => {
           return(
               <li key={player.id}>
                   <p>{player.pseudo}</p>
                   <p>{player.time}</p>
               </li>
           );
        });

        return(
          <div className="raceMatches">
              <div>
                  <button className="button-form" onClick={this.onPlayerStopTimer}>Stop you're time</button>
                  <Timer isControl={false}/>
              </div>
              <div className="playerList">
                  <ul>
                      {playerList}
                  </ul>
              </div>
          </div>
        );
    }

}

const NewRaceMatchWithRedux = connect(state => ({
        user: state.user.user,
        racePlayers: state.run.racePlayers,
        timer: state.timer.timer
    }),{
        runActionSetRacePlayers,
        runActionRaceStopPlayerTime
    }
)(RaceMatch);

export default NewRaceMatchWithRedux;