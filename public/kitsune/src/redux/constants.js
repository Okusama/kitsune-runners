/*User*/
export const USER = {
    LOGIN: "USER_LOGIN",
    LOGOUT: "USER_LOGOUT",
    ADMIN: "USER_ADMIN",
    UPDATE_AVATAR: "USER_UPDATE_AVATAR"
};

/*Current Run*/
export const RUN = {
    TOURNAMENT: {
        GET_MATCHES: "RUN_TOURNAMENT_GET_MATCHES",
        TOGGLE_SELECTED_MATCH: "RUN_TOURNAMENT_TOGGLE_SELECTED_MATCH",
        GET_MATCHES_SELECTED: "RUN_TOURNAMENT_GET_MATCHES_SELECTED",
        SET_MATCHES_SELECTED: "RUN_TOURNAMENT_SET_MATCHES_SELECTED",
        STOP_PLAYER_TIME: "RUN_TOURNAMENT_STOP_PLAYER_TIME",
        CLEAR_MATCHES_SELECTED: "RUN_TOURNAMENT_CLEAR_MATCHES_SELECTED"
    },
    RACE:{
        SET_PLAYER: "RUN_RACE_SET_PLAYER",
        STOP_PLAYER_TIME: "RUN_RACE_STOP_PLAYER_TIME"
    }
};

export const TIMER = {
    SET_CURRENT_TIME: "TIMER_SET_CURRENT_TIME"
};



