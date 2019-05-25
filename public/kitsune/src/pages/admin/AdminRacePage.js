import React, {Component} from "react";
import {createRace, getRaceByState} from "../../utils/Api";
import {Link} from "react-router-dom";
import {List} from "../../components/layout/List";

export default class AdminRacePage extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            start_at: "",
            token: localStorage.getItem("token"),
            state: "open",
            data: []
        }
        this.getRace(this.state.state);
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmitNewRace = () => {

        if(this.state.name.length === 0) return;
        if(this.state.start_at.length === 0) return;

        let sendData = {
            name: this.state.name,
            start_at: this.state.start_at,
            token: this.state.token
        };

        createRace(sendData).then(json => {
            return json.json();
        }).then(res => {
            //TODO: afficher response
            console.log(res);
        });
    }

    getRace = (state) => {

        let sendData = {
            token: this.state.token,
            state: state
        };
        getRaceByState(sendData).then(json => {
            console.log(json);
            return json.json();
        }).then( res => {
            let datas = res.res;
            console.log(datas);
            for(let data in datas){
                let tournament = datas[data];
                let newElement = {
                    key: tournament._id,
                    data: this.renderAdminRaceItemList(tournament, state)
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

    renderAdminRaceItemList = (data, state) => {
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
                <Link to={{pathname : "/admin/run/management", state: {item: data, item_type: "race"}}}>Management</Link>
                <form>
                    {combo}
                    { state !== "finished" ? <button type="button" data-id={data._id} onClick={this.handleSubmitChangeTournamentState}>Send</button> : false}
                </form>
            </div>
        );
    }

    render(){
        return(
            <div>
                <div>
                    <h2>Create race</h2>
                    <form>
                        <label htmlFor="name">
                            Name :
                        </label>
                        <input id="name" name="name" value={this.state.name} onChange={this.handleChange} type="text"/>
                        <label htmlFor="start_at">
                            Start Date :
                        </label>
                        <input id="start_at" name="start_at" value={this.state.start_at} onChange={this.handleChange} type="date"/>
                        <button className="button-kr gradient" type="button" onClick={this.handleSubmitNewRace}>Send</button>
                    </form>
                </div>
                <div>
                    <button data-value="open" onClick={this.handleDetailClick}>Open</button>
                    <button data-value="close" onClick={this.handleDetailClick}>Close</button>
                    <button data-value="finished" onClick={this.handleDetailClick}>Finished</button>
                    <h2>{this.state.state} Race</h2>
                    <List data={this.state.data}/>
                </div>
            </div>
        );
    }

}