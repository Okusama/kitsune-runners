import React, {Component} from "react";
import {registerTournament, unregisterTournament} from "../../utils/Api";
import {Link} from "react-router-dom";
import moment from "moment";
import {connect} from "react-redux";

class TournamentDetail extends Component {

    constructor(props){
        super(props);
        //TODO: Change localStorage => Cookie
        this.state = {
            tournament: this.props.location.state.item,
            token: localStorage.getItem("token"),
        }
    }

    onRegister = () => {

        let sendData = {
            token: this.state.token,
            tournament_id: this.state.tournament._id
        };

        registerTournament(sendData).then(json => {
            return json.json()
        }).then(res => {
            console.log(res);
            if (res.hasOwnProperty("tournament")) {

                this.setState({
                    tournament: res.tournament
                })

            }
        });

    }

    onUnregister = () => {

        let sendData = {
            token: this.state.token,
            tournament_id: this.state.tournament._id
        };

        unregisterTournament(sendData).then(json => {
            return json.json();
        }).then(res => {
           console.log(res);

            if (res.hasOwnProperty("tournament")) {

                this.setState({
                    tournament: res.tournament
                })

            }

        });

    };

    constructTournamentDetail = tournament => {

        let hasRegister = tournament.players.filter(player => player.id === this.props.user.id);

        return(
            <div>
                <section>
                    <h3>{tournament.name}</h3>
                    <p>{moment(tournament.startAt).format("DD/MM/YYYY HH:MM")}</p>
                </section>
                <p>Players : {tournament.players.length}</p>
                <p>Players List :</p>
                <ul>
                    {tournament.players.map( player =>
                        <li key={player.id}>{player.pseudo}</li>
                    )}
                </ul>
                <section>
                    {
                        hasRegister.length === 0 ? (
                            <a className="button-form" href="#" onClick={this.onRegister}>Register</a>
                        ) : (
                            <a className="button-form" href="#" onClick={this.onUnregister}>Unregister</a>
                        )
                    }
                    <Link className="button-form" to={{pathname: "/public/tournament/matches", state: {id: tournament._id}}}>Matches</Link>
                </section>
            </div>
        );
    }

    renderBracket = (url) => {

        let bracketUrl = "https://challonge.com/fr/"+ url +"/module";

        return(
            <iframe src={bracketUrl} title={url} width="100%" height="500" frameBorder="0" scrolling="auto"></iframe>
        );

    }

    render(){

        let bracket = null;

        if (this.state.tournament.hasOwnProperty("bracket_url")) {
            bracket = this.renderBracket(this.state.tournament.bracket_url)
        }

        return(
            <div className="tournamentDetail">
                {this.constructTournamentDetail(this.state.tournament)}
                {bracket}
            </div>
        );
    }

}

const NewTournamentDetailWithRedux = connect(state => ({
        user: state.user.user
    }),null
)(TournamentDetail);

export default NewTournamentDetailWithRedux;