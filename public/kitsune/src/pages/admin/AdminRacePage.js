import React, {Component} from "react";
import {createRace, getRaceByState} from "../../utils/Api";
import ItemThumb from "../../components/layout/ItemThumb";

export default class AdminRacePage extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            start_at: "",
            token: localStorage.getItem("token"),
            state: "open",
            raceList: []
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
            return json.json();
        }).then( data => {

            if (typeof data.res !== "string"){
                this.setState({ raceList: data.res});
            } else {
                console.log(data.res);
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


    render(){

        let raceList = this.state.raceList.map((race, index) =>
            <ItemThumb
                key={index}
                name={race.name}
                startAt={race.start_at}
                nbPlayers={race.players.length}
                item={race}
                itemType={"race"}
                isAdmin={true}
            />
        );

        let status = this.state.state;

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
                    <button className={status === "open" ? "active-button-form" : "button-form"} data-value="open" onClick={this.handleDetailClick}>Open</button>
                    <button className={status === "close" ? "active-button-form" : "button-form"} data-value="close" onClick={this.handleDetailClick}>Close</button>
                    <button className={status === "close" ? "active-button-form" : "button-form"} data-value="finished" onClick={this.handleDetailClick}>Finished</button>
                    <h2>{this.state.state} Race</h2>
                    {raceList}
                </div>
            </div>
        );
    }

}