import React, {Component} from "react";
import {changeTournamentState, createTournament, getTournamentByState} from "../../utils/Api";
import {List} from "../../components/layout/List";
import {Link} from "react-router-dom";
import ItemThumb from "../../components/layout/ItemThumb";

export default class AdminTournamentPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            start_at: "",
            token: localStorage.getItem("token"),
            state: "open",
            tournamentList: [],
            state_combo: "",
            tournament_id: ""
        };
        this.getTournaments(this.state.state);
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmitNewTournament = () => {

        if(this.state.name.length === 0) return;
        if(this.state.start_at.length === 0) return;

        let sendData = {
            name: this.state.name,
            start_at: this.state.start_at,
            token: this.state.token
        };

        createTournament(sendData).then(json => {
            return json.json();
        }).then(res => {
            //TODO: afficher response
            console.log(res);
        });
    }

    handleSubmitChangeTournamentState = event => {

        if(this.state.state_combo.length === 0) return;

        let sendData = {
            token: this.state.token,
            tournament_state: this.state.state_combo,
            tournament_id: event.target.getAttribute("data-id")
        };

        changeTournamentState(sendData).then(json => {
            return json.json();
        }).then(res => {
            console.log(res);
        });

    }

    getTournaments = (state) => {
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

        this.setState({
            data: [],
            state: event.target.getAttribute("data-value")
        }, () => {
            this.getTournaments(this.state.state);
        });

    }

    render(){

        let tournamentList = this.state.tournamentList.map((tournament, index) =>
            <ItemThumb
                key={index}
                name={tournament.name}
                startAt={tournament.start_at}
                nbPlayers={tournament.players.length}
                item={tournament}
                itemType={"tournament"}
                isAdmin={true}
            />
        );

        let status = this.state.state;

        return(
            <div className="adminTournament">
                <div>
                    <h2>Create Tournament</h2>
                    <form>
                        <label htmlFor="name">
                            Name :
                        </label>
                        <input id="name" name="name" value={this.state.name} onChange={this.handleChange} type="text"/>
                        <label htmlFor="start_at">
                            Start Date :
                        </label>
                        <input id="start_at" name="start_at" value={this.state.start_at} onChange={this.handleChange} type="date"/>
                        <button className="button-kr gradient" type="button" onClick={this.handleSubmitNewTournament}>Send</button>
                    </form>
                </div>
                <div>
                    <button className={status === "open" ? "active-button-form" : "button-form"} data-value="open" onClick={this.handleDetailClick}>Open</button>
                    <button className={status === "close" ? "active-button-form" : "button-form"} data-value="close" onClick={this.handleDetailClick}>Close</button>
                    <button className={status === "finished" ? "active-button-form" : "button-form"} data-value="finished" onClick={this.handleDetailClick}>Finished</button>
                    <h2>{this.state.state} tournament</h2>
                    {tournamentList}
                </div>
            </div>
        );
    }

}