import openSocket from "socket.io-client";

//const url = "https://aqueous-taiga-46436.herokuapp.com";
const url = "http://localhost:8000";
const socket = openSocket(url);
const headers = {
    "Content-Type": "application/json",
};

const postDataOption = data => {
    return {
        method: "POST",
        body: JSON.stringify(data),
        headers: headers
    }
};

/*Users*/
export const signup = data => {
    return fetch(url + "/user/signup", postDataOption(data));
};

export const signin = data => {
    return fetch(url + "/user/signin", postDataOption(data));
};

export const authenticated = data => {
    return fetch(url + "/user/authenticated", postDataOption(data));
};

export const getUsersByRole = data => {
    return fetch(url + "/user/getByRole", postDataOption(data));
};

export const changeUserRole = data => {
    return fetch(url + "/user/changeRole", postDataOption(data));
};

export const registerTwitchLoginAndAvatar = data => {
    return fetch(url + "/user/registerTwitchLoginAndAvatar", postDataOption(data));
}

/*Tournament*/
export const getTournamentByState = data => {
    return fetch(url + "/tournament/getByState", postDataOption(data))
};

export const createTournament = data => {
    return fetch(url + "/tournament/create", postDataOption(data))
};

export const changeTournamentState = data => {
    return fetch(url + "/tournament/changeState", postDataOption(data))
};

export const registerTournament = data => {
    return fetch(url + "/tournament/register", postDataOption(data))
};

export const unregisterTournament = data => {
    return fetch(url + "/tournament/unregister", postDataOption(data))
};

export const startTournament = data => {
    return fetch(url + "/tournament/start", postDataOption(data));
};

export const getOpenMatches = data => {
    return fetch(url + "/tournament/getOpenMatches", postDataOption(data))
};

export const initRound = data => {
    return fetch(url + "/tournament/initRound", postDataOption(data));
};

export const getRound = data => {
    return fetch(url + "/tournament/getRound", postDataOption(data));
};

export const validateScoreRound = data => {
    return fetch(url + "/tournament/validateScoreRound", postDataOption(data));
};

export const clearRound = data => {
    return fetch(url + "/tournament/clearRound", postDataOption(data));
};

/*Race*/

export const createRace = data => {
    return fetch(url + "/race/create", postDataOption(data));
};

export const getRaceByState = data => {
    return fetch(url + "/race/getByState", postDataOption(data))
};

export const registerRace = data => {
    return fetch(url + "/race/register", postDataOption(data))
};

export const unregisterRace = data => {
    return fetch(url + "/race/unregister", postDataOption(data))
};

export const setRaceResult = data => {
    return fetch(url + "/race/setRaceResult", postDataOption(data))
};

/*ChampionShip*/
export const getChampionshipByState = data => {
    return fetch(url + "/championship/getByState", postDataOption(data));
};

export const createChampionship = data => {
    return fetch(url + "/championship/create", postDataOption(data))
};

export const changeChampionshipState = data => {
    return fetch(url + "/championship/changeState", postDataOption(data))
};

export const registerChampionship = data => {
  return fetch(url + "/championship/register", postDataOption(data))
};

export const updateGameParam = data => {
    return fetch(url + "/championship/updateGameParam", postDataOption(data));
};

export const submitRun = data => {
    return fetch(url + "/championship/submitRun", postDataOption(data));
};

export const validateOrRejectRun = data => {
    return fetch(url + "/championship/validateOrRejectRun", postDataOption(data));
};

/*Timer*/
export const startAdminTimer = () => {
    socket.emit("adminStartTimer");
};

export const adminStopPlayerTimer = (time, playerId) => {
    socket.emit("adminStopPlayerTimer", time, playerId);
};

export const playerStopPlayerTimer = (time, playerId) => {
    socket.emit("playerStopPlayerTimer", time, playerId);
};