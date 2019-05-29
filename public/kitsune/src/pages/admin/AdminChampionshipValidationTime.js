import React, {Component} from "react";
import {validateOrRejectRun} from "../../utils/Api";

export default class AdminChampionshipValidationTime extends Component {

    constructor(props){
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            championship: this.props.location.state.championship
        }
    }

    onValidateOrRejectRun = (runId, action) => {

        let sendData = {
            token: this.state.token,
            championship_id: this.state.championship._id,
            run_id: runId,
            action: action
        };

        validateOrRejectRun(sendData).then(json => {
            return json.json();
        }).then(response => {
            console.log(response);
        });

    }

    renderTempRunItem = () => {

        return this.state.championship.temp_run.map(run => {
            return(
                <div key={run.run_id}>
                    <p>Player: {run.user_pseudo}</p>
                    <p>Game: {run.game}</p>
                    <p>Time: {run.time}</p>
                    <p>Score: {run.score}</p>
                    <p>Video Link: {run.video_link}</p>
                    <button onClick={() => this.onValidateOrRejectRun(run.run_id, "validate")}>Validate</button>
                    <button onClick={() => this.onValidateOrRejectRun(run.run_id, "reject")}>Reject</button>
                </div>
            );
        });

    }

    render(){
        return(
            <div>
                {this.renderTempRunItem()}
            </div>
        );
    }

}
