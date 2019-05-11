import React, {Component} from "react"
import {getRaceByState, getTournamentByState} from "../../utils/Api";

export default class RaceList extends Component {

    constructor(props){
        super(props);
    }


    render() {
        return(
          <div>
              <h2>Race List</h2>
          </div>
        );
    }

}