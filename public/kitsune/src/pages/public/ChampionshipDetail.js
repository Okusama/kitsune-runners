import React, {Component} from "react";
import {List} from "../../components/layout/List";
import {registerChampionship} from "../../utils/Api";
import {Link} from "react-router-dom";

export default class ChampionshipDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            championship: this.props.location.state.data,
            token: localStorage.getItem("token")
        }
    }

    onRegister = () => {

        let sendData = {
            token: this.state.token,
            championship_id: this.state.championship._id
        };

        registerChampionship(sendData).then(json => {
            return json.json()
        }).then(res => {
            console.log(res);
        });

    }

    createChampionshipDetail = data => {
        const playerList = data.players.map(player => {
            return {
                key: player.id,
                data: player.pseudo
            };
        });
        const gameList = data.games.map(game => {
            return {
                key:game,
                data: game
            }
        });
        let date = new Date().toDateString(data.start_at);
        return(
            <div>
                <h3>Name: {data.name}</h3>
                <p>Start Date: {date}</p>
                <p>Number of registered: {data.players.length}</p>
                <p>Players List :</p>
                <List data={playerList}/>
                <p>Games List :</p>
                <List data={gameList}/>
                <button type="button" onClick={this.onRegister} data-id>Register</button>
            </div>
        );
    }

    render(){
        return(
            <div className="championshipDetail">
                <Link to={{pathname: "/public/championship/validateTime", state:{championship: this.state.championship}}}>Validation Time</Link>
                {this.createChampionshipDetail(this.state.championship)}
            </div>
        );
    }

}