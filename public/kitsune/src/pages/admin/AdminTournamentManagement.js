import React, { Component } from "react";
import {getOpenMatches, startTournament} from "../../utils/Api";
import {Link} from "react-router-dom";
import Match from "../../components/layout/Match";
import {connect} from "react-redux";
import {runActionGetMatches} from "../../redux/actions";

//TODO: Verif state tournament / Select match / Launch Match
// Option launch tournament / checkin

class AdminTournamentManagement extends Component {

    constructor(props){
        super(props);
        this.state = {
            tournament: this.props.location.state.item,
            token: localStorage.getItem("token"),
            bracket: null,
        };
    }

    componentDidMount() {
        this.getBracket();
        this.getOpenMatches();
    }

    getBracket = () => {
        if(this.state.tournament.hasOwnProperty("bracket_url")){
            this.setState({
                bracket: this.renderBracket(this.state.tournament.bracket_url)
            })
        }
    }

    onStartTournament = () => {

        let sendData = {
            token: this.state.token,
            tournament_id: this.state.tournament._id
        };

        startTournament(sendData).then(json => {
            return json.json();
        }).then(res => {
            console.log(res);
        });

    }

    getOpenMatches = () => {

        let sendData = {
            token: this.state.token,
            tournament_id: this.state.tournament._id
        };

        getOpenMatches(sendData).then(json => {
            return json.json();
        }).then(res => {

            let matches = res.data;
            this.props.runActionGetMatches(matches);

        })

    }

    renderBracket = (url) => {

        let bracketUrl = "https://challonge.com/fr/"+ url +"/module";

        return(
            <iframe src={bracketUrl} title={url} width="100%" height="500" frameBorder="0" scrolling="auto"></iframe>
        );

    }


    render(){

        console.log(this.state.tournament);

        let matches = this.props.matchList.map( match =>
            <Match
                key={match.match_id}
                matchId={match.match_id}
                isSelected={match.isSelected}
                player1Pseudo={match.player1.pseudo}
                player2Pseudo={match.player2.pseudo}
            />
        );

        let bracket = this.state.bracket;

        return(
            <div className="adminTournamentManagement">
                <h4>Tournament Management</h4>
                <p>{this.state.tournament.name}</p>
                <button className="button-form" type="button" onClick={this.onStartTournament}>Start Tournament</button>
                {bracket}
                <section>
                    <Link className="button-form" to={{pathname : "/admin/run/management", state: {item: this.state.tournament, item_type: "tournament"}}}>Manage Race</Link>
                    {matches}
                </section>
            </div>
        );

    }
}

const NewAdminTournamentManagementWithRedux = connect( state => ({
        matchList: state.run.matchList
    }),{
        runActionGetMatches
    }
)(AdminTournamentManagement);

export default NewAdminTournamentManagementWithRedux;