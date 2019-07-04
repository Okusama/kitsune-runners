import React, {Component} from "react";
import {List} from "../../components/layout/List";
import {changeUserRole, getUsersByRole} from "../../utils/Api";

export default class AdminUserPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            role: "visitor",
            data: []
        };
        this.getUsers(this.state.role);
    }

    getUsers = (role) => {
        let sendData = {
            token: this.state.token,
            role: role
        };
        getUsersByRole(sendData).then(json => {
            return json.json();
        }).then(res => {
           let datas = res.res;
           for (let user of datas){
               let newElement = {
                   key: user._id,
                   data: this.constructAdminUserItemList(user)
               };
                this.setDataListState(newElement);
           }
        }).catch(err => {
            console.log(err);
        });
    }

    setDataListState = (newElement) => {
        this.setState(prevState => ({
            data: [...prevState.data, newElement]
        }));
    }

    handleClickChangeRole = event => {
        let sendData = {
            token: this.state.token,
            user_id: event.target.getAttribute("data-id"),
            role: event.target.getAttribute("data-value")
        }

        changeUserRole(sendData).then(json => {
            return json.json();
        }).then(res => {
           console.log(res);
        });

    }

    constructAdminUserItemList = (data) => {
        let button;
        switch (this.state.role) {
            case "visitor":
                button = <button data-value="player" data-id={data._id} onClick={this.handleClickChangeRole}>Actived Account</button>;
                break;
            case "player":
                button = <button data-value="visitor" data-id={data._id} onClick={this.handleClickChangeRole}>Desactived Account</button>;
                break;
            default:
                break;
        }
        return(
            <div key={data._id}>
                <h3>{data.pseudo}</h3>
                {button}
            </div>
        );
    }

    handleDetailClick = event => {
        this.setState({
            data: [],
            role: event.target.getAttribute("data-value")
        }, () => {
            this.getUsers(this.state.role);
        });

    }

    render(){
        return(
            <div>
                <div>
                    <button data-value="visitor" onClick={this.handleDetailClick}>Visitor</button>
                    <button data-value="player" onClick={this.handleDetailClick}>Player</button>
                    <h2>{this.state.role} user</h2>
                    <List data={this.state.data}/>
                </div>
            </div>
        );
    }

}