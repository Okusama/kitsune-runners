import React, {Component} from "react";
import {changeChampionshipState, createChampionship, getChampionshipByState} from "../../utils/Api";
import {Link} from "react-router-dom";
import {List} from "../../components/layout/List";

export default class AdminChampionshipPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            start_at: "",
            token: localStorage.getItem("token"),
            state: "open",
            data: [],
            state_combo: "",
            championship_id: "",
            games: ""
        };
        this.getChampionships(this.state.state);
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmitNewChampionship = () => {

        if(this.state.name.length === 0) return;
        if(this.state.start_at.length === 0) return;
        if(this.state.games.length === 0) return;

        let games = this.state.games.split(",");
        let params = {};
        for (let game of games){
            params[game] = {
                min: "0:00:00",
                max: "0:00:00",
                difficulty_coef: 1
            }
        }

        let sendData = {
            name: this.state.name,
            start_at: this.state.start_at,
            token: this.state.token,
            state: "open",
            games: games,
            params: params
        };

        createChampionship(sendData).then(json => {
            return json.json();
        }).then(res => {
            //TODO: afficher response
            console.log(res);
        });
    }

    handleSubmitChangeChampionshipState = (event) => {

        if(this.state.state_combo.length === 0) return;

        let sendData = {
            token: this.state.token,
            championship_state: this.state.state_combo,
            championship_id: event.target.getAttribute("data-id")
        };

        changeChampionshipState(sendData).then(json => {
            return json.json();
        }).then(res => {
            console.log(res);
        });

    }

    getChampionships = (state) => {

        let sendData = {
            token: this.state.token,
            state: state
        };

        getChampionshipByState(sendData).then(json => {
            return json.json();
        }).then( res => {
            let datas = res.res;
            for(let data in datas){
                let championship = datas[data];
                let newElement = {
                    key: championship._id,
                    data: this.constructAdminChampionshipItemList(championship, state)
                };
                this.setDataListState(newElement);
            }
        }).catch(err => {
            console.log(err);
        });

    }

    setDataListState = (newElement) => {
        this.setState( prevState => ({
            data: [...prevState.data, newElement]
        }));
    }

    handleDetailClick = event => {
        this.setState({
            data: [],
            state: event.target.getAttribute("data-value")
        }, () => {
            this.getChampionships(this.state.state);
        });

    }

    constructAdminChampionshipItemList = (data, state) => {
        let combo;
        switch (state){
            case "open":
                this.setState({
                    state_combo: "close"
                });
                combo = <select name="state_combo" onChange={this.handleChange}>
                    <option value="close">Close</option>
                    <option value="finished">Finished</option>
                </select>;
                break;
            case "close":
                this.setState({
                    state_combo: "finished"
                });
                combo = <select name="state_combo" onChange={this.handleChange}>
                    <option value="finished">Finished</option>
                </select>;
                break;
            default:
                break;
        }

        return(
            <div key={data._id}>
                <h3>{data.name}</h3>
                <p>{data.start_at}</p>
                <p>{data.players.length}</p>
                <Link to={{pathname: "/admin/championship/management", state: {data: data}}}>Detail</Link>
                <form>
                    {combo}
                    { state !== "finished" ? <button type="button" data-id={data._id} onClick={this.handleSubmitChangeChampionshipState}>Send</button> : false}
                </form>
            </div>
        );
    }

    render(){
        return(
            <div>
                <div>
                    <h2>Create Championship</h2>
                    <form>
                        <label htmlFor="name">
                            Name :
                        </label>
                        <input id="name" name="name" value={this.state.name} onChange={this.handleChange} type="text"/>
                        <label htmlFor="start_at">
                            Start Date :
                        </label>
                        <input id="start_at" name="start_at" value={this.state.start_at} onChange={this.handleChange} type="date"/>
                        <label htmlFor="games">
                            Games :
                        </label>
                        <textarea id="games" name="games" value={this.state.games} onChange={this.handleChange}>
                        </textarea>
                        <button className="button-kr gradient" type="button" onClick={this.handleSubmitNewChampionship}>Send</button>
                    </form>
                </div>
                <div>
                    <button data-value="open" onClick={this.handleDetailClick}>Open</button>
                    <button data-value="close" onClick={this.handleDetailClick}>Close</button>
                    <button data-value="finished" onClick={this.handleDetailClick}>Finished</button>
                    <h2>{this.state.state} championship</h2>
                    <List data={this.state.data}/>
                </div>
            </div>
        );
    }

}