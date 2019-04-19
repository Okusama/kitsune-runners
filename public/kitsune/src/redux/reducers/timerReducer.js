import {TIMER} from "../constants";
import {cloneObject} from "../../utils/redux";

const initalState = {
    timer: "0:00:00"
}

export default function timerReducer(state = initalState, action){

    switch(action.type){
        case TIMER.SET_CURRENT_TIME: {

            let timer = action.time;

            return cloneObject(state, {timer});

        } default: {

            return state;

        }
    }

}