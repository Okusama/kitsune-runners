import React, {Component} from "react";
import {connect} from "react-redux";
import socketIOClient from "socket.io-client";

import {startAdminTimer} from "../../utils/Api";
import {runActionSetCurrentTime} from "../../redux/actions";

class Timer extends Component {

    constructor(props){
        super(props);
        this.state = {
            start: 0,
            diff: 0,
            timer: "0:00:00"
        };

        this.timerId = null;

    }

    componentDidMount() {

        const socket = socketIOClient("https://aqueous-taiga-46436.herokuapp.com");

        if (!this.props.user.isAdmin){
            socket.on("startPlayerTimer", () => {
                this.startPlayerTimer();
            });
        }

    }

    startPlayerTimer = () => {
        this.onStartTimer();
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    tick = () => {

        let end = new Date();

        new Promise( resolve => {
            this.setState({
                diff: end - this.state.start
            });
            resolve();
        }).then(() => {
            this.setState({
                diff: new Date(this.state.diff)
            });
            return true;
        }).then(() => {
            let sec = this.state.diff.getSeconds();
            let min = this.state.diff.getMinutes();
            let hr = this.state.diff.getHours() - 1;

            if (min < 10){
                min = "0" + min;
            }
            if (sec < 10){
                sec = "0" + sec;
            }

            this.setState({
                timer: hr + ":" + min + ":" + sec
            });

            this.props.runActionSetCurrentTime(this.state.timer);

        });
    }

    onStartTimer = () => {

        new Promise( resolve => {

            this.setState({
                start: new Date()
            });

            resolve();

        }).then(() => {

            if (this.props.user.isAdmin){
                startAdminTimer();
            }

            this.timerId = setInterval(this.tick, 1000);

        });

    }

    onStopTimer = () => {
        clearInterval(this.timerId);
    }

    onContinueTimer = () => {

        new Promise(resolve => {
            this.setState({
                start: new Date() - this.state.diff
            });
            resolve()
        }).then(() => {
           this.setState({
               start: new Date(this.state.start)
           });
           return true;
        }).then(() => {
            this.timerId = setInterval(this.tick, 1000);
        });

    }

    onResetTimer = () => {

        this.setState({
            timer: "0:00:00",
            start: new Date()
        });

        clearInterval(this.timerId);

    }

    renderTimerButton(){
        if (this.props.user.isAdmin && this.props.isControl){
            return(
                <div>
                    <button className="button-form" onClick={this.onStartTimer}>Start</button>
                    <button className="button-form" onClick={this.onStopTimer}>Stop</button>
                    <button className="button-form" onClick={this.onContinueTimer}>Continue</button>
                    <button className="button-form" onClick={this.onResetTimer}>Reset</button>
                </div>
            );
        }
    }

    render(){
        return(
            <div className="timer">
                {this.renderTimerButton()}
                <h2>{this.state.timer}</h2>
            </div>
        );
    }
}

const NewTimerWithRedux = connect(state => ({
        user: state.user.user
    }),{
        runActionSetCurrentTime
    }
)(Timer);

export default NewTimerWithRedux;