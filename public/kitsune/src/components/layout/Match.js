import React, {Component} from "react";
import {connect} from "react-redux";
import {runActionToggleSelectedMatch} from "../../redux/actions";

class Match extends Component {

    onToggleSelectedMatch = (event) => {
        this.props.runActionToggleSelectedMatch(this.props.matchId, event.target.checked);
    }

    render(){

        let input = null;

        if (this.props.hasOwnProperty("isSelected")) {
            input = <input checked={this.props.isSelected} type="checkbox" onChange={this.onToggleSelectedMatch}/>
        }

        return(
            <article className="match">
                {input}
                <div>
                    <p>{this.props.player1Pseudo}</p>
                    <p>{this.props.player1Time}</p>
                </div>
                <div>
                    <p>{this.props.player2Pseudo}</p>
                    <p>{this.props.player2Time}</p>
                </div>
            </article>
        );
    }

}

const NewMatchWithRedux = connect(null,{
        runActionToggleSelectedMatch
    }
)(Match);

export default NewMatchWithRedux;