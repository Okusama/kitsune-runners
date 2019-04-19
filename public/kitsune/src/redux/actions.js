import {RUN, TIMER, USER} from "./constants";

/*User Action*/
export function runActionUserLogin(id, avatar){
    return {type: USER.LOGIN, id, avatar};
}

export function runActionUserLogout(){
    return {type: USER.LOGOUT};
}

export function runActionUserAdmin(id, avatar){
    return {type: USER.ADMIN, id, avatar};
}

/*Matches Action*/
export function runActionGetMatches(matches){
    return {type: RUN.GET_MATCHES, matches};
}

export function runActionToggleSelectedMatch(match_id, isSelected){
    return {type: RUN.TOGGLE_SELECTED_MATCH, match_id, isSelected};
}

export function runActionGetMatchSelected(){
    return {type: RUN.GET_MATCHES_SELECTED};
}

export function runActionSetMatchSelected(matches){
    return {type: RUN.SET_MATCHES_SELECTED, matches};
}

export function runActionStopPlayerTime(time, playerId) {
    return {type: RUN.STOP_PLAYER_TIME, time, playerId}
}

export function runActionClearMatchSelected(){
    return {type: RUN.CLEAR_MATCHES_SELECTED};
}

/*Timer Action*/
export function runActionSetCurrentTime(time){
    return {type: TIMER.SET_CURRENT_TIME, time};
}