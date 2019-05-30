import React, {Component} from "react";
import {submitRun} from "../../utils/Api";

export default class ChampionshipSubmitPlayerTime extends Component {

    constructor(props){
        super(props);

        let championship = this.props.location.state.championship;

        this.state = {
            token: localStorage.getItem("token"),
            championship_id: championship._id,
            gamesParams: championship.params[0],
            games: championship.games,
            selectedGame: championship.games[0],
            playerTime: "0:00:00",
            videoLink: "",
        };
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    convertTimeStringtoTimeInSec = (sTime) => {

        let aTime = sTime.split(":");
        return (+aTime[0]) * 60 * 60 + (+aTime[1]) * 60 + (+aTime[2]);

    }

    /**
     * @param timeMin xA Coords Minimum time for game in sec
     * @param pointMax yA Coords Max point fix 200 points
     * @param medianTime xB Coords x Mediant Point fix to x Mediant
     * @param coef yB Coords Set difficulty level to gain Max Point 50: hard , 100: medium, 150 : easy
     * @param timeMax xC Coords Max time for game in sec
     * @param pointMin yC Coords Min point fix 0 point
     * @param playerTime xT Player time in sec
     * @returns {*} Score (yT) found by Time (xT)
     */
    calcScoreByTime = (timeMin, pointMax, medianTime, coef, timeMax, pointMin, playerTime) => {

        let xA2 = Math.pow(timeMin, 2);
        let xB2 = Math.pow(medianTime, 2);

        let a = (pointMax * (timeMax - medianTime) + coef * (timeMin - timeMax) + pointMin * (medianTime - timeMin)) / (xA2 * (timeMax - medianTime) + xB2 * (timeMin - timeMax) + Math.pow(timeMax, 2) * (medianTime - timeMin));
        let b = (a * (xA2 - xB2) - pointMax + coef) / (medianTime - timeMin);
        let c = -(a * xA2) - b * timeMin + pointMax;

        return a * Math.pow(playerTime, 2) + b * playerTime + c;

    }

    /**
     * @param min String Time minimum of game Format "0:00:00"
     * @param max String Time maximum of game Format "0:00:00"
     * @param time String Time submit by player Format "0:00:00"
     * @param difficultyCoef Int Difficulty coeficiant of game Format 1 || 2 || 3
     * @returns {number}
     */
    getScore = (min, max, time, difficultyCoef) => {

        /*Coef is include between 50 and 150 and represent the y of Mediant Point
        * Must be between this number
        **/
        let calcCoef;

        switch (difficultyCoef) {
            /*Easy*/
            case 1 : {
                calcCoef = 150;
                break;
                /*Medium*/
            } case 2 : {
                calcCoef = 100;
                break;
                /*Hard*/
            } case 3 : {
                calcCoef = 50;
                break;
            } default : {
                calcCoef = 100;
                break;
            }
        }

        /*Convert String Time To Time in sec*/
        min = this.convertTimeStringtoTimeInSec(min);
        max = this.convertTimeStringtoTimeInSec(max);
        time = this.convertTimeStringtoTimeInSec(time);


        return Math.round(this.calcScoreByTime(min, 200, min + (max - min) / 2, calcCoef, max, 0, time));

    }

    onSubmitValidateTimeForm = (event) => {

        event.preventDefault();

        if(this.state.selectedGame.length === 0) return;
        if(this.state.playerTime.length === 0) return;
        if(this.state.videoLink.length === 0) return;

        let min = this.state.gamesParams[this.state.selectedGame].min;
        let max = this.state.gamesParams[this.state.selectedGame].max;
        let time = this.state.playerTime;
        let difficultyCoef = this.state.gamesParams[this.state.selectedGame].difficulty_coef;

        let score = this.getScore(min, max, time, difficultyCoef);

        let sendData = {
            token: this.state.token,
            championship_id: this.state.championship_id,
            game: this.state.selectedGame,
            score: score,
            time: this.state.playerTime,
            video_link: this.state.videoLink
        }

        submitRun(sendData).then(json => {
            return json.json();
        }).then(res => {
            console.log(res);
        })


    }

    render(){
        return(
            <div className="submitPlayerTime">
                <form>
                    <label htmlFor="selectedGame">Game :</label>
                    <select name="selectedGame" id="selectedGame" onChange={this.handleChange} value={this.state.selectedGame}>
                        {
                            this.state.games.map(game => {
                                return(<option value={game}>{game}</option>);
                            })
                        }
                    </select>
                    <label htmlFor="playerTime">Time</label>
                    <input type="text" name="playerTime" id="playerTime" onChange={this.handleChange} value={this.state.playerTime}/>
                    <label htmlFor="videoLink">Video Link</label>
                    <input type="text" name="videoLink" id="videoLink" onChange={this.handleChange} value={this.state.videoLink}/>
                    <button className="button-form" type="button" onClick={this.onSubmitValidateTimeForm}>Submit</button>
                </form>
            </div>
        );
    }

}