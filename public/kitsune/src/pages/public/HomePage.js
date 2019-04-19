import React, {Component} from "react";

export default class HomePage extends Component {
    render(){
        return(
            <div className="homePage">
                <h1>Tournament & Race Tool</h1>
                <img src={require("../../styles/images/logo.png")} alt="Kitsune Logo"/>
            </div>
        );
    }
}