import React, {Component} from "react";

export default class AdminMatchManagement extends Component {

    onStopPlayerTime = (event) => {
        let playerId = event.target.getAttribute("data-id");
        this.props.onStopPlayerTime(playerId);
    }

    render(){
        return(
            <article className="matchManagement">
                {this.props.children}
                <div>
                    <button type="button" data-id={this.props.player1.id} data-challonge={this.props.player1.challonge_id} onClick={this.onStopPlayerTime}>Stop {this.props.player1.pseudo}</button>
                    <button type="button" data-id={this.props.player2.id} data-challonge={this.props.player2.challonge_id} onClick={this.onStopPlayerTime}>Stop {this.props.player2.pseudo}</button>
                </div>
            </article>
        );
    }

}