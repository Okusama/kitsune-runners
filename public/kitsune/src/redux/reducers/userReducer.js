import {USER} from "../constants";
import {cloneObject} from "../../utils/redux";

const initalState = {
    user: {
        id: "",
        avatar: "",
        isLogin: false,
        isAdmin: false,
        token: "",
    }
};

export default function userReducer(state = initalState, action){

    const TOKEN = localStorage.getItem("token");

    switch (action.type) {

        case USER.ADMIN: {

            let user = {
                id: action.id,
                avatar: action.avatar,
                isLogin: true,
                isAdmin: true,
                token: TOKEN
            };

            return cloneObject(state, {user});

        } case USER.LOGIN: {

            let user = {
                id: action.id,
                avatar: action.avatar,
                isLogin: true,
                isAdmin: false,
                token: TOKEN
            };

            return cloneObject(state, {user});

        } case USER.LOGOUT: {

            let user = {
                id: "",
                avatar: "",
                isLogin: false,
                isAdmin: false,
                token: TOKEN
            };

            return cloneObject(state, {user});

        } default: {

            return state;

        }

    }

}