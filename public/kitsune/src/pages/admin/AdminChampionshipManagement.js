import React, {Component} from "react";
import {updateGameParam} from "../../utils/Api";

export default class AdminChampionshipManagement extends Component {

    constructor(props){
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            championship: this.props.location.state.data,
            modalGameParamContent: null,
            modalIsVisible: false,
            game: null,
            min: null,
            max: null,
            level_nb: null
        }
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onOpenParamsWindow = (gameName) => {

        this.setState({
            modalIsVisible: true
        });

        this.setGameParamModal(gameName);

    }

    onSubmitGameParam = () => {

        if(this.state.game.length === 0) return;
        if(this.state.min.length === 0) return;
        if(this.state.max.length === 0) return;
        if(this.state.level_nb.length === 0) return;

        let sendData = {
            token: this.state.token,
            championship_id: this.state.championship._id,
            game: this.state.game,
            min: this.state.max,
            max: this.state.max,
            level_nb: this.state.level_nb
        };

        updateGameParam(sendData).then(json => {
            return json.json();
        }).then(res => {
            console.log(res);
        })

    }

    setGameParamModal = (gameName) => {

        let param = this.state.championship.params[0][gameName];

        this.setState({
            game: gameName,
            min: param.min,
            max: param.max,
            level_nb: param.level_nb,
        });

    }

    renderGameParamModal = () => {
        return(
            <div>
                <h4>Game Param</h4>
                <h4>{this.state.game}</h4>
                <form>
                    <label htmlFor="min">Min : </label>
                    <input id="min" name="min" value={this.state.min} onChange={this.handleChange} type="text"/>
                    <label htmlFor="max">Max : </label>
                    <input type="text" name="max" id="max" onChange={this.handleChange} value={this.state.max}/>
                    <label htmlFor="level_nb">Level Number : </label>
                    <input type="number" name="level_nb" id="level_nb" onChange={this.handleChange} value={this.state.level_nb}/>
                    <button type="button" onClick={this.onSubmitGameParam}>Submit</button>
                </form>
            </div>
        );
    }

    render(){

        //Calcul Nb Palier
        // diff = jeu.max - jeu.min

        let params = [
            {
                "jeu1": {
                    "min": "0:10:00",
                    "max": "0:20:00",
                    "level_nb": 3,
                    "level_param": {
                        "1" : {
                            "min": {
                                "time": "0:10:00",
                                "point": "200"
                            },
                            "max": {
                                "time": "0:13:20",
                                "point": "133"
                            }
                        },
                        "2" : {
                            "min": {
                                "time": "0:13:21",
                                "point": "132"
                            },
                            "max": {
                                "time": "0:16:40",
                                "point": "67"
                            }
                        },
                        "3" : {
                            "min": {
                                "time": "0:16:41",
                                "point": "66"
                            },
                            "max": {
                                "time": "0:20:00",
                                "point": "0"
                            }
                        }
                    }
                },
                "jeu2": {
                    "min": "0:00:00",
                    "max": "0:00:00",
                    "level_nb": 0
                },
                "jeu3": {
                    "min": "0:00:00",
                    "max": "0:00:00",
                    "level_nb": 0
                }
            }
        ];

        let modal = null;

        if (this.state.modalIsVisible) {
            modal = this.renderGameParamModal();
        }

        return(
            <div>
                <h3>ChampionShip Management</h3>
                <button>Validate Time</button>
                <table>
                    <tbody>
                        {
                            this.state.championship.games.map(game => {
                                return(
                                    <tr key={game}>
                                        <td>{game}</td>
                                        <td>
                                            <button onClick={() => this.onOpenParamsWindow(game)} data-game={game}>Params</button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <div>
                    {modal}
                </div>
            </div>
        )
    }

}