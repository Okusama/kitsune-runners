import React, {Component} from "react";
import {List} from "../../components/layout/List";
import {registerChampionship, unregisterChampionship} from "../../utils/Api";
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

    onUnregister = () => {

        let sendData = {
            token: this.state.token,
            championship_id: this.state.championship._id
        };

        unregisterChampionship(sendData).then(json => {
            return json.json()
        }).then(res => {
            console.log(res);
        });

    }

    render(){

        let playerList = this.state.championship.players.map(player => {
            return {
                key: player.id,
                data: player.pseudo
            };
        });

        return(
            <div className="championshipDetail">
                <Link to={{pathname: "/public/championship/submitTime", state:{championship: this.state.championship}}}>Validation Time</Link>
                <div>
                    <h3>Name: {this.state.championship.name}</h3>
                    <p>Start Date: {new Date().toDateString(this.state.championship.start_at)}</p>
                    <p>Number of registered: {this.state.championship.players.length}</p>
                    <button type="button" onClick={this.onRegister}>Register</button>
                    <button type="button" onClick={this.onUnregister}>Unregister</button>
                    <p>Players List :</p>
                    <List data={playerList}/>
                    <table>
                        <thead>
                        <tr>
                            <th>Player</th>
                            <th>Total</th>
                            {
                                this.state.championship.games.map(game => {
                                    return(
                                        <th key={game}>{game}</th>
                                    );
                                })
                            }
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.championship.results.map(run => {

                                let user = this.state.championship.players.filter(player => player.id === run.user_id)[0];

                                return(
                                    <tr key={user.id}>
                                        <td>{user.pseudo}</td>
                                        <td>{run.total}</td>
                                        {
                                            run.scores.map((game) => {
                                                return(
                                                    <td>{game.score}</td>
                                                );
                                            })
                                        }
                                    </tr>
                                );

                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}