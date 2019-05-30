import React, {Component} from "react";
import {getChampionshipByState} from "../../utils/Api";
import ItemThumb from "../../components/layout/ItemThumb";

export default class ChampionshipList extends Component {

    constructor(props){
        super(props);
        this.state = {
            championshipState: "open",
            token: localStorage.getItem("token"),
            championshipList: []
        };
        this.getChampionship(this.state.championshipState);
    }

    setDataListState = (newElement) => {
        this.setState( prevState => ({
            data: [...prevState.data, newElement]
        }));
    }

    getChampionship = (state) => {

        let sendData = {
            token: this.state.token,
            state: state
        };
        console.log(sendData);
        getChampionshipByState(sendData).then(json => {
            return json.json();
        }).then( data => {

            if (typeof data.res !== "string"){
                this.setState({ championshipList: data.res});
            } else {
                console.log(data.res);
            }

        }).catch(err => {
            console.log(err);
        });

    }

    handleDetailClick = event => {
        this.setState({
            championshipList: [],
            championshipState: event.target.getAttribute("data-value")
        }, () => {
            this.getChampionship(this.state.championshipState);
        });

    }

    render(){

        let championshipList = this.state.championshipList.map((championship, index) =>
            <ItemThumb
                key={index}
                name={championship.name}
                startAt={championship.start_at}
                nbPlayers={championship.players.length}
                item={championship}
                itemType={"championship"}
            />
        );

        let status = this.state.championshipState;

        return (
            <div className="itemList">
                <nav>
                    <ul>
                        <li><button className={status === "open" ? "active-button-form" : "button-form"} data-value="open" onClick={this.handleDetailClick}>Open</button></li>
                        <li><button className={status === "close" ? "active-button-form" : "button-form"} data-value="close" onClick={this.handleDetailClick}>Close</button></li>
                        <li><button className={status === "finished" ? "active-button-form" : "button-form"} data-value="finished" onClick={this.handleDetailClick}>Finished</button></li>
                    </ul>
                </nav>
                <ul>
                    {championshipList}
                </ul>
            </div>
        );
    }

}