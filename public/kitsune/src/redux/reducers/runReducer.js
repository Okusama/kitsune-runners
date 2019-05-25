import {RUN} from "../constants";
import {cloneObject} from "../../utils/redux";

const initalState = {
    matchList: [],
    matchSelected: [],
    racePlayers: []
}

export default function runReducer(state = initalState, action){

    switch(action.type){

        case RUN.TOURNAMENT.GET_MATCHES : {

            let matchList = [];

            for (let match of action.matches){
                match["isSelected"] = false;
                matchList.push(match);
            }

            return cloneObject( state, {matchList});

        } case RUN.TOURNAMENT.TOGGLE_SELECTED_MATCH : {

            let matchList = state.matchList.map( match => {
               if (match.match_id === action.match_id){
                   match.isSelected = action.isSelected;
               }
               return match;
            });

            return cloneObject(state, {matchList});

        } case RUN.TOURNAMENT.GET_MATCHES_SELECTED : {

            let matchSelected = state.matchList.filter(match => match.isSelected === true);

            return cloneObject(state, {matchSelected});

        } case RUN.TOURNAMENT.SET_MATCHES_SELECTED : {

            let matchSelected = action.matches;

            return cloneObject(state, {matchSelected});

        } case RUN.TOURNAMENT.STOP_PLAYER_TIME : {

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

        } case RUN.TOURNAMENT.CLEAR_MATCHES_SELECTED : {

            let matchSelected = [];

            return cloneObject(state, {matchSelected});

        } case RUN.RACE.SET_PLAYER : {

            let racePlayers = action.players;

            return cloneObject(state, {racePlayers});

        } case RUN.RACE.STOP_PLAYER_TIME : {

            let time = action.time;

            let racePlayers = state.racePlayers.map(player => {

                if (player.id === action.playerId) {
                    player.time = time;
                }

                return player;

            });

            return cloneObject(state, {racePlayers});

        } default : {

            return state;

        }

    }

}