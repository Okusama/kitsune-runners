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
            difficulty_coef: null
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
        if(this.state.difficulty_coef.length === 0) return;

        let sendData = {
            token: this.state.token,
            championship_id: this.state.championship._id,
            game: this.state.game,
            min: this.state.min,
            max: this.state.max,
            difficulty_coef: this.state.difficulty_coef
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
            difficulty_coef: param.difficulty_coef,
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
                    <select name="difficulty_coef" id="difficulty_coef" onChange={this.handleChange} value={this.state.difficulty_coef}>
                        <option value={1}>Easy</option>
                        <option value={2}>Medium</option>
                        <option value={3}>Hard</option>
                    </select>
                    <button type="button" onClick={this.onSubmitGameParam}>Submit</button>
                </form>
            </div>
        );
    }

    render(){

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