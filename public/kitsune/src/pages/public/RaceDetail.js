import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {registerRace, unregisterRace} from "../../utils/Api";

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
                            <a className="button-form" href="#" onClick={this.onRegister}>Register</a>
                        ) : [
                            <a className="button-form" href="#" onClick={this.onUnregister}>Unregister</a>
                        ]
                    }
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
        user: state.user.user
    }),null
)(RaceDetail);

export default NewRaceDetailWithRedux;