import {RUN} from "../constants";
import {cloneObject} from "../../utils/redux";

const initalState = {
    matchList: [],
    matchSelected: [],
}

export default function runReducer(state = initalState, action){

    switch(action.type){

        case RUN.GET_MATCHES : {

            let matchList = [];

            for (let match of action.matches){
                match["isSelected"] = false;
                matchList.push(match);
            }

            return cloneObject( state, {matchList});

        } case RUN.TOGGLE_SELECTED_MATCH : {

            let matchList = state.matchList.map( match => {
               if (match.match_id === action.match_id){
                   match.isSelected = action.isSelected;
               }
               return match;
            });

            return cloneObject(state, {matchList});

        } case RUN.GET_MATCHES_SELECTED : {

            let matchSelected = state.matchList.filter(match => match.isSelected === true);

            return cloneObject(state, {matchSelected});

        } case RUN.SET_MATCHES_SELECTED : {

            let matchSelected = action.matches;

            return cloneObject(state, {matchSelected});

        } case RUN.STOP_PLAYER_TIME : {

            let time = action.time;

            let matchSelected = state.matchSelected.map(match => {

                if (match.player1.id === action.playerId){
                    match.player1.time = time;
                } else if (match.player2.id === action.playerId) {
                    match.player2.time = time;
                }

                return match;

            });

            return cloneObject(state, {matchSelected});

        } case RUN.CLEAR_MATCHES_SELECTED : {

            let matchSelected = [];

            return cloneObject(state, {matchSelected});

        } default: {

            return state;

        }

    }

}