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
    return {type: RUN.TOURNAMENT.GET_MATCHES, matches};
}

export function runActionToggleSelectedMatch(match_id, isSelected){
    return {type: RUN.TOURNAMENT.TOGGLE_SELECTED_MATCH, match_id, isSelected};
}

export function runActionGetMatchSelected(){
    return {type: RUN.TOURNAMENT.GET_MATCHES_SELECTED};
}

export function runActionSetMatchSelected(matches){
    return {type: RUN.TOURNAMENT.SET_MATCHES_SELECTED, matches};
}

export function runActionTournamentStopPlayerTime(time, playerId) {
    return {type: RUN.TOURNAMENT.STOP_PLAYER_TIME, time, playerId}
}

export function runActionClearMatchSelected(){
    return {type: RUN.TOURNAMENT.CLEAR_MATCHES_SELECTED};
}

export function runActionSetRacePlayers(players){
    return {type: RUN.RACE.SET_PLAYER, players}
}

export function runActionRaceStopPlayerTime(time, playerId) {
    return {type: RUN.RACE.STOP_PLAYER_TIME, time, playerId}
}

/*Timer Action*/
export function runActionSetCurrentTime(time){
    return {type: TIMER.SET_CURRENT_TIME, time};
}