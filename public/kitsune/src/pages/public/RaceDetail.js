import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {registerRace, unregisterRace} from "../../utils/Api";
import {Link} from "react-router-dom";

class RaceDetail extends Component{

    constructor(props){
        super(props);
        //TODO: Change localStorage => Cookie
        this.state = {
            race: this.props.location.state.item,
            token: localStorage.getItem("token"),
        }
    }

    onRegister = () => {

        let sendData = {
            token: this.state.token,
            race_id: this.state.race._id
        }

        registerRace(sendData).then(json => {
            return json.json();
        }).then( res => {

            if (res.hasOwnProperty("race")){

                this.setState({
                    race: res.race
                })

            }

        });

    }

    onUnregister = () => {

        let sendData = {
            token: this.state.token,
            race_id: this.state.race._id
        }

        unregisterRace(sendData).then(json => {
            return json.json();
        }).then( res => {
            console.log(res);
            if (res.hasOwnProperty("race")){

                this.setState({
                    race: res.race
                })

            }

        });

    }

    renderRaceDetail = race => {

        let hasRegister = race.players.filter(player => player.id === this.props.user.id);
        console.log(race.players);
        console.log(this.props.user);

        return(
            <div>
                <section>
                    <h3>{race.name}</h3>
                    <p>{moment(race.startAt).format("DD/MM/YYYY HH:MM")}</p>
                </section>
                <p>Players : {race.players.length}</p>
                <p>Players List :</p>
                <ul>
                    {race.players.map( player =>
                        <li key={player.id}>{player.pseudo}</li>
                    )}
                </ul>
                <section>
                    {
                        hasRegister.length === 0 ? (
                            <button className="button-form" onClick={this.onRegister}>Register</button>
                        ) : [
                            <button className="button-form" onClick={this.onUnregister}>Unregister</button>
                        ]
                    }
                    <Link className="button-form" to={{pathname: "/public/race/match", state: {race: race}}}>Matches</Link>
                </section>
            </div>
        )

    }

    render(){
        return(
          <div className="raceDetail">
              {this.renderRaceDetail(this.state.race)}
          </div>
        );
    }

}

const NewRaceDetailWithRedux = connect(state => ({
        user: state.user
    }),null
)(RaceDetail);

export default NewRaceDetailWithRedux;