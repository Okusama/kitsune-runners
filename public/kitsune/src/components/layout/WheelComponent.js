import React, {Component} from "react";

export default class WheelComponent extends Component {

    constructor(props){

        super(props);

        this.state = {
            spinClass: false,
            games: [
                <div className="sec"><span>1</span></div>,
                <div className="sec"><span>2</span></div>,
                <div className="sec"><span>3</span></div>,
                <div className="sec"><span>4</span></div>,
                <div className="sec"><span>5</span></div>,
                <div className="sec"><span>6</span></div>
            ]
        };

        this.degree = 1800;
        this.clicks = 0;

    }

    onSpin = () => {

        this.clicks++;

        let newDegree = this.degree * this.clicks;
        let extraDegree = Math.floor(Math.random() * (360 - 1 + 1)) + 1;

        console.log(this.state.games);

        for (let slot of this.state.games) {
            console.log(slot);
            let aoY = slot.offset().top;
        }

        /*for (let slot of this.game){

            console.log(slot);

            let noY = 0;

            let c = 0;
            let n = 700;
            let interval = setInterval(() => {
                c++;
                if (c === n) {
                    clearInterval(interval);
                }

                //let aoY = slot.offset().top;

                /*if(aoY < 23.89){
                    this.setState({
                        spinClass: true
                    });
                    setTimeout(() => {
                        this.setState({
                            spinClass: false
                        });
                    }, 100);
                }
            }, 10);

            $('#inner-wheel').css({
                'transform' : 'rotate(' + totalDegree + 'deg)'
            });

            noY = slot.offset().top;

        }*/

    }

    render(){
        return(
            <div id="wrapper">
                <div id="wheel">
                    <div id="inner-wheel">
                        {this.state.games.map(slot => slot)}
                    </div>
                    <div id="spin" className={this.state.spinClass ? "spin" : ""} onClick={this.onSpin}>
                        <div id="inner-spin"></div>
                    </div>
                    <div id="shine"></div>
                </div>
            </div>
        );
    }

}