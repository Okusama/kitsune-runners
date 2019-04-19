import React, {Component} from "react";
import {connect} from "react-redux";

class AdminStreamManagement extends Component {

    constructor(props){
        super(props);

        this.state = {
            player1: "default",
            player2: "default",
            player3: "default",
            player4: "default"
        }

        this.streamWindows = {
            player1: null,
            player2: null,
            player3: null,
            player4: null
        };

    }

    handleChange = event => {

        this.setState({
            [event.target.name]: event.target.value
        });

        console.log(event.target);

        if (this.streamWindows[event.target.name] !== null){
            this.streamWindows[event.target.name].location = "https://player.twitch.tv/?channel=" + event.target.value;
        }

    }

    openStream = () => {

        this.streamWindows.player1 = window.open('https://player.twitch.tv/?channel=' + this.state.player1, "player1", "width=600,height=400,left=200,top=200");
        this.streamWindows.player2 = window.open('https://player.twitch.tv/?channel=' + this.state.player2, "player2", "width=600,height=400,left=200,top=200");
        this.streamWindows.player3 = window.open('https://player.twitch.tv/?channel=' + this.state.player3, "player3", "width=600,height=400,left=200,top=200");
        this.streamWindows.player4 = window.open('https://player.twitch.tv/?channel=' + this.state.player4, "player4", "width=600,height=400,left=200,top=200");

    };

    closeStream = () => {

        this.streamWindows.player1.close();
        this.streamWindows.player2.close();
        this.streamWindows.player3.close();
        this.streamWindows.player4.close();

    };

    render(){

        let players = this.props.matchSelected.map( match => {
            return(
                <React.Fragment>
                    <option value={match.player1.twitch_login}>{match.player1.pseudo}</option>
                    <option value={match.player2.twitch_login}>{match.player2.pseudo}</option>
                </React.Fragment>
            )
        });

        return(
            <div>
                <button onClick={this.openStream}>Show</button>
                <button onClick={this.closeStream}>Close</button>
                <select name="player1" value={this.state.player1} onChange={this.handleChange}>
                    <option value="default">None</option>
                    {players}
                </select>
                <select name="player2" value={this.state.player2} onChange={this.handleChange}>
                    <option value="default">None</option>
                    {players}
                </select>
                <select name="player3" value={this.state.player3} onChange={this.handleChange}>
                    <option value="default">None</option>
                    {players}
                </select>
                <select name="player4" value={this.state.player4} onChange={this.handleChange}>
                    <option value="default">None</option>
                    {players}
                </select>
            </div>
        );
    }

}

const NewAdminStreamManagementWithRedux = connect(state => ({
        matchSelected: state.run.matchSelected
    }),null
)(AdminStreamManagement);

export default NewAdminStreamManagementWithRedux;