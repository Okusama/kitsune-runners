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

    handleDetailClick = event => {

        this.setState({
            data: [],
            raceState: event.target.getAttribute("data-value")
        }, () => {
            this.getRaces(this.state.raceState);
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
                isAdmin={false}
            />
        );

        let status = this.state.raceState;

        return(
          <div className="itemList">
              <nav>
                  <ul>
                      <li><button className={status === "open" ? "active-button-form" : "button-form"} data-value="open" onClick={this.handleDetailClick}>Open</button></li>
                      <li><button className={status === "close" ? "active-button-form" : "button-form"} data-value="close" onClick={this.handleDetailClick}>Close</button></li>
                      <li><button className={status === "finished" ? "active-button-form" : "button-form"} data-value="finished" onClick={this.handleDetailClick}>Finished</button></li>
                  </ul>
              </nav>
              <ul>
                  {raceList}
              </ul>
          </div>
        );
    }

}