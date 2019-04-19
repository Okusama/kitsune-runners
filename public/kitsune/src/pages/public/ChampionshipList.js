import React, {Component} from "react";
import {getChampionshipByState} from "../../utils/Api";
import {List} from "../../components/layout/List";
import {Link} from "react-router-dom";

export default class ChampionshipList extends Component {

    constructor(props){
        super(props);
        this.state = {
            state: "open",
            token: localStorage.getItem("token"),
            data: []
        };
        this.handleDetailClick.bind(this);
        this.getChampionship(this.state.state);
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
        getChampionshipByState(sendData).then(json => {
            return json.json();
        }).then( res => {
            console.log(res);
            let datas = res.res;
            for(let data in datas){
                let championship = datas[data];
                let newElement = {
                    key: championship._id,
                    data: this.constructChampionshipItemList(championship)
                };
                this.setDataListState(newElement);
            }

        }).catch(err => {
            console.log(err);
        });

    }

    constructChampionshipItemList = data => {
        return(
            <div key={data._id}>
                <h3>{data.name}</h3>
                <p>{data.start_at}</p>
                <p>{data.players.length}</p>
                <Link to={{pathname : "/public/championship/detail", state: {data: data}}}>Detail</Link>
            </div>
        );
    }

    handleDetailClick = event => {
        this.setState({
            data: [],
            state: event.target.getAttribute("data-value")
        }, () => {
            this.getChampionship(this.state.state);
        });

    }

    render(){
        return (
            <div className="championshipList">
                <nav>
                    <ul>
                        <li><h1>{this.state.state}</h1></li>
                        <li><button data-value="open" onClick={this.handleDetailClick}>Open</button></li>
                        <li><button data-value="close" onClick={this.handleDetailClick}>Close</button></li>
                        <li><button data-value="finished" onClick={this.handleDetailClick}>Finished</button></li>
                    </ul>
                </nav>
                <List data={this.state.data}/>
            </div>
        );
    }

}