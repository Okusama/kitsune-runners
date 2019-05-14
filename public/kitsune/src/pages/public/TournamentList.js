import React, {Component} from "react";
import {getTournamentByState} from "../../utils/Api";
import TournamentThumb from "../../components/layout/TournamentThumb";

export default class TournamentList extends Component {

    constructor(props){
        super(props);
        this.state = {
            tournamentState: "open",
            token: localStorage.getItem("token"),
            tournamentList: []
        };
        this.getTournament(this.state.tournamentState);
    }

    getTournament = (state) => {

        let sendData = {
            token: this.state.token,
            state: state
        };

        getTournamentByState(sendData).then(json => {
            return json.json();
        }).then( data => {

            if (typeof data.res !== "string"){
                this.setState({ tournamentList: data.res});
            } else {
                console.log(data.res);
            }


        }).catch(err => {
            console.log(err);
        });

    }

    handleDetailClick = event => {

        console.log(event.target.getAttribute("data-value"))
        this.setState({
            data: [],
            tournamentState: event.target.getAttribute("data-value")
        }, () => {
            this.getTournament(this.state.tournamentState);
        });

    }

    render(){

        let tournamentList = this.state.tournamentList.map((tournament, index) =>
            <TournamentThumb
                key={index}
                name={tournament.name}
                startAt={tournament.start_at}
                nbPlayers={tournament.players.length}
                tournament={tournament}
            />
        );

        let status = this.state.tournamentState;

        return (
            <div className="tournamentList">
                <nav>
                    <ul>
                        <li><button className={status === "open" ? "active-button-form" : "button-form"} data-value="open" onClick={this.handleDetailClick}>Open</button></li>
                        <li><button className={status === "close" ? "active-button-form" : "button-form"} data-value="close" onClick={this.handleDetailClick}>Close</button></li>
                        <li><button className={status === "finished" ? "active-button-form" : "button-form"} data-value="finished" onClick={this.handleDetailClick}>Finished</button></li>
                    </ul>
                </nav>
                <ul>
                    {tournamentList}
                </ul>
            </div>
        );
    }
}