import {USER} from "../constants";
import {cloneObject} from "../../utils/redux";

const initalState = {
    id: "",
    avatar: "",
    isLogin: false,
    isAdmin: false,
    token: ""
};

export default function userReducer(state = initalState, action){

    const TOKEN = localStorage.getItem("token");

    switch (action.type) {

        case USER.ADMIN: {

                let id = action.id;
                let avatar = action.avatar;
                let isLogin = true;
                let isAdmin = true;
                let token = TOKEN;

            return cloneObject(state, {id, avatar, isLogin, isAdmin, token});

        } case USER.LOGIN: {

            let id = action.id;
            let avatar = action.avatar;
            let isLogin = true;
            let isAdmin = false;
            let token = TOKEN;

            return cloneObject(state, {id, avatar, isLogin, isAdmin, token});

        } case USER.LOGOUT: {

            let id = "";
            let avatar = "";
            let isLogin = false;
            let isAdmin = false;
            let token = TOKEN;

            return cloneObject(state, {id, avatar, isLogin, isAdmin, token});

        } case USER.UPDATE_AVATAR: {

            let avatar = action.avatar;

            return cloneObject(state, {avatar});

        } default: {

            return state;

        }

    }

}