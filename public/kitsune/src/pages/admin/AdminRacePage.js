import React, {Component} from "react";
import {createRace, createTournament} from "../../utils/Api";

export default class AdminRacePage extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            start_at: "",
            token: localStorage.getItem("token")
        }
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
        }

        console.log(sendData);

        createRace(sendData).then(json => {
            return json.json();
        }).then(res => {
            //TODO: afficher response
            console.log(res);
        });
    }

    render(){
        return(
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
        );
    }

}