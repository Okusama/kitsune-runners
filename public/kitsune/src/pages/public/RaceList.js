import React, {Component} from "react"
import {getRaceByState} from "../../utils/Api";
import ItemThumb from "../../components/layout/ItemThumb";

export default class RaceList extends Component {

    constructor(props){
        super(props);
        this.state = {
            raceState: "open",
            token: localStorage.getItem("token"),
            raceList: []
        };
        this.getRaces(this.state.raceState);
    }

    getRaces = (state) => {
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

    render() {

        let raceList = this.state.raceList.map((race, index) =>
            <ItemThumb
                key={index}
                name={race.name}
                startAt={race.start_at}
                nbPlayers={race.players.length}
                item={race}
                itemType={"race"}
            />
        );

        return(
          <div>
              <h2>Race List</h2>
              <ul>
                  {raceList}
              </ul>
          </div>
        );
    }

}